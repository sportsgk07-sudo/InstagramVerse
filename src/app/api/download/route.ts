import { type NextRequest } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isRateLimited,
  logApiRequest,
} from "@/lib/security/rate-limit";
import {
  apiError,
  handleApiError,
  withRateLimitHeaders,
} from "@/lib/api/response";
import { downloadRequestSchema } from "@/lib/validation/schemas";
import { cacheService } from "@/lib/infrastructure/cache/cache-service";
import { logger } from "@/lib/infrastructure/logging/logger";

export async function POST(request: NextRequest) {
  const start = Date.now();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const rateLimit = await checkRateLimit(ip);
  if (isRateLimited(rateLimit)) {
    const response = apiError("Too many requests. Please try again later.", 429, "RATE_LIMITED");
    return withRateLimitHeaders(response, rateLimit);
  }

  try {
    const body = await request.json();
    const parsed = downloadRequestSchema.parse(body);

    const cached = await cacheService.getDownload<{ url: string; filename: string }>(
      parsed.mediaId
    );

    const mediaUrl = cached?.url ?? parsed.url;
    const filename = parsed.filename ?? cached?.filename ?? "instagram_media";

    await cacheService.setDownload(parsed.mediaId, {
      url: mediaUrl,
      filename,
    });

    const mediaResponse = await fetch(mediaUrl, {
      headers: {
        "User-Agent":
          process.env.INSTAGRAM_USER_AGENT ??
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.instagram.com/",
      },
    });

    if (!mediaResponse.ok) {
      return apiError("Failed to fetch media file", 502, "DOWNLOAD_FAILED");
    }

    const contentType =
      mediaResponse.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await mediaResponse.arrayBuffer();

    await cacheService.incrementAnalytics("download_success");

    await logApiRequest({
      endpoint: "/api/download",
      method: "POST",
      statusCode: 200,
      ipAddress: ip,
      userAgent,
      durationMs: Date.now() - start,
    });

    const extension = contentType.includes("video")
      ? "mp4"
      : contentType.includes("png")
        ? "png"
        : "jpg";

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const finalFilename = safeFilename.includes(".")
      ? safeFilename
      : `${safeFilename}.${extension}`;

    const response = new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
        "Cache-Control": "private, max-age=3600",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(rateLimit.reset),
      },
    });

    return response;
  } catch (error) {
    await cacheService.incrementAnalytics("download_failed");
    logger.error("Download API error", { error: String(error), ip });
    await logApiRequest({
      endpoint: "/api/download",
      method: "POST",
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
