"use client";

import { motion } from "framer-motion";
import { Film, Camera, Image, Video, User, Star } from "lucide-react";
import { DownloaderForm } from "@/components/downloader/downloader-form";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { SupportedFormatsSection } from "@/components/marketing/supported-formats";
import { FaqSection } from "@/components/marketing/faq-section";

const badges = [
  { icon: Film, label: "Reels" },
  { icon: Camera, label: "Stories" },
  { icon: Image, label: "Photos" },
  { icon: Video, label: "Videos" },
  { icon: User, label: "Profile" },
  { icon: Star, label: "Highlights" },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-brand opacity-10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-purple opacity-5 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Download Instagram{" "}
            <span className="text-gradient">Reels, Stories & Photos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            The fastest way to save Instagram media in original quality. Free, secure, and works on any device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {badges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <badge.icon className="h-3.5 w-3.5" />
                {badge.label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DownloaderForm placeholder="Paste Instagram URL here — Reels, Posts, Stories..." />
        </motion.div>
      </div>
    </section>
  );
}

function SeoContentSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-neutral dark:prose-invert">
        <h2>Free Instagram Downloader — Save Videos, Photos & Reels</h2>
        <p>
          InstagramVerse is a powerful online tool that lets you download Instagram content quickly and easily.
          Whether you need to save a Reel for offline viewing, download a carousel of photos, or grab a
          profile picture in HD, our platform handles it all with a single paste.
        </p>
        <h3>Download Instagram Reels in HD</h3>
        <p>
          Reels are among the most popular content on Instagram. With our Reel downloader, you can save
          any public Reel in high definition without watermarks or quality loss.
        </p>
        <h3>Save Instagram Stories Before They Expire</h3>
        <p>
          Stories disappear after 24 hours. Use our Story downloader to save them while they are still available.
          Works with public accounts only.
        </p>
        <h3>Works on All Devices</h3>
        <p>
          InstagramVerse is fully responsive and works on iPhone, Android, Windows, Mac, and Linux. No app
          installation required — just open your browser and start downloading.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SupportedFormatsSection />
      <FaqSection limit={5} showViewAll />
      <SeoContentSection />
    </>
  );
}
