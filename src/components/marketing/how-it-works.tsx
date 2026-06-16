"use client";

import { motion } from "framer-motion";
import { Link2, Search, Download } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste URL",
    description: "Copy any Instagram post, reel, story, or profile link and paste it above.",
  },
  {
    icon: Search,
    step: "02",
    title: "Extract Media",
    description: "Our system analyzes the URL and fetches all available media in original quality.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download",
    description: "Preview the content and download photos or videos directly to your device.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download Instagram content in three simple steps
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glass-lg">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest">{item.step}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
