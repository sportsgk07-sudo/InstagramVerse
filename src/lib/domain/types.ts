export type MediaType = "image" | "video";

export type ContentCategory =
  | "reel"
  | "video"
  | "photo"
  | "carousel"
  | "story"
  | "highlight"
  | "profile_picture"
  | "unknown";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  quality?: string;
  filename: string;
}

export interface ExtractedMedia {
  id: string;
  shortcode?: string;
  username?: string;
  caption?: string;
  contentType: ContentCategory;
  thumbnailUrl?: string;
  media: MediaItem[];
  extractedAt: string;
  sourceUrl: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: boolean;
    redis: boolean;
  };
  version: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
