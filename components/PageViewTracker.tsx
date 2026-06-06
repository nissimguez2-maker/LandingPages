"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { captureUtm } from "@/lib/utm";

/** Fires landing_page_view once and captures UTM attribution for the session. */
export default function PageViewTracker({ vertical }: { vertical: string }) {
  useEffect(() => {
    const utm = captureUtm();
    track("landing_page_view", { vertical, ...utm });
  }, [vertical]);
  return null;
}
