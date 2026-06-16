import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Highlights Downloader — Save Story Highlights",
  description:
    "Download Instagram Story Highlights in original quality. Save highlight reels from public accounts.",
  path: "/highlights-downloader",
  keywords: ["instagram highlights downloader", "save story highlights", "download highlights"],
});

export default function HighlightsDownloaderPage() {
  return (
    <DownloaderPage
      title="Instagram Highlights Downloader"
      description="Download Instagram Story Highlights from public accounts. Paste a highlights URL to save all items."
      contentType="highlight"
      placeholder="Paste Instagram Highlights URL here..."
    />
  );
}
