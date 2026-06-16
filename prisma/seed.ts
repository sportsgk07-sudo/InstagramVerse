import { hash } from "bcryptjs";
import { prisma } from "@/lib/infrastructure/database/prisma";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@instagramverse.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-in-production";

  const passwordHash = await hash(adminPassword, 12);

  await prisma.adminAccount.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isActive: true },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Administrator",
      isActive: true,
    },
  });

  const blogPosts = [
    {
      slug: "how-to-download-instagram-reels",
      title: "How to Download Instagram Reels in HD Quality",
      excerpt:
        "Learn the fastest way to save Instagram Reels to your device without losing quality.",
      content: `# How to Download Instagram Reels in HD Quality

Instagram Reels are short-form videos that millions of users create every day. Whether you want to save a tutorial, a funny clip, or inspiration for your own content, InstagramVerse makes it simple.

## Step 1: Copy the Reel URL
Open the Reel on Instagram and tap the share icon, then copy the link.

## Step 2: Paste into InstagramVerse
Visit our Reel downloader page and paste the URL into the input field.

## Step 3: Download
Click download and choose your preferred quality. We always fetch the highest available resolution.

## Tips
- Only download public content you have permission to save
- Reels with music may have regional restrictions
- Use our tool on mobile or desktop — it works everywhere`,
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "instagram-story-downloader-guide",
      title: "Complete Guide to Downloading Instagram Stories",
      excerpt:
        "Everything you need to know about saving Instagram Stories before they disappear.",
      content: `# Complete Guide to Downloading Instagram Stories

Stories disappear after 24 hours, but you can save them while they're live using InstagramVerse.

## Public Stories Only
Our tool works with public accounts. Private account stories require authorization from the account owner.

## How It Works
Paste the story URL or profile URL into our Story Downloader. We extract the media and provide direct download links.

## Best Practices
Always respect creators' rights and only download content for personal use unless you have explicit permission.`,
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "save-instagram-photos-without-quality-loss",
      title: "Save Instagram Photos Without Quality Loss",
      excerpt:
        "Download Instagram photos in original resolution with our free photo downloader.",
      content: `# Save Instagram Photos Without Quality Loss

Screenshots compress images and reduce quality. InstagramVerse fetches the original CDN URL for crisp, full-resolution downloads.

## Supported Formats
- Single photos
- Carousel posts (multiple images)
- Profile pictures

Paste any Instagram post URL and download every image in the carousel individually.`,
      published: true,
      publishedAt: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const defaultSettings = [
    { key: "rate_limit_enabled", value: true },
    { key: "maintenance_mode", value: false },
    { key: "max_downloads_per_day", value: 100 },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
