import type { ContentCategory, ExtractedMedia, MediaItem } from "@/lib/domain/types";
import { ExtractionError } from "@/lib/application/instagram/errors";
import {
  fetchShortcodeMedia,
  type GraphQLMediaNode,
} from "@/lib/application/instagram/instagram-graphql";
import { fetchProfilePicture } from "@/lib/application/instagram/instagram-profile";
import {
  buildInstagramHeaders,
  getInstagramSession,
} from "@/lib/application/instagram/instagram-session";
import {
  parseInstagramUrl,
  type InstagramPathType,
} from "@/lib/application/instagram/url-parser";
import { cacheService } from "@/lib/infrastructure/cache/cache-service";
import { logger } from "@/lib/infrastructure/logging/logger";

export { ExtractionError } from "@/lib/application/instagram/errors";

export class InstagramExtractorService {
  async extract(url: string, preferredType?: ContentCategory | "auto"): Promise<ExtractedMedia> {
    const normalizedUrl = url;
    const cached = await cacheService.getMetadata<ExtractedMedia>(normalizedUrl);
    if (cached) {
      return cached;
    }

    const parsed = parseInstagramUrl(normalizedUrl);
    if (!parsed) {
      throw new ExtractionError("INVALID_URL", "Could not parse Instagram URL", 400);
    }

    let result: ExtractedMedia;

    try {
      if (parsed.shortcode) {
        result = await this.extractFromShortcode(
          parsed.shortcode,
          parsed.pathType ?? "p",
          parsed.type,
          normalizedUrl
        );
      } else if (parsed.type === "story" && parsed.username && parsed.storyId) {
        result = await this.extractStory(parsed.username, parsed.storyId, normalizedUrl);
      } else if (parsed.type === "highlight" && parsed.highlightId) {
        result = await this.extractHighlight(parsed.highlightId, normalizedUrl);
      } else if (parsed.type === "profile_picture" && parsed.username) {
        result = await this.extractProfilePicture(parsed.username, normalizedUrl);
      } else {
        throw new ExtractionError("UNSUPPORTED", "Unsupported URL format", 400);
      }
    } catch (error) {
      if (error instanceof ExtractionError) throw error;
      logger.error("Extraction failed", { url: normalizedUrl, error: String(error) });
      throw new ExtractionError(
        "EXTRACTION_FAILED",
        "Failed to extract media. The content may be private or unavailable.",
        422
      );
    }

    if (preferredType && preferredType !== "auto" && result.contentType !== preferredType) {
      // Type hint mismatch is non-fatal — media was still extracted.
    }

    await cacheService.setMetadata(normalizedUrl, result);
    return result;
  }

  private async extractFromShortcode(
    shortcode: string,
    pathType: InstagramPathType,
    type: ContentCategory,
    sourceUrl: string
  ): Promise<ExtractedMedia> {
    const node = await fetchShortcodeMedia(shortcode, pathType);
    return this.graphqlNodeToExtractedMedia(node, type, sourceUrl);
  }

  private graphqlNodeToExtractedMedia(
    node: GraphQLMediaNode,
    type: ContentCategory,
    sourceUrl: string
  ): ExtractedMedia {
    const media: MediaItem[] = [];
    const shortcode = node.shortcode ?? "unknown";
    const username = node.owner?.username;
    const caption = node.edge_media_to_caption?.edges[0]?.node?.text;

    if (node.edge_sidecar_to_children?.edges?.length) {
      node.edge_sidecar_to_children.edges.forEach((edge, index) => {
        const child = edge.node;
        const isVideo = child.is_video ?? false;
        const mediaUrl = (isVideo ? child.video_url : child.display_url) ?? "";
        if (!mediaUrl) return;

        media.push({
          id: child.id ?? `${shortcode}_${index}`,
          type: isVideo ? "video" : "image",
          url: mediaUrl,
          thumbnailUrl: child.display_url,
          width: child.dimensions?.width,
          height: child.dimensions?.height,
          quality: "original",
          filename: `${username ?? "instagram"}_${shortcode}_${index + 1}.${isVideo ? "mp4" : "jpg"}`,
        });
      });
    } else {
      const isVideo = node.is_video ?? false;
      const mediaUrl = (isVideo ? node.video_url : node.display_url) ?? "";

      if (mediaUrl) {
        media.push({
          id: node.id ?? shortcode,
          type: isVideo ? "video" : "image",
          url: mediaUrl,
          thumbnailUrl: node.display_url ?? node.thumbnail_src,
          width: node.dimensions?.width,
          height: node.dimensions?.height,
          duration: node.video_duration,
          quality: "original",
          filename: `${username ?? "instagram"}_${shortcode}.${isVideo ? "mp4" : "jpg"}`,
        });
      }
    }

    if (media.length === 0) {
      throw new ExtractionError("NO_MEDIA", "No downloadable media found", 404);
    }

    const isVideo = media[0]?.type === "video";
    const contentType: ContentCategory =
      media.length > 1
        ? "carousel"
        : type === "reel" || node.__typename === "XDTGraphVideo"
          ? "reel"
          : isVideo
            ? "video"
            : "photo";

    return {
      id: shortcode,
      shortcode,
      username,
      caption,
      contentType,
      thumbnailUrl: media[0]?.thumbnailUrl ?? node.thumbnail_src,
      media,
      extractedAt: new Date().toISOString(),
      sourceUrl,
    };
  }

  private async fetchPage(url: string): Promise<string> {
    const session = await getInstagramSession();
    const response = await fetch(url, {
      headers: {
        ...buildInstagramHeaders(session, { referer: url }),
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new ExtractionError(
        "FETCH_FAILED",
        `Instagram returned status ${response.status}`,
        response.status === 404 ? 404 : 502
      );
    }

    return response.text();
  }

  private decodeInstagramUrl(value: string): string {
    return value.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  }

  private async extractStory(
    username: string,
    storyId: string,
    sourceUrl: string
  ): Promise<ExtractedMedia> {
    const pageUrl = `https://www.instagram.com/stories/${username}/${storyId}/`;
    const html = await this.fetchPage(pageUrl);

    const videoMatch = html.match(/"video_url":"([^"]+)"/);
    const imageMatch = html.match(/"display_url":"([^"]+)"/);

    const mediaUrl =
      this.decodeInstagramUrl(videoMatch?.[1] ?? "") ||
      this.decodeInstagramUrl(imageMatch?.[1] ?? "");

    if (!mediaUrl) {
      throw new ExtractionError(
        "STORY_UNAVAILABLE",
        "Story not found or has expired. Stories are only available for 24 hours.",
        404
      );
    }

    const isVideo = !!videoMatch?.[1];

    return {
      id: storyId,
      username,
      contentType: "story",
      media: [
        {
          id: storyId,
          type: isVideo ? "video" : "image",
          url: mediaUrl,
          quality: "original",
          filename: `${username}_story_${storyId}.${isVideo ? "mp4" : "jpg"}`,
        },
      ],
      extractedAt: new Date().toISOString(),
      sourceUrl,
    };
  }

  private async extractHighlight(
    highlightId: string,
    sourceUrl: string
  ): Promise<ExtractedMedia> {
    const pageUrl = `https://www.instagram.com/stories/highlights/${highlightId}/`;
    const html = await this.fetchPage(pageUrl);
    const media: MediaItem[] = [];

    const videoUrls = [...html.matchAll(/"video_url":"([^"]+)"/g)];
    const imageUrls = [...html.matchAll(/"display_url":"([^"]+)"/g)];

    videoUrls.forEach((match, i) => {
      const url = this.decodeInstagramUrl(match[1] ?? "");
      if (url) {
        media.push({
          id: `${highlightId}_video_${i}`,
          type: "video",
          url,
          quality: "original",
          filename: `highlight_${highlightId}_${i + 1}.mp4`,
        });
      }
    });

    if (media.length === 0) {
      imageUrls.forEach((match, i) => {
        const url = this.decodeInstagramUrl(match[1] ?? "");
        if (url) {
          media.push({
            id: `${highlightId}_image_${i}`,
            type: "image",
            url,
            quality: "original",
            filename: `highlight_${highlightId}_${i + 1}.jpg`,
          });
        }
      });
    }

    if (media.length === 0) {
      throw new ExtractionError(
        "HIGHLIGHT_UNAVAILABLE",
        "Highlight not found or is private",
        404
      );
    }

    return {
      id: highlightId,
      contentType: "highlight",
      media,
      extractedAt: new Date().toISOString(),
      sourceUrl,
    };
  }

  private async extractProfilePicture(
    username: string,
    sourceUrl: string
  ): Promise<ExtractedMedia> {
    const profile = await fetchProfilePicture(username);

    return {
      id: username,
      username: profile.username,
      contentType: "profile_picture",
      thumbnailUrl: profile.profileUrl,
      media: [
        {
          id: `${profile.username}_profile`,
          type: "image",
          url: profile.profileUrl,
          quality: "hd",
          filename: `${profile.username}_profile.jpg`,
        },
      ],
      extractedAt: new Date().toISOString(),
      sourceUrl,
    };
  }
}

export const instagramExtractor = new InstagramExtractorService();
