"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { POSTHOG_KEY, POSTHOG_HOST, CLARITY_ID } from "@/lib/site";

/**
 * Loads PostHog (funnel + replay) and Microsoft Clarity (heatmaps + replay) on
 * the client only, after mount, both off unless their id/key is set. PostHog is
 * dynamically imported so it stays out of the initial bundle. Inputs are masked
 * in session recording (financial site). Funnel events flow in automatically
 * because lib/analytics.ts forwards every track() call to window.posthog /
 * window.clarity.
 */
let phStarted = false;

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || POSTHOG_KEY;
    if (key && !phStarted) {
      phStarted = true;
      import("posthog-js")
        .then(({ default: posthog }) => {
          posthog.init(key, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || POSTHOG_HOST,
            person_profiles: "identified_only",
            capture_pageview: false,
            capture_pageleave: true,
            session_recording: { maskAllInputs: true },
          });
          (window as unknown as { posthog?: unknown }).posthog = posthog;
          posthog.capture("$pageview");
        })
        .catch(() => {});
    }

    const cid = process.env.NEXT_PUBLIC_CLARITY_ID || CLARITY_ID;
    const w = window as unknown as { clarity?: { q?: unknown[] } & ((...a: unknown[]) => void) };
    if (cid && !w.clarity) {
      const c = function (...args: unknown[]) {
        (c.q = c.q || []).push(args);
      } as { q?: unknown[] } & ((...a: unknown[]) => void);
      w.clarity = c;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.clarity.ms/tag/" + cid;
      document.head.appendChild(s);
    }
  }, []);

  // Pageview on client-side route changes.
  useEffect(() => {
    const ph = (window as unknown as { posthog?: { capture: (e: string) => void } }).posthog;
    ph?.capture("$pageview");
  }, [pathname]);

  return null;
}
