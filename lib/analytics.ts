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
  | "prequal_step_abandoned"
  | "prequal_validation_error"
  | "prequal_contact_captured"
  | "prequal_form_submitted"
  | "partial_lead_saved"
  | "calculator_used"
  | "stresstest_viewed"
  | "stresstest_started"
  | "stresstest_step"
  | "stresstest_completed"
  | "stresstest_result_shown"
  | "stresstest_contact_shown"
  | "stresstest_contact_captured"
  | "stresstest_lead_saved"
  | "stresstest_enrichment_saved"
  | "stresstest_validation_error"
  | "stresstest_cta"
  | "stresstest_call_booked"
  | "booking_opened"
  | "booking_confirmed"
  | "booking_floating_shown"
  | "booking_exit_intent"
  | "industries_menu_opened"
  | "industry_menu_clicked"
  | "industry_picker_routed"
  | "experiment_variant"
  | "green_lead"
  | "yellow_lead"
  | "red_lead";

export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

const SESSION_KEY = "mca_session_id";

/** Stable per-session id for funnel stitching + conversion-API dedup later. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function track(event: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  const data = { event, session_id: getSessionId(), ...payload, ts: Date.now() };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);

  window.dispatchEvent(new CustomEvent("analytics", { detail: data }));

  // Forward to PostHog + Microsoft Clarity when they are loaded (see Analytics.tsx).
  const w = window as unknown as {
    posthog?: { capture: (e: string, p?: Record<string, unknown>) => void };
    clarity?: (...args: unknown[]) => void;
  };
  w.posthog?.capture(event, { ...payload, session_id: data.session_id });
  w.clarity?.("event", event);

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
}

/**
 * Create a PostHog person profile (person_profiles is "identified_only") so the
 * visitor's funnel events stitch into one person once they become a lead. Uses
 * the non-PII session id as the distinct id, never raw email/phone.
 */
export function identifyLead(props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const id = getSessionId();
  if (!id) return;
  const ph = (window as unknown as { posthog?: { identify: (id: string, p?: Record<string, unknown>) => void } }).posthog;
  ph?.identify(id, props);
}

/** Convenience alias so call sites can read as <AnalyticsEvent name=... />-style. */
export const AnalyticsEvent = { track };
