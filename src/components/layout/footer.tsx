import Link from "next/link";
import { Download } from "lucide-react";

const footerLinks = {
  downloaders: [
    { href: "/reel-downloader", label: "Reel Downloader" },
    { href: "/story-downloader", label: "Story Downloader" },
    { href: "/photo-downloader", label: "Photo Downloader" },
    { href: "/video-downloader", label: "Video Downloader" },
    { href: "/profile-picture-downloader", label: "Profile Picture" },
    { href: "/highlights-downloader", label: "Highlights" },
  ],
  company: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <Download className="h-4 w-4" />
              </div>
              InstagramVerse
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Download Instagram Reels, Stories, Photos, and Videos in original quality.
              Free, fast, and secure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Downloaders</h3>
            <ul className="space-y-2">
              {footerLinks.downloaders.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InstagramVerse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right max-w-md">
            InstagramVerse is not affiliated with Instagram or Meta. Only download content you have
            permission to save.
          </p>
        </div>
      </div>
    </footer>
  );
}
