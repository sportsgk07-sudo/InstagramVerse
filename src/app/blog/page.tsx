import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Blog — Instagram Tips & Guides",
  description: "Read guides and tips for downloading Instagram content, saving Reels, Stories, and more.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Guides, tips, and tutorials for downloading Instagram content
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-glass-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  {post.publishedAt && (
                    <time className="text-xs text-muted-foreground mt-4 block">
                      {post.publishedAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
