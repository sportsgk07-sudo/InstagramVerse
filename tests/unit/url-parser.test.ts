import { describe, it, expect } from "vitest";
import { parseInstagramUrl, stripUrlQueryParams } from "@/lib/application/instagram/url-parser";
import { instagramUrlSchema, sanitizeUrl } from "@/lib/validation/schemas";

describe("parseInstagramUrl", () => {
  it("parses reel URLs", () => {
    const result = parseInstagramUrl("https://www.instagram.com/reel/ABC123xyz/");
    expect(result?.type).toBe("reel");
    expect(result?.shortcode).toBe("ABC123xyz");
  });

  it("parses post URLs", () => {
    const result = parseInstagramUrl("https://www.instagram.com/p/XYZ789abc/");
    expect(result?.type).toBe("photo");
    expect(result?.shortcode).toBe("XYZ789abc");
  });

  it("parses story URLs", () => {
    const result = parseInstagramUrl("https://www.instagram.com/stories/username/123456789/");
    expect(result?.type).toBe("story");
    expect(result?.username).toBe("username");
    expect(result?.storyId).toBe("123456789");
  });

  it("parses profile URLs", () => {
    const result = parseInstagramUrl("https://www.instagram.com/testuser/");
    expect(result?.type).toBe("profile_picture");
    expect(result?.username).toBe("testuser");
  });

  it("returns null for invalid URLs", () => {
    expect(parseInstagramUrl("https://google.com")).toBeNull();
  });
});

describe("instagramUrlSchema", () => {
  it("validates correct Instagram URLs", () => {
    const result = instagramUrlSchema.safeParse("https://www.instagram.com/reel/ABC123/");
    expect(result.success).toBe(true);
  });

  it("rejects non-Instagram URLs", () => {
    const result = instagramUrlSchema.safeParse("https://example.com/video");
    expect(result.success).toBe(false);
  });
});

describe("stripUrlQueryParams", () => {
  it("removes query string and hash", () => {
    expect(
      stripUrlQueryParams(
        "https://www.instagram.com/reel/DZnEkf-M-QQ/?utm_source=ig_web_copy_link"
      )
    ).toBe("https://www.instagram.com/reel/DZnEkf-M-QQ");
  });
});

describe("sanitizeUrl", () => {
  it("removes query params and hash", () => {
    expect(
      sanitizeUrl("https://www.instagram.com/p/DZnxcaEDZ5i/?img_index=1#section")
    ).toBe("https://www.instagram.com/p/DZnxcaEDZ5i");
  });
});
