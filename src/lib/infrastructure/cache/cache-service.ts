import { redis } from "@/lib/infrastructure/cache/redis";

export const CACHE_KEYS = {
  metadata: (url: string) => `metadata:${hashKey(url)}`,
  download: (mediaId: string) => `download:${mediaId}`,
  request: (ip: string, endpoint: string) => `req:${ip}:${endpoint}`,
  analytics: (metric: string) => `analytics:${metric}`,
  rateLimit: (ip: string) => `ratelimit:${ip}`,
} as const;

function hashKey(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export class CacheService {
  private getDefaultTtl(type: "metadata" | "download" | "request" | "analytics"): number {
    const envMap = {
      metadata: Number(process.env.CACHE_TTL_METADATA ?? 3600),
      download: Number(process.env.CACHE_TTL_DOWNLOAD ?? 1800),
      request: 300,
      analytics: Number(process.env.CACHE_TTL_ANALYTICS ?? 300),
    };
    return envMap[type];
  }

  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!redis) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch {
      // Cache write failures should not break the app
    }
  }

  async delete(key: string): Promise<void> {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch {
      // ignore
    }
  }

  async invalidateMetadata(url: string): Promise<void> {
    await this.delete(CACHE_KEYS.metadata(url));
  }

  async getMetadata<T>(url: string): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.metadata(url));
  }

  async setMetadata<T>(url: string, data: T): Promise<void> {
    await this.set(CACHE_KEYS.metadata(url), data, this.getDefaultTtl("metadata"));
  }

  async getDownload<T>(mediaId: string): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.download(mediaId));
  }

  async setDownload<T>(mediaId: string, data: T): Promise<void> {
    await this.set(CACHE_KEYS.download(mediaId), data, this.getDefaultTtl("download"));
  }

  async incrementAnalytics(metric: string, amount = 1): Promise<void> {
    if (!redis) return;
    try {
      const key = CACHE_KEYS.analytics(metric);
      await redis.incrby(key, amount);
      await redis.expire(key, this.getDefaultTtl("analytics"));
    } catch {
      // ignore
    }
  }

  async getAnalyticsCount(metric: string): Promise<number> {
    if (!redis) return 0;
    try {
      const val = await redis.get(CACHE_KEYS.analytics(metric));
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }
}

export const cacheService = new CacheService();

/**
 * Cache invalidation strategy:
 * - Metadata: TTL-based (1h default), invalidated on extract failure or manual refresh
 * - Download URLs: TTL-based (30m) since CDN URLs may expire
 * - Request cache: Short TTL (5m) for deduplication
 * - Analytics: Rolling window with TTL, flushed to DB periodically
 */
