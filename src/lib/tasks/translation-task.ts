import type { TaskConfig, CollectionSlug, GlobalSlug, TypedLocale } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { translationService, getTranslatableFields, getValueByPath, setValueByPath } from '../translation-utils'

export interface TranslationTaskInput {
  collection?: string
  global?: string
  docId?: string
  locale?: string
  targetLocale?: string
  forceRetranslate?: boolean
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
      required: false,
    },
    {
      name: 'global',
      type: 'text',
      required: false,
    },
    {
      name: 'docId',
      type: 'text',
      required: false,
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
    {
      name: 'forceRetranslate',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  handler: async ({ input, req }) => {
    const { collection: collectionSlug, global: globalSlug, docId, locale = 'es', targetLocale = 'en', forceRetranslate = false } = input
    
    try {
      const payload = await getPayload({ config: configPromise })
      
      // Validar que se proporcione collection o global, pero no ambos
      if ((!collectionSlug && !globalSlug) || (collectionSlug && globalSlug)) {
        throw new Error('Must provide either collection or global, but not both')
      }

      // Ensure the translation service has been initialized and is ready
      if (!(await translationService.isReady())) {
        throw new Error('Translation service is not ready. Please check your DEEPL_API_KEY.')
      }

      const isGlobal = !!globalSlug
      const entitySlug = (collectionSlug || globalSlug) as string
      const entityType = isGlobal ? 'global' : 'collection'

      console.log(`[TranslationTask] Starting translation for ${entityType} ${entitySlug}${docId ? `:${docId}` : ''} from ${locale} to ${targetLocale}`)

      // Get config based on type
      let config
      let translatableFields
      
      if (isGlobal) {
        const globalConfig = payload.config.globals?.find(g => g.slug === globalSlug)
        if (!globalConfig) {
          throw new Error(`Global ${globalSlug} not found`)
        }
        config = globalConfig
        translatableFields = getTranslatableFields(config.fields)
      } else {
        if (!collectionSlug) {
          throw new Error('collection is required for collection translations')
        }
        const collections = payload.collections
        const collectionKey = collectionSlug as CollectionSlug
        const collection = collections[collectionKey]
        if (!collection) {
          throw new Error(`Collection ${collectionSlug} not found`)
        }
        config = collection.config
        translatableFields = getTranslatableFields(config.fields)
      }
      
      if (translatableFields.length === 0) {
        console.log(`[TranslationTask] No translatable fields found in ${entityType} ${entitySlug}`)
        return { output: { success: true, message: 'No translatable fields found' } }
      }

      console.log(`[TranslationTask] Found ${translatableFields.length} translatable fields:`, translatableFields.map(f => `${f.name} (${f.type})`))

      // Get both source and target documents/globals in parallel
      let sourceDoc, targetDoc
      
      if (isGlobal) {
        const validGlobalSlug = globalSlug as GlobalSlug
        [sourceDoc, targetDoc] = await Promise.all([
          payload.findGlobal({
            slug: validGlobalSlug,
            locale: locale as TypedLocale,
            depth: 0,
          }),
          payload.findGlobal({
            slug: validGlobalSlug,
            locale: 'all',
            depth: 0,
          }).catch(() => null)
        ])
      } else {
        if (!docId) {
          throw new Error('docId is required for collection translations')
        }
        
        // Validate docId before using it
        const validDocId = docId as string | number
        
        [sourceDoc, targetDoc] = await Promise.all([
          payload.findByID({
            collection: collectionSlug as CollectionSlug,
            id: validDocId,
            locale: locale as TypedLocale,
            depth: 0,
          }),
          payload.findByID({
            collection: collectionSlug as CollectionSlug,
            id: validDocId,
            locale: 'all',
            depth: 0,
          }).catch(() => null)
        ])
      }

      if (!sourceDoc) {
        throw new Error(`${entityType} ${entitySlug}${docId ? `:${docId}` : ''} not found`)
      }

      const translatedData: Record<string, any> = {}
      
      // Prepare fields for batch translation
      const fieldsToTranslate: { field: typeof translatableFields[0]; value: string; key: string }[] = []
      
      for (const field of translatableFields) {
        const sourceValue = getValueByPath(sourceDoc, field.path, locale)
        const existingValue = targetDoc ? getValueByPath(targetDoc, field.path, targetLocale) : null

        console.log(`[TranslationTask] Processing field ${field.path}:`)
        console.log(`  - sourceValue: "${sourceValue}"`)
        console.log(`  - existingValue type: ${typeof existingValue}, value: "${JSON.stringify(existingValue)?.substring(0, 100)}"`)
        console.log(`  - forceRetranslate: ${forceRetranslate}`)

        // Skip if no source value
        if (!sourceValue) {
          console.log(`  - Skipped: no source value`)
          continue
        }

        // Si forceRetranslate es true, siempre traducir
        if (forceRetranslate) {
          console.log(`  - Force retranslate enabled, will translate`)
          fieldsToTranslate.push({
            field,
            value: sourceValue,
            key: field.path
          })
          continue
        }

        // Skip if target already has a non-empty string value
        if (existingValue && typeof existingValue === 'string' && existingValue.trim()) {
          console.log(`  - Skipped: target already has content`)
          continue
        }

        // Skip if existingValue is an object (means it's already populated with localized data)
        if (existingValue && typeof existingValue === 'object' && !Array.isArray(existingValue)) {
          console.log(`  - Skipped: target has object value (already localized)`)
          continue
        }

        fieldsToTranslate.push({
          field,
          value: sourceValue,
          key: field.path
        })
      }

      if (fieldsToTranslate.length === 0) {
        console.log(`[TranslationTask] No fields to translate for ${entityType} ${entitySlug}${docId ? `:${docId}` : ''}`)
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
          // Update based on type with retry logic for write conflicts
          const maxRetries = 3
          let retryCount = 0
          let updateSuccess = false

          while (retryCount < maxRetries && !updateSuccess) {
            try {
              if (isGlobal) {
                const validGlobalSlug = globalSlug as GlobalSlug
                await payload.updateGlobal({
                  slug: validGlobalSlug,
                  data: translatedData,
                  locale: targetLocale as TypedLocale,
                  depth: 0,
                  context: {
                    skipRevalidation: true,
                    skipTranslation: true,
                  },
                })
              } else {
                const validDocId = docId as string | number
                await payload.update({
                  collection: collectionSlug as CollectionSlug,
                  id: validDocId,
                  data: translatedData,
                  locale: targetLocale as TypedLocale,
                  depth: 0,
                  context: {
                    skipRevalidation: true,
                    skipTranslation: true,
                  },
                })
              }
              updateSuccess = true
            } catch (updateError: any) {
              retryCount++
              if (updateError.code === 112 && retryCount < maxRetries) {
                // WriteConflict error - wait and retry
                const delay = Math.min(1000 * Math.pow(2, retryCount), 5000) // Exponential backoff, max 5s
                console.log(`[TranslationTask] Write conflict, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`)
                await new Promise(resolve => setTimeout(resolve, delay))
              } else {
                throw updateError
              }
            }
          }
        }

        console.log(`[TranslationTask] Successfully translated ${entityType} ${entitySlug}${docId ? `:${docId}` : ''} from ${locale} to ${targetLocale} (${translatedFieldsCount} fields)`)
        
        return {
          output: {
            success: true,
            message: `Successfully translated ${translatedFieldsCount} fields from ${locale} to ${targetLocale}`,
            fieldsTranslated: translatedFieldsCount,
          },
        }

      } catch (translationError) {
        console.error(`[TranslationTask] Batch translation failed for ${entityType} ${entitySlug}${docId ? `:${docId}` : ''}:`, translationError)
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