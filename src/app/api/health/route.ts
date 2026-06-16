import { prisma } from "@/lib/infrastructure/database/prisma";
import { isRedisHealthy } from "@/lib/infrastructure/cache/redis";
import { apiSuccess } from "@/lib/api/response";
import type { HealthStatus } from "@/lib/domain/types";

export async function GET() {
  const [dbHealthy, redisHealthy] = await Promise.all([
    checkDatabase(),
    isRedisHealthy(),
  ]);

  const allHealthy = dbHealthy && redisHealthy;
  const anyHealthy = dbHealthy || redisHealthy;

  const health: HealthStatus = {
    status: allHealthy ? "healthy" : anyHealthy ? "degraded" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealthy,
      redis: redisHealthy,
    },
    version: "1.0.0",
  };

  return apiSuccess(health, allHealthy ? 200 : 503);
}

async function checkDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
