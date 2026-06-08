"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { getCalNs, buildCalUrl, CALCOM_ENABLED, CALCOM_HANDLE } from "@/lib/calcom";

/**
 * Cal.com INLINE embed. Renders the booking calendar on our own page (no
 * redirect), prefilled with the lead's name + email, and fires booking_confirmed
 * on a successful booking. Client-only; only mounts in the unlocked payoff so it
 * never weighs on the initial load. A small fallback link covers the rare case
 * where the embed script is blocked.
 */
export default function BookCallInline({
  vertical,
  name,
  email,
  notes,
  onConfirmed,
}: {
  vertical: string;
  name?: string;
  email?: string;
  notes?: string;
  onConfirmed?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CALCOM_ENABLED || !ref.current) return;
    const el = ref.current;
    const cal = getCalNs();
    if (!cal) return;
    try {
      el.innerHTML = "";
      cal("inline", {
        elementOrSelector: el,
        calLink: CALCOM_HANDLE,
        config: { name: name || "", email: email || "", notes: notes || "", layout: "month_view", theme: "auto", useSlotsViewOnSmallScreen: "true" },
      });
      cal("ui", { hideEventTypeDetails: true, layout: "month_view" });
      cal("on", { action: "bookingSuccessful", callback: () => onConfirmed?.() });
      track("booking_opened", { vertical, source: "inline" });
    } catch {
      /* ignore */
    }
    return () => {
      el.innerHTML = "";
    };
  }, [name, email, notes, vertical]);

  if (!CALCOM_ENABLED) return null;
  const fallbackUrl = buildCalUrl(name, email, notes);

  return (
    <div>
      <div className="relative min-h-[560px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Loading the calendar&hellip;
        </div>
        {/* Cal.com renders its booking iframe into this node, painting over the loader. */}
        <div ref={ref} className="relative h-full min-h-[560px] w-full" />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Trouble loading the calendar?{" "}
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
          Open it here
        </a>
        .
      </p>
    </div>
  );
}
