"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Link2,
  Image as ImageIcon,
  Video,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import type { ContentCategory, ExtractedMedia } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

interface DownloaderProps {
  contentType?: ContentCategory | "auto";
  placeholder?: string;
  title?: string;
  className?: string;
}

type DownloadState = "idle" | "loading" | "success" | "error";

export function DownloaderForm({
  contentType = "auto",
  placeholder = "Paste Instagram URL here...",
  className,
}: DownloaderProps) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<DownloadState>("idle");
  const [result, setResult] = useState<ExtractedMedia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({ title: "URL required", description: "Please paste an Instagram URL" });
      return;
    }

    setState("loading");
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), contentType }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message ?? "Failed to extract media");
      }

      setResult(data.data as ExtractedMedia);
      setState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setState("error");
      toast({ title: "Extraction failed", description: message });
    }
  };

  const handleDownload = async (mediaId: string, mediaUrl: string, filename: string) => {
    setDownloadingId(mediaId);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mediaUrl, mediaId, filename }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error?.message ?? "Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      toast({ title: "Download started", description: filename });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      toast({ title: "Download failed", description: message });
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      toast({ title: "Paste failed", description: "Could not access clipboard" });
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-6", className)}>
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="pl-11 h-14 text-base"
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              aria-label="Instagram URL"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePaste} className="h-14 px-4">
              Paste
            </Button>
            <Button onClick={handleExtract} disabled={state === "loading"} className="h-14 px-8 min-w-[140px]">
              {state === "loading" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Download />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "error" && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">Extraction Failed</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "success" && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Media found successfully</span>
                </div>

                {result.username && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    @{result.username}
                  </div>
                )}

                {result.caption && (
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{result.caption}</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {result.media.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden border bg-muted/30"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          poster={item.thumbnailUrl}
                          controls
                          className="w-full aspect-square object-cover"
                        />
                      ) : (
                        <div className="relative aspect-square">
                          <Image
                            src={item.url}
                            alt={item.filename}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="p-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {item.type === "video" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                          <span className="truncate">{item.quality ?? "original"}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item.id, item.url, item.filename)}
                          disabled={downloadingId === item.id}
                        >
                          {downloadingId === item.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
