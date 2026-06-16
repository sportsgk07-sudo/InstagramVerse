import type { ContentCategory } from "@/lib/domain/types";
import { DownloaderForm } from "@/components/downloader/downloader-form";

interface DownloaderPageProps {
  title: string;
  description: string;
  contentType: ContentCategory;
  placeholder: string;
}

export function DownloaderPage({
  title,
  description,
  contentType,
  placeholder,
}: DownloaderPageProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-brand opacity-10 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <DownloaderForm contentType={contentType} placeholder={placeholder} />
      </div>
    </div>
  );
}
