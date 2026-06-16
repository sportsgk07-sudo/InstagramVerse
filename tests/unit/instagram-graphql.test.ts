import { describe, it, expect } from "vitest";

describe("isJsonResponse helper logic", () => {
  function isJsonResponse(contentType: string | null, body: string): boolean {
    if (contentType?.includes("json") || contentType?.includes("javascript")) {
      return true;
    }
    const trimmed = body.trim();
    return trimmed.startsWith("{") || trimmed.startsWith("[");
  }

  it("accepts javascript content type from Instagram GraphQL", () => {
    expect(isJsonResponse("text/javascript; charset=utf-8", '{"data":{}}')).toBe(true);
  });

  it("rejects HTML responses", () => {
    expect(isJsonResponse("text/html; charset=utf-8", "<!DOCTYPE html>")).toBe(false);
  });
});
