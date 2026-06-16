import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }

  return new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis;
}

export async function isRedisHealthy(): Promise<boolean> {
  if (!redis) return false;
  try {
    const result = await redis.ping();
    return result === "PONG";
  } catch {
    return false;
  }
}
