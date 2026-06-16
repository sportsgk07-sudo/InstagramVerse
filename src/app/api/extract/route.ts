import { type NextRequest } from "next/server";
import { prisma } from "@/lib/infrastructure/database/prisma";
import {
  checkRateLimit,
  getClientIp,
  isRateLimited,
  logApiRequest,
} from "@/lib/security/rate-limit";
import {
  apiError,
  apiSuccess,
  handleApiError,
  withRateLimitHeaders,
} from "@/lib/api/response";
import { extractRequestSchema, sanitizeUrl } from "@/lib/validation/schemas";
import {
  ExtractionError,
  instagramExtractor,
} from "@/lib/application/instagram/extractor";
import { cacheService } from "@/lib/infrastructure/cache/cache-service";
import { logger } from "@/lib/infrastructure/logging/logger";
import type { ContentCategory } from "@/lib/domain/types";

export async function POST(request: NextRequest) {
  const start = Date.now();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const rateLimit = await checkRateLimit(ip);
  if (isRateLimited(rateLimit)) {
    const response = apiError("Too many requests. Please try again later.", 429, "RATE_LIMITED");
    await logApiRequest({
      endpoint: "/api/extract",
      method: "POST",
      statusCode: 429,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
    });
    return withRateLimitHeaders(response, rateLimit);
  }

  try {
    const body = await request.json();
    const parsed = extractRequestSchema.parse(body);
    const url = sanitizeUrl(parsed.url);

    const result = await instagramExtractor.extract(
      url,
      parsed.contentType as ContentCategory | "auto"
    );

    await cacheService.incrementAnalytics("extract_success");

    await prisma.download.create({
      data: {
        url,
        shortcode: result.shortcode,
        contentType: mapContentType(result.contentType),
        status: "COMPLETED",
        mediaCount: result.media.length,
        ipAddress: ip,
        userAgent,
        metadata: result as object,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        event: "extract",
        page: "/api/extract",
        ipAddress: ip,
        userAgent,
        metadata: { contentType: result.contentType },
      },
    });

    const response = apiSuccess(result);
    await logApiRequest({
      endpoint: "/api/extract",
      method: "POST",
      statusCode: 200,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
    });
    return withRateLimitHeaders(response, rateLimit);
  } catch (error) {
    await cacheService.incrementAnalytics("extract_failed");
    await logApiRequest({
      endpoint: "/api/extract",
      method: "POST",
      statusCode: error instanceof ExtractionError ? error.statusCode : 500,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    logger.error("Extract API error", { error: String(error), ip });
    const response = handleApiError(error);
    return withRateLimitHeaders(response, rateLimit);
  }
}

function mapContentType(type: ContentCategory) {
  const map = {
    reel: "REEL",
    video: "VIDEO",
    photo: "PHOTO",
    carousel: "CAROUSEL",
    story: "STORY",
    highlight: "HIGHLIGHT",
    profile_picture: "PROFILE_PICTURE",
    unknown: "UNKNOWN",
  } as const;
  return map[type];
}
