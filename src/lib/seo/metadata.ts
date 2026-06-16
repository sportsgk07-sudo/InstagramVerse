import { type Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "InstagramVerse";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://instagramverse.com";

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function createMetadata(config: SeoConfig): Metadata {
  const url = config.path ? `${appUrl}${config.path}` : appUrl;
  const ogImage = config.ogImage ?? `${appUrl}/og-default.png`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName: appName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: config.title }],
      locale: "en_US",
      type: config.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [ogImage],
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function createJsonLd(config: {
  type: "WebSite" | "WebPage" | "FAQPage" | "Article";
  name: string;
  description: string;
  url: string;
  faqItems?: Array<{ question: string; answer: string }>;
  datePublished?: string;
}) {
  const base = {
    "@context": "https://schema.org",
    "@type": config.type,
    name: config.name,
    description: config.description,
    url: config.url,
  };

  if (config.type === "WebSite") {
    return {
      ...base,
      potentialAction: {
        "@type": "SearchAction",
        target: `${config.url}/?url={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };
  }

  if (config.type === "FAQPage" && config.faqItems) {
    return {
      ...base,
      mainEntity: config.faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }

  if (config.type === "Article") {
    return {
      ...base,
      datePublished: config.datePublished,
      publisher: {
        "@type": "Organization",
        name: appName,
      },
    };
  }

  return base;
}

export const siteConfig = {
  name: appName,
  url: appUrl,
  description:
    "Download Instagram Reels, Stories, Photos, Videos, and more in original quality. Free, fast, and secure Instagram media downloader.",
  links: {
    twitter: "https://twitter.com/instagramverse",
    github: "https://github.com/instagramverse",
  },
};
