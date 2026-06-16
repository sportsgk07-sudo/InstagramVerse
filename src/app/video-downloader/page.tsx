import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Video Downloader — Download Videos in HD",
  description:
    "Download Instagram videos and IGTV in HD quality. Free video downloader for public posts.",
  path: "/video-downloader",
  keywords: ["instagram video downloader", "download instagram videos", "igtv downloader"],
});

export default function VideoDownloaderPage() {
  return (
    <DownloaderPage
      title="Instagram Video Downloader"
      description="Download Instagram videos and IGTV content in the highest available quality."
      contentType="video"
      placeholder="Paste Instagram Video URL here..."
    />
  );
}
