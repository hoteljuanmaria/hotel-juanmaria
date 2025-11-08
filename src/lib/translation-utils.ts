import * as deepl from 'deepl-node'
import type { Field } from 'payload'
import { translationConfig } from '../config/translation-config'
import { translationCache } from './services/translation-cache'
import { BatchTranslator } from './utils/batch-translator'

export interface TranslatableField {
  name: string
  type: 'text' | 'textarea' | 'richText'
  path: string
}

export class TranslationService {
  private translator: deepl.Translator | null = null
  private batchTranslator: BatchTranslator | null = null
  private initPromise: Promise<void> | null = null

  constructor() {
    // Lazy initialization - only initialize when first used
  }

  private async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.doInitialize()
    return this.initPromise
  }

  private async doInitialize(): Promise<void> {
    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      throw new Error('DEEPL_API_KEY environment variable is required')
    }

    this.translator = new deepl.Translator(apiKey)
    this.batchTranslator = new BatchTranslator(this.translator)

    console.log('[TranslationService] Initialized with DeepL API')
  }

  async isReady(): Promise<boolean> {
    try {
      await this.initialize()
      if (!this.translator) return false
      
      await this.translator.getUsage()
      return true
    } catch (error) {
      console.error('[TranslationService] Service not ready:', error)
      return false
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    context: string = 'translation'
  ): Promise<T> {
    const { maxRetries, baseDelay, maxDelay } = translationConfig.retryOptions
    
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          console.error(`[TranslationService] ${context} failed after ${maxRetries + 1} attempts:`, error)
          throw error
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
        console.warn(`[TranslationService] ${context} attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }

  async translateText(text: string, sourceLanguage: string = 'es', targetLanguage: string = 'en'): Promise<string> {
    if (!text || text.trim() === '') {
      return text
    }

    await this.initialize()

    // Check cache first
    const cacheKey = {
      text,
      source: sourceLanguage,
      target: targetLanguage,
      type: 'text' as const
    }

    const cached = translationCache.get(cacheKey)
    if (cached) {
      return cached
    }

    return this.withRetry(async () => {
      const deepLSourceLang = translationConfig.deeplLanguageMapping[sourceLanguage] || sourceLanguage
      const deepLTargetLang = translationConfig.deeplLanguageMapping[targetLanguage] || targetLanguage
      
      const result = await this.translator!.translateText(
        text,
        deepLSourceLang as deepl.SourceLanguageCode,
        deepLTargetLang as deepl.TargetLanguageCode
      )
      
      const translatedText = Array.isArray(result) ? result[0].text : result.text
      
      // Cache the result
      translationCache.set(cacheKey, translatedText)
      
      return translatedText
    }, `translateText(${sourceLanguage}->${targetLanguage})`)
  }

  async translateRichText(richTextData: any, sourceLanguage: string = 'es', targetLanguage: string = 'en'): Promise<any> {
    if (!richTextData || !richTextData.root) {
      return richTextData
    }

    await this.initialize()

    // Create cache key for entire rich text structure
    const textContent = this.extractTextFromRichText(richTextData)
    const cacheKey = {
      text: textContent,
      source: sourceLanguage,
      target: targetLanguage,
      type: 'richText' as const
    }

    const cached = translationCache.get(cacheKey)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        // Cache corruption, continue with fresh translation
      }
    }

    return this.withRetry(async () => {
      const translateNode = async (node: any): Promise<any> => {
        if (!node) return node

        const translatedNode = { ...node }

        if (node.type === 'text' && node.text) {
          translatedNode.text = await this.translateText(node.text, sourceLanguage, targetLanguage)
        }

        if (node.children && Array.isArray(node.children)) {
          translatedNode.children = await Promise.all(
            node.children.map(translateNode)
          )
        }

        return translatedNode
      }

      const result = {
        ...richTextData,
        root: await translateNode(richTextData.root)
      }

      // Cache the result
      translationCache.set(cacheKey, JSON.stringify(result))

      return result
    }, `translateRichText(${sourceLanguage}->${targetLanguage})`)
  }

  private extractTextFromRichText(richTextData: any): string {
    const extractText = (node: any): string => {
      if (!node) return ''
      
      if (node.type === 'text' && node.text) {
        return node.text
      }
      
      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join(' ')
      }
      
      return ''
    }

    return extractText(richTextData.root)
  }

  /**
   * Batch translate multiple fields for better performance
   */
  async translateFields(
    fields: { field: TranslatableField; value: any; key: string }[],
    sourceLanguage: string = 'es',
    targetLanguage: string = 'en'
  ): Promise<Record<string, any>> {
    if (!this.batchTranslator) {
      await this.initialize()
    }

    const results: Record<string, any> = {}
    
    const translations = await Promise.allSettled(
      fields.map(async ({ field, value, key }) => {
        if (field.type === 'richText') {
          return {
            key,
            value: await this.translateRichText(value, sourceLanguage, targetLanguage)
          }
        } else {
          const translatedValue = await this.batchTranslator!.translate(
            { field, sourceValue: value as string, key },
            sourceLanguage,
            targetLanguage
          )
          return { key, value: translatedValue }
        }
      })
    )

    for (const result of translations) {
      if (result.status === 'fulfilled') {
        results[result.value.key] = result.value.value
      } else {
        console.error('[TranslationService] Field translation failed:', result.reason)
      }
    }

    return results
  }
}

export function getTranslatableFields(fields: Field[], parentPath: string = ''): TranslatableField[] {
  const translatableFields: TranslatableField[] = []

  for (const field of fields) {
    if ('name' in field) {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name

      // Check if field has localized property and it's true
      if ('localized' in field && field.localized === true) {
        if (field.type === 'text' || field.type === 'textarea') {
          translatableFields.push({
            name: field.name,
            type: field.type,
            path: fieldPath
          })
        } else if (field.type === 'richText') {
          translatableFields.push({
            name: field.name,
            type: 'richText',
            path: fieldPath
          })
        }
      }

      if (field.type === 'group' && 'fields' in field) {
        translatableFields.push(
          ...getTranslatableFields(field.fields, fieldPath)
        )
      }

      if (field.type === 'array' && 'fields' in field) {
        translatableFields.push(
          ...getTranslatableFields(field.fields, `${fieldPath}.$`)
        )
      }

      if (field.type === 'blocks' && 'blocks' in field) {
        for (const block of field.blocks) {
          translatableFields.push(
            ...getTranslatableFields(block.fields, `${fieldPath}.${block.slug}`)
          )
        }
      }
    }

    if (field.type === 'tabs' && 'tabs' in field) {
      for (const tab of field.tabs) {
        if ('fields' in tab) {
          const tabPath = 'name' in tab && tab.name 
            ? `${parentPath ? parentPath + '.' : ''}${tab.name}`
            : parentPath
          
          translatableFields.push(
            ...getTranslatableFields(tab.fields, tabPath)
          )
        }
      }
    }
  }

  return translatableFields
}

export function getValueByPath(obj: any, path: string, locale: string = 'es'): any {
  if (!path) return obj
  
  const value = path.split('.').reduce((current, key) => {
    if (key === '$') return current // Array marker, skip
    return current?.[key]
  }, obj)
  
  // If the value is an object with locale keys (localized field)
  if (value && typeof value === 'object' && !Array.isArray(value) && locale in value) {
    return value[locale]
  }
  
  return value
}

export function setValueByPath(obj: any, path: string, value: any): void {
  if (!path) return

  const keys = path.split('.')
  const lastKey = keys.pop()
  
  if (!lastKey) return

  const target = keys.reduce((current, key) => {
    if (key === '$') return current // Array marker, skip
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)

  // Set the value directly (Payload will handle the locale structure)
  target[lastKey] = value
}

export function setValueByPathWithLocale(obj: any, path: string, value: any, locale: string = 'en'): void {
  if (!path) return

  const keys = path.split('.')
  const lastKey = keys.pop()
  
  if (!lastKey) return

  const target = keys.reduce((current, key) => {
    if (key === '$') return current // Array marker, skip
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)

  // If the target field already exists and is a localized object
  if (target[lastKey] && typeof target[lastKey] === 'object' && !Array.isArray(target[lastKey])) {
    // Set the value for the specific locale
    target[lastKey][locale] = value
  } else {
    // Create a new localized object
    target[lastKey] = {
      ...(target[lastKey] || {}),
      [locale]: value
    }
  }
}

export const translationService = new TranslationService()
