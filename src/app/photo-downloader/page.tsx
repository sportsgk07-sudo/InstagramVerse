import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Photo Downloader — Save Photos in Full Quality",
  description:
    "Download Instagram photos and carousel posts in original quality. Free photo saver tool.",
  path: "/photo-downloader",
  keywords: ["instagram photo downloader", "save instagram photos", "download instagram pictures"],
});

export default function PhotoDownloaderPage() {
  return (
    <DownloaderPage
      title="Instagram Photo Downloader"
      description="Download Instagram photos and carousel images in full resolution. Works with single and multi-image posts."
      contentType="photo"
      placeholder="Paste Instagram Photo URL here..."
    />
  );
}
