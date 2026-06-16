import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of Service — InstagramVerse",
  description: "Read InstagramVerse terms of service. Understand the rules for using our Instagram downloader.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> June 16, 2025</p>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using InstagramVerse, you agree to be bound by these Terms of Service.
        If you do not agree, please do not use our service.
      </p>

      <h2>Service Description</h2>
      <p>
        InstagramVerse provides a tool to download publicly available Instagram media. We are not affiliated with,
        endorsed by, or connected to Instagram or Meta Platforms, Inc.
      </p>

      <h2>Acceptable Use</h2>
      <ul>
        <li>Only download content you have the right to save</li>
        <li>Do not use the service for copyright infringement</li>
        <li>Do not attempt to bypass rate limits or abuse the service</li>
        <li>Do not use automated tools to scrape our service</li>
        <li>Respect the intellectual property rights of content creators</li>
      </ul>

      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
        availability, accuracy, or that downloads will always work due to changes in Instagram&apos;s platform.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        InstagramVerse shall not be liable for any indirect, incidental, or consequential damages arising from
        your use of the service.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance
        of updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact us at legal@instagramverse.com.
      </p>
    </div>
  );
}
