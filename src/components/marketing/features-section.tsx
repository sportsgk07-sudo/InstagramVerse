"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Gift, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Extract and download media in seconds with our optimized processing pipeline.",
  },
  {
    icon: Sparkles,
    title: "Original Quality",
    description: "Download photos and videos in the highest available resolution from Instagram CDN.",
  },
  {
    icon: Gift,
    title: "Free to Use",
    description: "No registration required. Download unlimited public Instagram content for free.",
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Your data is never stored. All processing happens securely on our servers.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose InstagramVerse?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most reliable Instagram downloader trusted by millions of users worldwide.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-glass-lg transition-shadow duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-premium group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
