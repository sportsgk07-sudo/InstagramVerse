import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy — InstagramVerse",
  description: "Read InstagramVerse privacy policy. Learn how we handle your data and protect your privacy.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> June 16, 2025</p>

      <h2>Introduction</h2>
      <p>
        InstagramVerse (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, and safeguard information when you use our website.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and timestamps for analytics and rate limiting.</li>
        <li><strong>URLs Submitted:</strong> Instagram URLs you paste for processing. We do not permanently store downloaded media.</li>
        <li><strong>Cookies:</strong> Essential cookies for theme preferences and analytics (if enabled).</li>
      </ul>

      <h2>How We Use Information</h2>
      <ul>
        <li>To provide and improve our download service</li>
        <li>To prevent abuse through rate limiting</li>
        <li>To analyze usage patterns and improve performance</li>
        <li>To respond to support inquiries</li>
      </ul>

      <h2>Data Retention</h2>
      <p>
        Download logs and analytics data are retained for up to 90 days. We do not store the actual media files
        you download on our servers.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We may use third-party analytics (PostHog) and hosting providers. These services have their own privacy policies.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request deletion of your data by contacting us. You can opt out of analytics by disabling cookies in your browser.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related inquiries, contact us at privacy@instagramverse.com.
      </p>
    </div>
  );
}
