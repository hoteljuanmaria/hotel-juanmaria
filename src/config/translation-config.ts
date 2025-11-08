export interface TranslationConfig {
  defaultSourceLocale: string
  defaultTargetLocale: string
  supportedLocales: readonly string[]
  deeplLanguageMapping: Record<string, string>
  retryOptions: {
    maxRetries: number
    baseDelay: number
    maxDelay: number
  }
  cacheOptions: {
    enabled: boolean
    ttl: number // milliseconds
    maxSize: number
  }
  batchOptions: {
    enabled: boolean
    maxBatchSize: number
    batchTimeout: number
  }
}

export const translationConfig: TranslationConfig = {
  defaultSourceLocale: 'es',
  defaultTargetLocale: 'en',
  supportedLocales: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'zh'] as const,
  
  deeplLanguageMapping: {
    'en': 'en-US',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt-PT',
    'ja': 'ja',
    'zh': 'zh-CN'
  },
  
  retryOptions: {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000  // 10 seconds
  },
  
  cacheOptions: {
    enabled: true,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 1000 // max cache entries
  },
  
  batchOptions: {
    enabled: true,
    maxBatchSize: 10, // max fields per batch
    batchTimeout: 5000 // 5 seconds max wait
  }
} as const

export type SupportedLocale = typeof translationConfig.supportedLocales[number]