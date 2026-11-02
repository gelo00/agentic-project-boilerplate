import { ICacheService } from "./types.js"

import { MemoryCacheService } from "./memory-cache.js"

import { RedisCacheService } from "./redis-cache.js"

let cacheInstance: ICacheService | null = null

export async function closeCacheService(): Promise<void> {
  if (cacheInstance) {
    await cacheInstance.close()
    cacheInstance = null
  }
}

export function getCacheService(): ICacheService {
  if (cacheInstance) return cacheInstance

  const isRedisEnabled = process.env.REDIS_ENABLED === "true"

  const redisUrl = process.env.REDIS_URL

  if (isRedisEnabled && redisUrl) {
    cacheInstance = new RedisCacheService(redisUrl)
  } else {
    cacheInstance = new MemoryCacheService()
  }

  return cacheInstance
}
