import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { createMetadata, createJsonLd, siteConfig } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} — Download Instagram Reels, Stories & Photos`,
  description: siteConfig.description,
  keywords: [
    "instagram downloader",
    "download instagram reels",
    "instagram story downloader",
    "instagram video downloader",
    "save instagram photos",
  ],
});

const jsonLd = createJsonLd({
  type: "WebSite",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <PostHogProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </PostHogProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
