import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

interface TranslationConfig {
  sourceLocale: string
  targetLocale: string
  forceRetranslate?: boolean // Si es true, traduce aunque ya exista contenido
}

// Hook para Collections
const createCollectionTranslationHook = (
  config: TranslationConfig
): CollectionAfterChangeHook => {
  return async ({ doc, req, collection, operation }) => {
    // Skip if this update comes from a translation job (to prevent loops)
    if (req.context?.skipTranslation) {
      return doc
    }

    // Solo traducir en operaciones de create y update
    if (operation !== 'create' && operation !== 'update') {
      return doc
    }

    // Ignorar autosave
    if (req.query?.autosave === 'true' || req.query?.autosave === true) {
      console.log(`[TranslationHook] Skipping autosave for ${collection.slug}:${doc.id}`)
      return doc
    }

    // Solo traducir si el documento está en el locale fuente
    const currentLocale = req.locale || 'es'
    if (currentLocale !== config.sourceLocale) {
      return doc
    }

    try {
      await req.payload.jobs.queue({
        task: 'translate-content',
        input: {
          collection: collection.slug,
          docId: doc.id,
          locale: config.sourceLocale,
          targetLocale: config.targetLocale,
          forceRetranslate: config.forceRetranslate || false,
        },
      })

      console.log(
        `[TranslationHook] Queued translation job for ${collection.slug}:${doc.id} from ${config.sourceLocale} to ${config.targetLocale}`
      )
    } catch (error) {
      console.error(
        `[TranslationHook] Failed to queue translation job for ${collection.slug}:${doc.id}:`,
        error
      )
    }

    return doc
  }
}

// Hook para Globals
const createGlobalTranslationHook = (
  config: TranslationConfig
): GlobalAfterChangeHook => {
  return async ({ doc, req, global }) => {
    console.log(`[TranslationHook] Global afterChange fired for ${global.slug}`)
    console.log(`[TranslationHook] Query params:`, req.query)
    
    // Ignorar autosave
    if (req.query?.autosave === 'true' || req.query?.autosave === true) {
      console.log(`[TranslationHook] Skipping autosave for global ${global.slug}`)
      return doc
    }
    
    // Solo traducir si el documento está en el locale fuente
    const currentLocale = req.locale || 'es'
    console.log(`[TranslationHook] Current locale: ${currentLocale}`)
    console.log(`[TranslationHook] Source locale: ${config.sourceLocale}`)
    
    if (currentLocale !== config.sourceLocale) {
      console.log(`[TranslationHook] Skipping translation: locale mismatch`)
      return doc
    }

    try {
      console.log(`[TranslationHook] Queueing translation job for global ${global.slug}...`)
      
      await req.payload.jobs.queue({
        task: 'translate-content',
        input: {
          global: global.slug,
          locale: config.sourceLocale,
          targetLocale: config.targetLocale,
          forceRetranslate: config.forceRetranslate || false,
        },
      })

      console.log(
        `[TranslationHook] ✓ Queued translation job for global ${global.slug} from ${config.sourceLocale} to ${config.targetLocale}`
      )
    } catch (error) {
      console.error(
        `[TranslationHook] ✗ Failed to queue translation job for global ${global.slug}:`,
        error
      )
    }

    return doc
  }
}

// Exports convenientes para los casos más comunes
export const translationHooks = {
  // Para Collections
  collection: {
    esToEn: createCollectionTranslationHook({
      sourceLocale: 'es',
      targetLocale: 'en',
    }),
    enToEs: createCollectionTranslationHook({
      sourceLocale: 'en',
      targetLocale: 'es',
    }),
    // Con force retranslate
    esToEnForce: createCollectionTranslationHook({
      sourceLocale: 'es',
      targetLocale: 'en',
      forceRetranslate: true,
    }),
  },
  
  // Para Globals
  global: {
    esToEn: createGlobalTranslationHook({
      sourceLocale: 'es',
      targetLocale: 'en',
    }),
    enToEs: createGlobalTranslationHook({
      sourceLocale: 'en',
      targetLocale: 'es',
    }),
    // Con force retranslate
    esToEnForce: createGlobalTranslationHook({
      sourceLocale: 'es',
      targetLocale: 'en',
      forceRetranslate: true,
    }),
  },
}

// Exports de las funciones factory por si necesitas configuraciones custom
export { createCollectionTranslationHook, createGlobalTranslationHook }