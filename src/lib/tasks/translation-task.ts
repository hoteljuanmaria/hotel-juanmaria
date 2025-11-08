import type { TaskConfig, CollectionSlug, TypedLocale } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { translationService, getTranslatableFields, getValueByPath, setValueByPath } from '../translation-utils'

export interface TranslationTaskInput {
  collection: string
  docId: string
  locale?: string
  targetLocale?: string
}

export interface TranslationTaskOutput {
  success: boolean
  message: string
  fieldsTranslated?: number
}

// Define TaskConfig with explicit input/output to satisfy Payload Task types
export const translationTask: TaskConfig<{ input: TranslationTaskInput; output: TranslationTaskOutput }> = {
  slug: 'translate-content',
  inputSchema: [
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'docId',
      type: 'text',
      required: true,
    },
    {
      name: 'locale',
      type: 'text',
      defaultValue: 'es',
    },
    {
      name: 'targetLocale',
      type: 'text',
      defaultValue: 'en',
    },
  ],
  handler: async ({ input, req }) => {
    const { collection: collectionSlug, docId, locale = 'es', targetLocale = 'en' } = input
    
    try {
      const payload = await getPayload({ config: configPromise })
      
      // Ensure the translation service has been initialized and is ready
      if (!(await translationService.isReady())) {
        throw new Error('Translation service is not ready. Please check your DEEPL_API_KEY.')
      }

      // Narrow the collection slug to the known keys of payload.collections
      const collections = payload.collections
      const collectionKey = collectionSlug as CollectionSlug
      const collection = collections[collectionKey]
      if (!collection) {
        throw new Error(`Collection ${collectionSlug} not found`)
      }

      console.log(`[TranslationTask] Starting translation for ${collectionSlug}:${docId} from ${locale} to ${targetLocale}`)

      const translatableFields = getTranslatableFields(collection.config.fields)
      
      if (translatableFields.length === 0) {
        console.log(`[TranslationTask] No translatable fields found in collection ${collectionSlug}`)
        return { output: { success: true, message: 'No translatable fields found' } }
      }

      console.log(`[TranslationTask] Found ${translatableFields.length} translatable fields:`, translatableFields.map(f => `${f.name} (${f.type})`))

      // Get both source and target documents in parallel with optimized queries
      const [sourceDoc, targetDoc] = await Promise.all([
        payload.findByID({
          collection: collectionKey,
          id: docId,
          locale: locale as TypedLocale,
          depth: 0,
        }),
        payload.findByID({
          collection: collectionKey,
          id: docId,
          locale: 'all',
          depth: 0,
        }).catch(() => null)
      ])

      if (!sourceDoc) {
        throw new Error(`Document ${docId} not found in collection ${collectionSlug}`)
      }

      const translatedData: Record<string, any> = {}
      
      // Prepare fields for batch translation
      const fieldsToTranslate: { field: typeof translatableFields[0]; value: string; key: string }[] = []
      
      for (const field of translatableFields) {
        const sourceValue = getValueByPath(sourceDoc, field.path, locale)
        const existingValue = targetDoc ? getValueByPath(targetDoc, field.path, targetLocale) : null

        console.log(`[TranslationTask] Processing field ${field.path}:`)
        console.log(`  - sourceValue: "${sourceValue}"`)
        console.log(`  - existingValue: "${existingValue}"`)

        // Skip if no source value or if target already has content
        if (!sourceValue || (existingValue && typeof existingValue === 'string' && existingValue.trim())) {
          console.log(`  - Skipped: no source (${!sourceValue}) or existing target (${existingValue && typeof existingValue === 'string' && existingValue.trim()})`)
          continue
        }

        fieldsToTranslate.push({
          field,
          value: sourceValue,
          key: field.path
        })
      }

      if (fieldsToTranslate.length === 0) {
        console.log(`[TranslationTask] No fields to translate for ${collectionSlug}:${docId}`)
        return { output: { success: true, message: 'No fields needed translation', fieldsTranslated: 0 } }
      }

      console.log(`[TranslationTask] Translating ${fieldsToTranslate.length} fields using batch processing`)

      try {
        // Use batch translation for better performance
        const translations = await translationService.translateFields(
          fieldsToTranslate,
          locale,
          targetLocale
        )

        // Set translated values
        let translatedFieldsCount = 0
        for (const [fieldPath, translatedValue] of Object.entries(translations)) {
          setValueByPath(translatedData, fieldPath, translatedValue)
          translatedFieldsCount++
          
          console.log(`[TranslationTask] Translated field ${fieldPath}: "${typeof translatedValue === 'string' ? translatedValue.substring(0, 50) + '...' : '[Rich Text]'}"`)
        }

        if (translatedFieldsCount > 0) {
          // Update with target locale specified
          await payload.update({
            collection: collectionKey,
            id: docId,
            data: translatedData,
            locale: targetLocale as TypedLocale,
            depth: 0,
            req,
          } as any)
        }

        console.log(`[TranslationTask] Successfully translated ${collectionSlug}:${docId} from ${locale} to ${targetLocale} (${translatedFieldsCount} fields)`)
        
        return {
          output: {
            success: true,
            message: `Successfully translated ${translatedFieldsCount} fields from ${locale} to ${targetLocale}`,
            fieldsTranslated: translatedFieldsCount,
          },
        }

      } catch (translationError) {
        console.error(`[TranslationTask] Batch translation failed for ${collectionSlug}:${docId}:`, translationError)
        throw translationError
      }

    } catch (error) {
      console.error('Translation task failed:', error)
      // Surface failure in the expected TaskHandlerResult shape
      return {
        errorMessage: error instanceof Error ? error.message : 'Unknown error in translation task',
        state: 'failed',
      }
    }
  },
}
