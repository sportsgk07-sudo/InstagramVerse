import { instagramExtractor } from "../src/lib/application/instagram/extractor";

async function main() {
  const urls = [
    "https://www.instagram.com/reel/DZnEkf-M-QQ/?utm_source=ig_web_copy_link",
    "https://www.instagram.com/p/DZnxcaEDZ5i/?img_index=1",
  ];

  for (const url of urls) {
    try {
      const result = await instagramExtractor.extract(url);
      console.log("OK", result.contentType, result.media.length, result.media[0]?.url?.slice(0, 80));
    } catch (error) {
      console.error("FAIL", url, error instanceof Error ? error.message : error);
    }
  }
}

main();
