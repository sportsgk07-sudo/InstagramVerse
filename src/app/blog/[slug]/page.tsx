import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMetadata, createJsonLd, siteConfig } from "@/lib/seo/metadata";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  const jsonLd = createJsonLd({
    type: "Article",
    name: post.title,
    description: post.excerpt,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: post.publishedAt?.toISOString(),
  });

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button variant="ghost" asChild className="mb-8">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.publishedAt && (
          <time className="text-sm text-muted-foreground">
            {post.publishedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
        {post.content.replace(/^# .+\n\n/, "")}
      </div>
    </article>
  );
}
