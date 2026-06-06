/**
 * Lightweight, vendor-neutral analytics hook.
 *
 * No paid tools are wired up yet (per scope). Every event is:
 *   1. pushed to window.dataLayer  (GTM-ready)
 *   2. dispatched as a CustomEvent  (any listener / future crawler can subscribe)
 *   3. logged in development
 *
 * Swap the body of `track()` to send to GA4 / Segment / PostHog later without
 * touching any call sites.
 */

export type AnalyticsEventName =
  | "landing_page_view"
  | "cta_clicked"
  | "prequal_form_started"
  | "prequal_step_completed"
  | "prequal_contact_captured"
  | "prequal_form_submitted"
  | "partial_lead_saved"
  | "green_lead"
  | "yellow_lead"
  | "red_lead";

export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

export function track(event: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  const data = { event, ...payload, ts: Date.now() };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);

  window.dispatchEvent(new CustomEvent("analytics", { detail: data }));

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
}

/** Convenience alias so call sites can read as <AnalyticsEvent name=... />-style. */
export const AnalyticsEvent = { track };
