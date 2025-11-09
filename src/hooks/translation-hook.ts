import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

interface TranslationConfig {
  sourceLocale: string
  targetLocale: string
  forceRetranslate?: boolean // Si es true, traduce aunque ya exista contenido
}

// Helper para manejar errores sin romper el flujo
const safeExecute = async (fn: () => Promise<any>, context: string) => {
  try {
    await fn()
  } catch (err) {
    console.error(`[TranslationHook] Error in ${context}:`, err)
  }
}
// Hook para Collections
const createCollectionTranslationHook = (
  config: TranslationConfig
): CollectionAfterChangeHook => {
  return async (args) => {
    const { doc, req, collection, operation } = args

    // Seguridad: si faltan datos base, salimos
    if (!doc || !req || !collection) {
      console.warn('[TranslationHook] Missing context (doc, req o collection)')
      return doc
    }

    // Evitar loops si la tarea proviene de una traducción
    if (req.context?.skipTranslation) {
      return doc
    }

    // Solo traducir en operaciones de create y update
    if (operation !== 'create' && operation !== 'update') {
      return doc
    }

    // Ignorar autosave (cuando Payload guarda versiones temporales)
    if (req.query?.autosave === 'true' || req.query?.autosave === true) {
      console.log(`[TranslationHook] ⏭️ Skipping autosave for ${collection.slug}:${doc.id}`)
      return doc
    }

    // Determinar el locale actual
    const currentLocale = req.locale || 'es'
    if (currentLocale !== config.sourceLocale) {
      console.log(
        `[TranslationHook] 🌐 Skipping translation for ${collection.slug}:${doc.id} (locale mismatch: ${currentLocale} ≠ ${config.sourceLocale})`
      )
      return doc
    }

    // Verificar ID antes de encolar tarea
    if (!doc.id) {
      console.warn(`[TranslationHook] ⚠️ Missing doc.id for ${collection.slug}, skipping`)
      return doc
    }

    // Ejecutar de forma segura
    await safeExecute(async () => {
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
        `[TranslationHook] ✅ Queued translation job for ${collection.slug}:${doc.id} (${config.sourceLocale} → ${config.targetLocale})`
      )
    }, `${collection.slug}:${doc.id}`)

    return doc
  }
}

// Hook para Globals
const createGlobalTranslationHook = (
  config: TranslationConfig
): GlobalAfterChangeHook => {
  return async ({ doc, req, global }) => {
    if (!doc || !req || !global) {
      console.warn('[TranslationHook] Missing context in global hook')
      return doc
    }

    console.log(`[TranslationHook] 🌍 Global afterChange fired for ${global.slug}`)
    console.log(`[TranslationHook] Query params:`, req.query)

    // Ignorar autosave
    if (req.query?.autosave === 'true' || req.query?.autosave === true) {
      console.log(`[TranslationHook] ⏭️ Skipping autosave for global ${global.slug}`)
      return doc
    }

    const currentLocale = req.locale || 'es'
    if (currentLocale !== config.sourceLocale) {
      console.log(
        `[TranslationHook] 🌐 Skipping translation for global ${global.slug} (locale mismatch: ${currentLocale} ≠ ${config.sourceLocale})`
      )
      return doc
    }

    await safeExecute(async () => {
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
        `[TranslationHook] ✅ Queued translation job for global ${global.slug} (${config.sourceLocale} → ${config.targetLocale})`
      )
    }, `global:${global.slug}`)

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

export { createCollectionTranslationHook, createGlobalTranslationHook }