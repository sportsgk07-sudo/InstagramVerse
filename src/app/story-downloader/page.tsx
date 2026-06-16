import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Story Downloader — Save Stories Free",
  description:
    "Download Instagram Stories before they expire. Free story saver for public accounts.",
  path: "/story-downloader",
  keywords: ["instagram story downloader", "save instagram stories", "story saver"],
});

export default function StoryDownloaderPage() {
  return (
    <DownloaderPage
      title="Instagram Story Downloader"
      description="Save Instagram Stories from public accounts before they disappear. Paste a story URL to download."
      contentType="story"
      placeholder="Paste Instagram Story URL here..."
    />
  );
}
