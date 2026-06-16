import { z } from "zod";

const instagramHostPattern =
  /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i;

export const instagramUrlSchema = z
  .string()
  .trim()
  .min(10, "URL is too short")
  .max(2048, "URL is too long")
  .url("Please enter a valid URL")
  .refine((url) => instagramHostPattern.test(url), {
    message: "Please enter a valid Instagram URL",
  });

export const extractRequestSchema = z.object({
  url: instagramUrlSchema,
  contentType: z
    .enum([
      "reel",
      "video",
      "photo",
      "carousel",
      "story",
      "highlight",
      "profile_picture",
      "auto",
    ])
    .optional()
    .default("auto"),
});

export const downloadRequestSchema = z.object({
  url: z.string().url(),
  mediaId: z.string().min(1),
  filename: z.string().min(1).max(255).optional(),
});

export const metadataQuerySchema = z.object({
  url: instagramUrlSchema,
});

export type ExtractRequest = z.infer<typeof extractRequestSchema>;
export type DownloadRequest = z.infer<typeof downloadRequestSchema>;
export type MetadataQuery = z.infer<typeof metadataQuerySchema>;

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim().split("?")[0]?.split("#")[0]?.replace(/\/$/, "") ?? url.trim();
  }
}

export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}
