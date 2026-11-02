import { Redis } from 'ioredis';
import { ICacheService } from './types.js';

export class RedisCacheService implements ICacheService {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.client.on('error', (err) => {
      console.error('[Redis Error]', err.message);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn('[Redis Set Failed]', err);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      console.warn('[Redis Del Failed]', err);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return (await this.client.ping()) === 'PONG';
    } catch {
      return false;
    }
  }
}