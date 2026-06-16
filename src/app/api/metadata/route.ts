import { type NextRequest } from "next/server";
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
import { metadataQuerySchema, sanitizeUrl } from "@/lib/validation/schemas";
import { instagramExtractor } from "@/lib/application/instagram/extractor";
import { cacheService } from "@/lib/infrastructure/cache/cache-service";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const rateLimit = await checkRateLimit(ip);
  if (isRateLimited(rateLimit)) {
    const response = apiError("Too many requests", 429, "RATE_LIMITED");
    return withRateLimitHeaders(response, rateLimit);
  }

  try {
    const urlParam = request.nextUrl.searchParams.get("url");
    const parsed = metadataQuerySchema.parse({ url: urlParam ?? "" });
    const url = sanitizeUrl(parsed.url);

    const cached = await cacheService.getMetadata(url);
    if (cached) {
      const response = apiSuccess({ ...cached as object, cached: true });
      return withRateLimitHeaders(response, rateLimit);
    }

    const result = await instagramExtractor.extract(url);
    const response = apiSuccess({ ...result, cached: false });

    await logApiRequest({
      endpoint: "/api/metadata",
      method: "GET",
      statusCode: 200,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
    });

    return withRateLimitHeaders(response, rateLimit);
  } catch (error) {
    await logApiRequest({
      endpoint: "/api/metadata",
      method: "GET",
      statusCode: 500,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
      errorMessage: error instanceof Error ? error.message : "Unknown",
    });
    const response = handleApiError(error);
    return withRateLimitHeaders(response, rateLimit);
  }
}
