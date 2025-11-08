import type { CollectionAfterChangeHook } from 'payload'
import { translationConfig, type SupportedLocale } from '../config/translation-config'

export interface TranslationHookOptions {
  sourceLocale?: SupportedLocale
  targetLocale?: SupportedLocale
  enabled?: boolean
  onlyOnCreate?: boolean
}

/**
 * Creates a reusable afterChange hook for automatic translation
 * 
 * @param options Configuration options for the translation hook
 * @returns Payload afterChange hook function
 */
export function createTranslationHook(options: TranslationHookOptions = {}): CollectionAfterChangeHook {
  const {
    sourceLocale = translationConfig.defaultSourceLocale as SupportedLocale,
    targetLocale = translationConfig.defaultTargetLocale as SupportedLocale,
    enabled = true,
    onlyOnCreate = false
  } = options

  return async ({ doc, req, operation, collection }) => {
    // Skip if translation is disabled
    if (!enabled) return

    // Skip if operation doesn't match criteria
    if (onlyOnCreate && operation !== 'create') return
    if (!onlyOnCreate && operation !== 'create' && operation !== 'update') return

    // Skip if not in source locale
    const currentLocale = req.locale || sourceLocale
    if (currentLocale !== sourceLocale) return

    // Get collection slug dynamically from collection
    // Handle case where collection might be undefined
    const collectionSlug = collection?.slug
    if (!collectionSlug) {
      console.warn('[TranslationHook] Collection or collection slug is undefined, skipping translation')
      return
    }

    try {
      await req.payload.jobs.queue({
        task: 'translate-content',
        input: {
          collection: collectionSlug,
          docId: doc.id,
          locale: sourceLocale,
          targetLocale: targetLocale,
        },
      })
      
      console.log(`[TranslationHook] Queued translation job for ${collectionSlug}:${doc.id} (${sourceLocale} → ${targetLocale})`)
    } catch (error) {
      console.error(`[TranslationHook] Failed to queue translation job for ${collectionSlug}:${doc.id}:`, error)
      
      // Don't throw error to prevent document save from failing
      // Translation will be skipped but document will still be saved
    }
  }
}

/**
 * Pre-configured hooks for common translation scenarios
 */
export const translationHooks = {
  /**
   * Standard Spanish to English translation
   */
  esToEn: createTranslationHook({
    sourceLocale: 'es',
    targetLocale: 'en'
  }),

  /**
   * Spanish to English, only on document creation
   */
  esToEnOnCreate: createTranslationHook({
    sourceLocale: 'es',
    targetLocale: 'en',
    onlyOnCreate: true
  }),

  /**
   * English to Spanish translation
   */
  enToEs: createTranslationHook({
    sourceLocale: 'en',
    targetLocale: 'es'
  }),

  /**
   * Create custom translation hook with specific options
   */
  custom: createTranslationHook
}