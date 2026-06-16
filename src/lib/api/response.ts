import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { ExtractionError } from "@/lib/application/instagram/errors";

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json({ success: true, data }, { status, headers });
}

export function apiError(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  headers?: HeadersInit
) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status, headers }
  );
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ExtractionError) {
    return apiError(error.message, error.statusCode, error.code);
  }

  if (isZodError(error)) {
    const message = error.errors.map((e) => e.message).join(", ");
    return apiError(message, 400, "VALIDATION_ERROR");
  }

  console.error("Unhandled API error:", error);
  return apiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
}

function isZodError(error: unknown): error is ZodError {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as ZodError).errors)
  );
}

export function withRateLimitHeaders(
  response: NextResponse,
  rateLimit: { limit: number; remaining: number; reset: number }
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set("X-RateLimit-Reset", String(rateLimit.reset));
  return response;
}
