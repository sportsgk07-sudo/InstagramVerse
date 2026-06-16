import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/metadata";
import { prisma } from "@/lib/infrastructure/database/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/reel-downloader",
    "/story-downloader",
    "/photo-downloader",
    "/video-downloader",
    "/profile-picture-downloader",
    "/highlights-downloader",
    "/faq",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ];

  let blogPosts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB may not be available during build
  }

  const base = siteConfig.url;

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
