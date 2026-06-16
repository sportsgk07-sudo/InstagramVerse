import { prisma } from "@/lib/infrastructure/database/prisma";
import { redis } from "@/lib/infrastructure/cache/redis";
import { CACHE_KEYS } from "@/lib/infrastructure/cache/cache-service";
import type { RateLimitInfo } from "@/lib/domain/types";

const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const DEFAULT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 30);

export async function checkRateLimit(ip: string): Promise<RateLimitInfo> {
  const windowMs = DEFAULT_WINDOW_MS;
  const maxRequests = DEFAULT_MAX_REQUESTS;
  const key = CACHE_KEYS.rateLimit(ip);

  if (!redis) {
    return {
      limit: maxRequests,
      remaining: maxRequests,
      reset: Date.now() + windowMs,
    };
  }

  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, `${now}`);
    pipeline.zcard(key);
    pipeline.pexpire(key, windowMs);
    const results = await pipeline.exec();

    const count = (results?.[2]?.[1] as number) ?? 0;
    const remaining = Math.max(0, maxRequests - count);

    return {
      limit: maxRequests,
      remaining,
      reset: now + windowMs,
    };
  } catch {
    return {
      limit: maxRequests,
      remaining: maxRequests,
      reset: now + windowMs,
    };
  }
}

export function isRateLimited(info: RateLimitInfo): boolean {
  return info.remaining <= 0;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function logApiRequest(params: {
  endpoint: string;
  method: string;
  statusCode: number;
  ipAddress: string;
  userAgent?: string;
  durationMs?: number;
  errorMessage?: string;
  userId?: string;
}): Promise<void> {
  const status =
    params.statusCode === 429
      ? "RATE_LIMITED"
      : params.statusCode >= 400
        ? "FAILED"
        : "SUCCESS";

  try {
    await prisma.apiRequest.create({
      data: {
        endpoint: params.endpoint,
        method: params.method,
        statusCode: params.statusCode,
        status,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        durationMs: params.durationMs,
        errorMessage: params.errorMessage,
        userId: params.userId,
      },
    });
  } catch {
    // Logging should not break requests
  }
}
