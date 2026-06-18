/**
 * Deep-application engine (no React, no window at module load).
 *
 * The prequal "Cash-Flow Stress Test" captures a light lead. This module powers
 * the *full* underwriting application at /apply/[vertical]: the step model, the
 * masking/format helpers for the sensitive fields, manual validation (same style
 * as the prequal — no zod), a completeness meter that starts non-zero because the
 * prequal already did real work, and the prefill bridge that hands the lead off.
 *
 * Security note (engineering, not legalese): the raw SSN and the signature image
 * are NEVER part of LeadData (the analytics/CRM-bound shape). They ride only on
 * `ApplicationSubmission`, straight to the server, which tokenizes the SSN and
 * keeps just the last four. `redactSensitive()` strips both before anything is
 * logged. The UI promises "encrypted," so the wiring has to make that true.
 */

import type { LeadData } from "./types";

/* ── Format + mask helpers (pure) ───────────────────────────────────────── */

export function digitsOnly(v: string): string {
  return (v || "").replace(/\D/g, "");
}

/** "123456789" → "123-45-6789" (formats progressively as typed). */
export function formatSsn(v: string): string {
  const d = digitsOnly(v).slice(0, 9);
  let out = d.slice(0, 3);
  if (d.length > 3) out += "-" + d.slice(3, 5);
  if (d.length > 5) out += "-" + d.slice(5, 9);
  return out;
}

/** "123456789" → "12-3456789". */
export function formatEin(v: string): string {
  const d = digitsOnly(v).slice(0, 9);
  return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
}

export function ssnLast4(v: string): string {
  return digitsOnly(v).slice(-4);
}

/** Display value once a full SSN exists: "•••-••-6789". Otherwise the live format. */
export function maskSsnDisplay(v: string): string {
  const d = digitsOnly(v);
  if (d.length < 9) return formatSsn(v);
  return `•••-••-${d.slice(-4)}`;
}

/** "$12,345" from raw keystrokes. */
export function formatCurrency(v: string): string {
  const d = digitsOnly(v);
  if (!d) return "";
  return "$" + Number(d).toLocaleString("en-US");
}

/**
 * "$12,345" or "12345" → 12345 (number). Returns 0 if unparseable.
 * Use at submit/normalization so automations receive a clean number.
 */
export function parseCurrency(v: string): number {
  const d = digitsOnly(v);
  return d ? Number(d) : 0;
}

/**
 * Progressive display format for US phone numbers.
 * "5551234567" → "+1 (555) 123-4567"
 * Formats partially as the user types (up to 10 digits, always prefixed +1).
 */
export function formatPhoneDisplay(raw: string): string {
  const d = digitsOnly(raw).slice(0, 10);
  if (!d) return "";
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** E.164 normalized phone: "+15551234567". Returns empty string if fewer than 10 digits. */
export function normalizePhone(raw: string): string {
  const d = digitsOnly(raw).slice(0, 10);
  return d.length === 10 ? `+1${d}` : "";
}

/** 5-digit ZIP only (digits, max 5). */
export function formatZip(raw: string): string {
  return digitsOnly(raw).slice(0, 5);
}

/**
 * Map the prequal amount BAND (AMOUNT_OPTIONS value) to a sensible, EDITABLE
 * starting dollar figure for the deep-apply "capital requested" field, so the
 * owner doesn't retype a number they already gave as a range. Returns a formatted
 * "$50,000" string (or "" if the band is unknown). Always editable — it's a
 * starting point, not a commitment.
 */
export function capitalFromAmountBand(band?: string): string {
  switch (band) {
    case "under_25k":
      return formatCurrency("15000");
    case "25k_50k":
      return formatCurrency("35000");
    case "50k_100k":
      return formatCurrency("75000");
    case "100k_250k":
      return formatCurrency("150000");
    case "250k_plus":
      return formatCurrency("250000");
    default:
      return "";
  }
}

/** True for exactly 5 digits. */
export function isValidZip(v: string): boolean {
  return digitsOnly(v).length === 5;
}

/* ── Validators ─────────────────────────────────────────────────────────── */

export function isValidSsn(v: string): boolean {
  const d = digitsOnly(v);
  if (d.length !== 9) return false;
  const area = d.slice(0, 3);
  if (area === "000" || area === "666" || Number(area) >= 900) return false;
  if (d.slice(3, 5) === "00") return false;
  if (d.slice(5) === "0000") return false;
  return true;
}

export function isValidEin(v: string): boolean {
  return digitsOnly(v).length === 9;
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

export function isPhone(v: string): boolean {
  return digitsOnly(v).length >= 10;
}

/** True for exactly 10 US digits. */
export function isValidPhone(v: string): boolean {
  return digitsOnly(v).length === 10;
}

/* ── Step model ─────────────────────────────────────────────────────────── */

export type ApplicationStepId = "business" | "owner" | "review";

export interface ApplicationStepDef {
  id: ApplicationStepId;
  /** Short label for the stepper rail. */
  label: string;
  /** Screen heading. */
  title: string;
  /** Screen subhead — reassurance, set once per screen. */
  subtitle: string;
}

/**
 * Three steps, ordered by ascending sensitivity × sunk cost. Fewer clicks than
 * the old five: the funding ask is merged into the business step, and the bank
 * statements / optional docs are folded into the final review-and-sign screen so
 * the owner never taps "Continue" just to reach an upload that's optional anyway.
 * SSN never appears on screen 1 — it stays on the owner step, and it's optional.
 */
export const APPLICATION_STEPS: readonly ApplicationStepDef[] = [
  { id: "business", label: "Business", title: "Your business & funding", subtitle: "Most of this is already filled in." },
  { id: "owner", label: "Owner", title: "About you, the owner", subtitle: "A quick identity check. About a minute." },
  { id: "review", label: "Documents & sign", title: "Documents, review & sign", subtitle: "Add statements (or send them later), then confirm." },
] as const;

/** Index of a step id within APPLICATION_STEPS. */
export function stepIndex(id: ApplicationStepId): number {
  return APPLICATION_STEPS.findIndex((s) => s.id === id);
}

/* ── Validation (manual, lenient where the agents said to never hard-gate) ── */

export function validateStep(step: ApplicationStepId, lead: LeadData): Record<string, string> {
  const e: Record<string, string> = {};
  const need = (k: keyof LeadData, msg: string) => {
    if (!String(lead[k] ?? "").trim()) e[k as string] = msg;
  };

  switch (step) {
    case "business":
      // Business facts + the funding ask (merged from the old "funding" step).
      need("businessLegalName", "Add your legal business name.");
      if (!lead.entityType) e.entityType = "Pick your business type.";
      need("businessStreet", "Add your business street address.");
      need("businessCity", "Add the city.");
      if (!lead.businessState || lead.businessState.trim().length !== 2) e.businessState = "Select the state.";
      if (lead.businessZip && !isValidZip(lead.businessZip)) e.businessZip = "ZIP must be 5 digits.";
      else if (!lead.businessZip) e.businessZip = "Add the ZIP code.";
      need("capitalRequested", "How much capital are you looking for?");
      // Use of funds: multi-select — at least one keeps the lead routable.
      if (!lead.useOfFundsList || lead.useOfFundsList.length < 1) {
        e.useOfFundsList = "Pick at least one — what will you use it for?";
      }
      // EIN is deferrable (many owners don't have it memorized) — only validate format if given.
      if (lead.ein && !isValidEin(lead.ein)) e.ein = "An EIN is 9 digits, like 12-3456789.";
      break;
    case "owner":
      need("ownerFullName", "Add the owner's full legal name.");
      // DOB is OPTIONAL — a specialist can take it on the call. Never gates submit.
      // Owner address: when "same as business" is checked the fields are hidden and
      // the business address is copied in at submit, so skip these checks entirely.
      if (!lead.ownerAddressSameAsBusiness) {
        need("ownerStreet", "Add the home street address.");
        need("ownerCity", "Add the city.");
        if (!lead.ownerState || lead.ownerState.trim().length !== 2) e.ownerState = "Select the state.";
        if (lead.ownerZip && !isValidZip(lead.ownerZip)) e.ownerZip = "ZIP must be 5 digits.";
        else if (!lead.ownerZip) e.ownerZip = "Add the ZIP code.";
      }
      if (!lead.creditScoreBand) e.creditScoreBand = "Pick the range that fits.";
      // SSN is OPTIONAL — never a gate. The owner can share it now (soft check) or
      // give it to a specialist by phone. No error either way.
      break;
    case "review":
      // Documents are folded into this step but NEVER gate — statements can always
      // be sent to a specialist. e-sign agreement is the one consent we ask for.
      // The soft-credit-pull consent applies ONLY when an SSN was actually provided.
      if (!lead.esignConsent) e.esignConsent = "Please agree to sign electronically.";
      if (lead.ssnProvided && !lead.creditAuthConsent) {
        e.creditAuthConsent = "To run the optional soft check, please authorize it — or remove your SSN.";
      }
      // Signature is OPTIONAL — submitting does not require a typed signature.
      break;
  }
  return e;
}

export function isStepComplete(step: ApplicationStepId, lead: LeadData): boolean {
  return Object.keys(validateStep(step, lead)).length === 0;
}

/* ── Completeness meter (starts at the prequal baseline, never 0) ────────── */

/**
 * The deep app opens partway along the bar because the prequal + contact step
 * were genuinely completed before /apply. This is carried-over progress, not a
 * manufactured number — the UI labels it as such (see Stepper `baseline`).
 */
export const PROGRESS_BASELINE = 60;
const STEP_WEIGHT: Record<ApplicationStepId, number> = {
  business: 16,
  owner: 14,
  review: 10,
};

/** 60..100 — frames the deep app as "finishing", not "starting". */
export function computeApplicationProgress(lead: LeadData): number {
  let pct = PROGRESS_BASELINE;
  for (const s of APPLICATION_STEPS) {
    if (isStepComplete(s.id, lead)) pct += STEP_WEIGHT[s.id];
  }
  return Math.min(100, pct);
}

/* ── Prefill + local draft bridge (client only) ─────────────────────────── */

const PREFILL_KEY = "mca_apply_prefill";
const DRAFT_KEY = "mca_apply_draft";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / disabled — non-fatal */
  }
}

/** Called by the prequal at handoff so /apply opens visibly half-complete. */
export function saveApplicationPrefill(lead: Partial<LeadData>): void {
  writeJson(PREFILL_KEY, lead);
}

export function readApplicationPrefill(): Partial<LeadData> {
  return readJson<Partial<LeadData>>(PREFILL_KEY) ?? {};
}

/**
 * Local draft so a refresh / accidental back-button mid-application doesn't wipe
 * progress. NEVER includes the raw SSN or signature image — only LeadData. True
 * cross-device resume (magic link) is the documented server-side next step.
 */
export function saveApplicationDraft(lead: LeadData): void {
  writeJson(DRAFT_KEY, lead);
}

export function readApplicationDraft(): LeadData | null {
  return readJson<LeadData>(DRAFT_KEY);
}

export function clearApplicationStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PREFILL_KEY);
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* non-fatal */
  }
}

/* ── Lead profile — the "who / what / why" for AI email personalization ──── */

export interface LeadProfile {
  vertical?: string; // landing-page slug the lead came through
  industry?: string; // what they do (free text if given, else the vertical)
  intent?: string; // WHY they want funding (use of funds) — the sales angle
  urgency?: string; // how soon — drives tone/cadence
  amount?: string; // requested figure or band
  businessName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
}

/** Compact, automation-friendly snapshot so downstream AI knows how to write. */
export function buildLeadProfile(lead: LeadData): LeadProfile {
  // Use-of-funds is multi-select on the deep apply form (useOfFundsList) and a
  // single value from the prequal (useOfFunds). Prefer the richer list; fall back
  // to the scalar so prequal-only leads still carry intent.
  const uses = lead.useOfFundsList?.length ? lead.useOfFundsList : lead.useOfFunds ? [lead.useOfFunds] : [];
  const intent = uses.length ? uses.join(", ") : undefined;
  return {
    vertical: lead.industry,
    industry: lead.natureOfBusiness || lead.industry,
    intent,
    urgency: lead.urgency,
    amount: lead.capitalRequested || lead.amountNeeded,
    businessName: lead.businessLegalName || lead.businessName,
    firstName: lead.firstName,
    email: lead.email,
    phone: lead.phone,
  };
}

/* ── The wire shape + redaction (shared with the server route) ──────────── */

/**
 * What the wizard POSTs. Extends LeadData with the two values that must never
 * be persisted in the open or echoed back: the raw SSN and the signature image.
 */
export interface ApplicationSubmission extends LeadData {
  /** Raw SSN — server tokenizes it and keeps only ssnLast4. */
  ssn?: string;
  /** Signature image data URL — goes to private storage, never to logs/CRM. */
  signatureDataUrl?: string;
}

const SENSITIVE_KEYS: (keyof ApplicationSubmission)[] = ["ssn", "signatureDataUrl"];

/** Strip secrets before any logging or telemetry; derive ssnLast4 for reference. */
export function redactSensitive(sub: ApplicationSubmission): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...sub };
  for (const k of SENSITIVE_KEYS) delete clone[k as string];
  if (typeof sub.ssn === "string" && sub.ssn) {
    clone.ssnLast4 = digitsOnly(sub.ssn).slice(-4);
    clone.ssnProvided = true;
  }
  return clone;
}
