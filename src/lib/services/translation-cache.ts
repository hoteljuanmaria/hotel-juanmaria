import { translationConfig } from '../../config/translation-config'

interface CacheEntry {
  value: string
  timestamp: number
}

interface CacheKey {
  text: string
  source: string
  target: string
  type: 'text' | 'richText'
}

export class TranslationCache {
  private cache = new Map<string, CacheEntry>()
  private readonly enabled: boolean
  private readonly ttl: number
  private readonly maxSize: number

  constructor() {
    this.enabled = translationConfig.cacheOptions.enabled
    this.ttl = translationConfig.cacheOptions.ttl
    this.maxSize = translationConfig.cacheOptions.maxSize
  }

  private generateKey(key: CacheKey): string {
    return `${key.type}:${key.source}:${key.target}:${this.hashText(key.text)}`
  }

  private hashText(text: string): string {
    // Simple hash function for cache keys
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.ttl
  }

  private evictExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }

  private evictOldest(): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }

  get(key: CacheKey): string | null {
    if (!this.enabled) return null

    const cacheKey = this.generateKey(key)
    const entry = this.cache.get(cacheKey)

    if (!entry || this.isExpired(entry)) {
      if (entry) this.cache.delete(cacheKey)
      return null
    }

    return entry.value
  }

  set(key: CacheKey, value: string): void {
    if (!this.enabled) return

    // Clean up expired entries periodically
    if (this.cache.size % 100 === 0) {
      this.evictExpired()
    }

    // Evict oldest if at max size
    this.evictOldest()

    const cacheKey = this.generateKey(key)
    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now()
    })
  }

  clear(): void {
    this.cache.clear()
  }

  getStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      enabled: this.enabled
    }
  }
}

// Singleton instance
export const translationCache = new TranslationCache()