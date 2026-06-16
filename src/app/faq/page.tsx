import { createMetadata, createJsonLd } from "@/lib/seo/metadata";
import { FaqSection } from "@/components/marketing/faq-section";
import { faqItems } from "@/lib/content/faq";
import { siteConfig } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "FAQ — InstagramVerse Help Center",
  description: "Find answers to common questions about downloading Instagram content with InstagramVerse.",
  path: "/faq",
});

const jsonLd = createJsonLd({
  type: "FAQPage",
  name: "InstagramVerse FAQ",
  description: "Frequently asked questions about InstagramVerse",
  url: `${siteConfig.url}/faq`,
  faqItems,
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground">
            Answers to the most common questions about using InstagramVerse
          </p>
        </div>
      </div>
      <FaqSection />
    </>
  );
}
