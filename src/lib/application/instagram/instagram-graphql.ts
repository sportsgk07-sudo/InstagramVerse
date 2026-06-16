import {
  buildInstagramHeaders,
  getInstagramSession,
  invalidateInstagramSession,
} from "@/lib/application/instagram/instagram-session";
import { ExtractionError } from "@/lib/application/instagram/errors";

const GRAPHQL_URL = "https://www.instagram.com/graphql/query";
const MEDIA_DOC_ID = process.env.INSTAGRAM_MEDIA_DOC_ID ?? "9510064595728286";

export interface GraphQLMediaNode {
  __typename?: string;
  id?: string;
  shortcode?: string;
  display_url?: string;
  video_url?: string;
  is_video?: boolean;
  video_duration?: number;
  dimensions?: { width: number; height: number };
  thumbnail_src?: string;
  edge_sidecar_to_children?: {
    edges: Array<{
      node: {
        id: string;
        display_url?: string;
        video_url?: string;
        is_video?: boolean;
        dimensions?: { width: number; height: number };
      };
    }>;
  };
  owner?: {
    username?: string;
    full_name?: string;
  };
  edge_media_to_caption?: {
    edges: Array<{ node: { text?: string } }>;
  };
}

interface GraphQLMediaResponse {
  data?: {
    xdt_shortcode_media?: GraphQLMediaNode | null;
  };
  errors?: Array<{ message?: string }>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isJsonResponse(contentType: string | null, body: string): boolean {
  if (contentType?.includes("json") || contentType?.includes("javascript")) {
    return true;
  }
  const trimmed = body.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

export async function fetchShortcodeMedia(
  shortcode: string,
  pathType: "p" | "reel" | "tv" = "p",
  retries = 3
): Promise<GraphQLMediaNode> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const session = await getInstagramSession(attempt > 0);
      const pageUrl = `https://www.instagram.com/${pathType}/${shortcode}/`;

      const body = new URLSearchParams({
        variables: JSON.stringify({
          shortcode,
          fetch_tagged_user_count: null,
          hoisted_comment_id: null,
          hoisted_reply_id: null,
        }),
        doc_id: MEDIA_DOC_ID,
      });

      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: buildInstagramHeaders(session, {
          referer: pageUrl,
          contentType: "application/x-www-form-urlencoded",
        }),
        body: body.toString(),
        next: { revalidate: 0 },
      });

      const responseText = await response.text();

      if (!response.ok) {
        if ([403, 429].includes(response.status) && attempt < retries - 1) {
          invalidateInstagramSession();
          await sleep(1000 * (attempt + 1));
          continue;
        }
        throw new ExtractionError(
          "GRAPHQL_FAILED",
          `Instagram GraphQL request failed (${response.status})`,
          response.status === 429 ? 429 : 502
        );
      }

      if (!isJsonResponse(response.headers.get("content-type"), responseText)) {
        invalidateInstagramSession();
        if (attempt < retries - 1) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        throw new ExtractionError(
          "GRAPHQL_INVALID_RESPONSE",
          "Instagram returned an invalid response. Please try again.",
          502
        );
      }

      const json = JSON.parse(responseText) as GraphQLMediaResponse;

      if (json.errors?.length) {
        throw new ExtractionError(
          "GRAPHQL_ERROR",
          json.errors[0]?.message ?? "Instagram GraphQL error",
          422
        );
      }

      const media = json.data?.xdt_shortcode_media;
      if (!media) {
        throw new ExtractionError(
          "MEDIA_NOT_FOUND",
          "Media not found. The post may be private or deleted.",
          404
        );
      }

      return media;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (error instanceof ExtractionError) throw error;
      if (attempt < retries - 1) {
        invalidateInstagramSession();
        await sleep(1000 * (attempt + 1));
        continue;
      }
    }
  }

  throw new ExtractionError(
    "GRAPHQL_FAILED",
    lastError?.message ?? "Failed to fetch media from Instagram",
    502
  );
}
