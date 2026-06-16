import type { ContentCategory } from "@/lib/domain/types";

const PATTERNS = {
  post: /instagram\.com\/p\/([A-Za-z0-9_-]+)/i,
  reel: /instagram\.com\/reel\/([A-Za-z0-9_-]+)/i,
  reels: /instagram\.com\/reels\/([A-Za-z0-9_-]+)/i,
  tv: /instagram\.com\/tv\/([A-Za-z0-9_-]+)/i,
  story: /instagram\.com\/stories\/([A-Za-z0-9_.]+)\/(\d+)/i,
  highlights: /instagram\.com\/stories\/highlights\/(\d+)/i,
  profile: /instagram\.com\/([A-Za-z0-9_.]+)\/?(?:\?.*)?$/i,
};

const RESERVED_PATHS = new Set(["p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct", "about"]);

export type InstagramPathType = "p" | "reel" | "tv";

export interface ParsedInstagramUrl {
  type: ContentCategory;
  shortcode?: string;
  username?: string;
  storyId?: string;
  highlightId?: string;
  pathType?: InstagramPathType;
  normalizedUrl: string;
}

export function stripUrlQueryParams(url: string): string {
  try {
    const parsed = new URL(url.trim());
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim().split("?")[0]?.split("#")[0]?.replace(/\/$/, "") ?? url.trim();
  }
}

export function parseInstagramUrl(url: string): ParsedInstagramUrl | null {
  const normalized = stripUrlQueryParams(url);

  const storyMatch = normalized.match(PATTERNS.story);
  if (storyMatch?.[1] && storyMatch[2]) {
    return {
      type: "story",
      username: storyMatch[1],
      storyId: storyMatch[2],
      normalizedUrl: normalized,
    };
  }

  const highlightMatch = normalized.match(PATTERNS.highlights);
  if (highlightMatch?.[1]) {
    return {
      type: "highlight",
      highlightId: highlightMatch[1],
      normalizedUrl: normalized,
    };
  }

  const reelMatch = normalized.match(PATTERNS.reel) ?? normalized.match(PATTERNS.reels);
  if (reelMatch?.[1]) {
    return {
      type: "reel",
      shortcode: reelMatch[1],
      pathType: "reel",
      normalizedUrl: normalized,
    };
  }

  const tvMatch = normalized.match(PATTERNS.tv);
  if (tvMatch?.[1]) {
    return {
      type: "video",
      shortcode: tvMatch[1],
      pathType: "tv",
      normalizedUrl: normalized,
    };
  }

  const postMatch = normalized.match(PATTERNS.post);
  if (postMatch?.[1]) {
    return {
      type: "photo",
      shortcode: postMatch[1],
      pathType: "p",
      normalizedUrl: normalized,
    };
  }

  const profileMatch = normalized.match(PATTERNS.profile);
  if (profileMatch?.[1] && !RESERVED_PATHS.has(profileMatch[1].toLowerCase())) {
    return {
      type: "profile_picture",
      username: profileMatch[1],
      normalizedUrl: normalized,
    };
  }

  return null;
}

export { getInstagramUserAgent, getInstagramAppId } from "@/lib/application/instagram/instagram-session";
