"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Camera, Image, Video, User, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formats = [
  { icon: Film, label: "Reels", href: "/reel-downloader", color: "from-pink-500 to-rose-500" },
  { icon: Camera, label: "Stories", href: "/story-downloader", color: "from-purple-500 to-violet-500" },
  { icon: Image, label: "Photos", href: "/photo-downloader", color: "from-orange-500 to-amber-500" },
  { icon: Video, label: "Videos", href: "/video-downloader", color: "from-blue-500 to-cyan-500" },
  { icon: User, label: "Profile Pic", href: "/profile-picture-downloader", color: "from-green-500 to-emerald-500" },
  { icon: Star, label: "Highlights", href: "/highlights-downloader", color: "from-yellow-500 to-orange-500" },
];

export function SupportedFormatsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Formats</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download any type of public Instagram content
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
          {formats.map((format, i) => (
            <motion.div
              key={format.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={format.href}>
                <Card className="hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${format.color} text-white shadow-premium`}>
                      <format.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{format.label}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
