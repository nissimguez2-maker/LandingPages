"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { getCalNs, CALCOM_ENABLED, CALCOM_HANDLE } from "@/lib/calcom";

/** Remove cal.com's injected floating button so it never lingers past its phase. */
function removeButton() {
  document.querySelectorAll("cal-floating-button").forEach((n) => n.remove());
}

/** Best-effort: pull an email + name out of cal.com's bookingSuccessful payload. */
function extractAttendee(e: unknown): { email?: string; name?: string } {
  try {
    const detail = (e as { detail?: { data?: unknown } })?.detail?.data ?? e;
    const json = JSON.stringify(detail);
    const email = json.match(/"email"\s*:\s*"([^"]+@[^"]+)"/)?.[1];
    const name = json.match(/"name"\s*:\s*"([^"]+)"/)?.[1];
    return { email, name };
  } catch {
    return {};
  }
}

/**
 * Cal.com FLOATING popup bubble (bottom-right), the fallback capture path. A
 * visitor who will not fill the form can still book a call in one tap, so we do
 * not lose them. Mounted only while it earns its place (the qualify step) and
 * removed on unmount. On a successful booking it reports the attendee up so the
 * lead still reaches the CRM even when the on-page form was skipped.
 */
export default function BookCallFloating({
  vertical,
  notes,
  buttonText = "Book a quick call",
  onBooked,
  onConfirmed,
}: {
  vertical: string;
  notes?: string;
  buttonText?: string;
  onBooked?: (info: { email?: string; name?: string }) => void;
  onConfirmed?: () => void;
}) {
  // Keep the latest callbacks without making them effect dependencies (no churn / no
  // duplicate floating buttons while the user types in the form below).
  const onBookedRef = useRef(onBooked);
  onBookedRef.current = onBooked;
  const onConfirmedRef = useRef(onConfirmed);
  onConfirmedRef.current = onConfirmed;

  useEffect(() => {
    if (!CALCOM_ENABLED) return;
    const cal = getCalNs();
    if (!cal) return;
    removeButton(); // guard against duplicates on remount
    try {
      cal("floatingButton", {
        calLink: CALCOM_HANDLE,
        buttonText,
        buttonColor: "#0f2a4a",
        buttonTextColor: "#ffffff",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "auto", ...(notes ? { notes } : {}) },
      });
      cal("ui", { hideEventTypeDetails: true, layout: "month_view" });
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: unknown) => {
          onConfirmedRef.current?.();
          onBookedRef.current?.(extractAttendee(e));
        },
      });
      track("booking_floating_shown", { vertical });
    } catch {
      /* ignore */
    }
    return () => removeButton();
  }, [vertical, notes, buttonText]);

  return null;
}
