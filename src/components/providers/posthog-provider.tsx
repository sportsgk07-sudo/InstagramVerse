"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

  useEffect(() => {
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, [key, host]);

  useEffect(() => {
    if (!key) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, key]);

  return <>{children}</>;
}
