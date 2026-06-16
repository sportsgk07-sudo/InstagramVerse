import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Reel Downloader — Download Reels in HD Free",
  description:
    "Download Instagram Reels in HD quality for free. Paste any Reel URL and save videos instantly with InstagramVerse.",
  path: "/reel-downloader",
  keywords: ["instagram reel downloader", "download instagram reels", "save reels hd"],
});

export default function ReelDownloaderPage() {
  return (
    <DownloaderPage
      title="Instagram Reel Downloader"
      description="Download any public Instagram Reel in HD quality. Paste the Reel URL below and save videos instantly."
      contentType="reel"
      placeholder="Paste Instagram Reel URL here..."
    />
  );
}
