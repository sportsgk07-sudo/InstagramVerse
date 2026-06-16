import { prisma } from "@/lib/infrastructure/database/prisma";
import { isRedisHealthy } from "@/lib/infrastructure/cache/redis";
import { cacheService } from "@/lib/infrastructure/cache/cache-service";
import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const [dbHealthy, redisHealthy] = await Promise.all([
    checkDatabase(),
    isRedisHealthy(),
  ]);

  const extractSuccess = await cacheService.getAnalyticsCount("extract_success");
  const downloadSuccess = await cacheService.getAnalyticsCount("download_success");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalDownloads, todayDownloads, totalUsers] = await Promise.all([
    prisma.download.count(),
    prisma.download.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count(),
  ]);

  const status =
    dbHealthy && redisHealthy
      ? "operational"
      : dbHealthy
        ? "degraded"
        : "down";

  return apiSuccess({
    status,
    services: {
      database: dbHealthy,
      redis: redisHealthy,
      api: true,
    },
    metrics: {
      totalDownloads,
      todayDownloads,
      totalUsers,
      extractSuccess,
      downloadSuccess,
    },
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "1.0.0",
  });
}

async function checkDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
