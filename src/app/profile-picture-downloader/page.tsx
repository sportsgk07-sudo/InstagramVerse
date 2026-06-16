import { createMetadata } from "@/lib/seo/metadata";
import { DownloaderPage } from "@/components/downloader/downloader-page";

export const metadata = createMetadata({
  title: "Instagram Profile Picture Downloader — HD Avatar Saver",
  description:
    "Download Instagram profile pictures in HD quality. Free DP downloader for any public account.",
  path: "/profile-picture-downloader",
  keywords: ["instagram profile picture downloader", "instagram dp downloader", "save profile photo"],
});

export default function ProfilePictureDownloaderPage() {
  return (
    <DownloaderPage
      title="Profile Picture Downloader"
      description="Download any public Instagram profile picture in HD. Paste a profile URL to get the full-resolution avatar."
      contentType="profile_picture"
      placeholder="Paste Instagram Profile URL here..."
    />
  );
}
