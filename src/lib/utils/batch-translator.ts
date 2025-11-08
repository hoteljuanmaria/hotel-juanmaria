import { translationConfig } from '../../config/translation-config'
import { translationCache } from '../services/translation-cache'
import type { TranslatableField } from '../translation-utils'

export interface BatchTranslationItem {
  field: TranslatableField
  sourceValue: string
  key: string // unique identifier for this translation
}

export interface BatchTranslationResult {
  key: string
  translatedValue: string
  error?: Error
}

export class BatchTranslator {
  private translator: any // DeepL translator instance
  private pendingBatch: PendingBatchItem[] = []
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly enabled: boolean
  private readonly maxBatchSize: number
  private readonly batchTimeoutMs: number

  constructor(translator: any) {
    this.translator = translator
    this.enabled = translationConfig.batchOptions.enabled
    this.maxBatchSize = translationConfig.batchOptions.maxBatchSize
    this.batchTimeoutMs = translationConfig.batchOptions.batchTimeout
  }

  /**
   * Add a translation item to the batch
   * Returns a promise that resolves when the translation is complete
   */
  async translate(
    item: BatchTranslationItem,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    // If batching is disabled, translate immediately
    if (!this.enabled) {
      return this.translateSingle(item, sourceLanguage, targetLanguage)
    }

    // Check cache first
    const cacheKey = {
      text: item.sourceValue,
      source: sourceLanguage,
      target: targetLanguage,
      type: item.field.type as 'text' | 'richText',
    }

    const cached = translationCache.get(cacheKey)
    if (cached) {
      return cached
    }

    return new Promise<string>((resolve, reject) => {
      // Add to batch with resolver
      const batchItem: PendingBatchItem = {
        ...item,
        sourceLanguage,
        targetLanguage,
        resolve,
        reject,
      }

      this.pendingBatch.push(batchItem)

      // Process batch if it's full
      if (this.pendingBatch.length >= this.maxBatchSize) {
        this.processBatch()
        return
      }

      // Set timeout to process batch if it's the first item
      if (this.pendingBatch.length === 1) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch()
        }, this.batchTimeoutMs)
      }
    })
  }

  private async translateSingle(
    item: BatchTranslationItem,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    const cacheKey = {
      text: item.sourceValue,
      source: sourceLanguage,
      target: targetLanguage,
      type: item.field.type as 'text' | 'richText',
    }

    // Check cache
    const cached = translationCache.get(cacheKey)
    if (cached) return cached

    // Translate
    const result = await this.translator.translateText(
      item.sourceValue,
      this.mapToDeepLCode(sourceLanguage),
      this.mapToDeepLCode(targetLanguage),
    )

    const translatedText = Array.isArray(result) ? result[0].text : result.text

    // Cache result
    translationCache.set(cacheKey, translatedText)

    return translatedText
  }

  private async processBatch(): Promise<void> {
    if (this.pendingBatch.length === 0) return

    // Clear timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }

    const batch: PendingBatchItem[] = [...this.pendingBatch]
    this.pendingBatch = []

    console.log(`[BatchTranslator] Processing batch of ${batch.length} translations`)

    try {
      // Group by language pair for efficiency
      const languagePairs = new Map<string, PendingBatchItem[]>()

      for (const item of batch) {
        const key = `${item.sourceLanguage}->${item.targetLanguage}`
        if (!languagePairs.has(key)) {
          languagePairs.set(key, [])
        }
        languagePairs.get(key)!.push(item)
      }

      // Process each language pair
      for (const [, items] of languagePairs) {
        await this.processBatchByLanguagePair(items)
      }
    } catch (error) {
      // Reject all pending items
      for (const item of batch) {
        item.reject(error)
      }
    }
  }

  private async processBatchByLanguagePair(items: PendingBatchItem[]): Promise<void> {
    if (items.length === 0) return

    const firstItem = items[0]
    const sourceLanguage = firstItem.sourceLanguage
    const targetLanguage = firstItem.targetLanguage

    // Prepare texts for batch translation
    const textsToTranslate = items.map((item) => item.sourceValue)

    try {
      // Batch translate all texts
      const results = await this.translator.translateText(
        textsToTranslate,
        this.mapToDeepLCode(sourceLanguage),
        this.mapToDeepLCode(targetLanguage),
      )

      // Process results
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const result = Array.isArray(results) ? results[i] : results
        const translatedText = result.text

        // Cache the result
        const cacheKey = {
          text: item.sourceValue,
          source: sourceLanguage,
          target: targetLanguage,
          type: item.field.type as 'text' | 'richText',
        }
        translationCache.set(cacheKey, translatedText)

        // Resolve the promise
        item.resolve(translatedText)
      }
    } catch (error) {
      console.error(
        `[BatchTranslator] Batch translation failed for ${sourceLanguage}->${targetLanguage}:`,
        error,
      )

      // Fallback to individual translations
      for (const item of items) {
        try {
          const result = await this.translateSingle(item, sourceLanguage, targetLanguage)
          item.resolve(result)
        } catch (singleError) {
          item.reject(singleError)
        }
      }
    }
  }

  private mapToDeepLCode(locale: string): string {
    return translationConfig.deeplLanguageMapping[locale] || locale
  }

  /**
   * Flush any pending batch immediately
   */
  async flush(): Promise<void> {
    if (this.pendingBatch.length > 0) {
      await this.processBatch()
    }
  }
}

// Internal type to represent queued batch items with resolver metadata
type PendingBatchItem = BatchTranslationItem & {
  sourceLanguage: string
  targetLanguage: string
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}
