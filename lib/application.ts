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

/* ── Step model ─────────────────────────────────────────────────────────── */

export type ApplicationStepId = "business" | "funding" | "owner" | "documents" | "review";

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
 * Ordered by ascending sensitivity × sunk cost: easy business facts first, the
 * SSN deep in the owner step, bank statements last (an effort spike, never a
 * gate), then a single review + signature. This is the whole conversion thesis.
 */
export const APPLICATION_STEPS: readonly ApplicationStepDef[] = [
  {
    id: "business",
    label: "Business",
    title: "About your business",
    subtitle: "The basics on your company. Most of this is already filled in from your check.",
  },
  {
    id: "funding",
    label: "Funding",
    title: "Your funding request",
    subtitle: "What you need and a couple of quick business details.",
  },
  {
    id: "owner",
    label: "Owner",
    title: "About you, the owner",
    subtitle: "Funders verify the owner before releasing capital — same as opening a business account. About a minute.",
  },
  {
    id: "documents",
    label: "Documents",
    title: "Recent bank statements",
    subtitle: "Your last 3 months. A PDF or a clear photo works — and you can send them later if they aren't handy.",
  },
  {
    id: "review",
    label: "Review & sign",
    title: "Review and sign",
    subtitle: "Confirm everything looks right and authorize us to review your file.",
  },
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
      need("businessLegalName", "Add your legal business name.");
      if (!lead.entityType) e.entityType = "Pick your business type.";
      need("businessStreet", "Add your business street address.");
      need("businessCity", "Add the city.");
      need("businessState", "Add the state.");
      need("businessZip", "Add the ZIP code.");
      break;
    case "funding":
      need("capitalRequested", "How much capital are you looking for?");
      // EIN is deferrable (many owners don't have it memorized) — only validate format if given.
      if (lead.ein && !isValidEin(lead.ein)) e.ein = "An EIN is 9 digits, like 12-3456789.";
      break;
    case "owner":
      need("ownerFullName", "Add the owner's full legal name.");
      need("ownerDob", "Add the owner's date of birth.");
      need("ownerStreet", "Add the home street address.");
      need("ownerCity", "Add the city.");
      need("ownerState", "Add the state.");
      need("ownerZip", "Add the ZIP code.");
      if (!lead.creditScoreBand) e.creditScoreBand = "Pick the range that fits.";
      // SSN: required to submit, but the owner can choose to give it to a specialist
      // by phone instead. Never a hard dead-end.
      if (!lead.ssnDeferred && !lead.ssnProvided) {
        e.ssn = "Enter your SSN, or choose to give it by phone.";
      }
      break;
    case "documents":
      // Never blocks — statements can be deferred to a specialist. Scoring is neutral on this.
      break;
    case "review":
      if (!lead.creditAuthConsent) e.creditAuthConsent = "Please authorize the review to continue.";
      if (!lead.esignConsent) e.esignConsent = "Please agree to sign electronically.";
      need("signatureName", "Type your full legal name to sign.");
      break;
  }
  return e;
}

export function isStepComplete(step: ApplicationStepId, lead: LeadData): boolean {
  return Object.keys(validateStep(step, lead)).length === 0;
}

/* ── Completeness meter (starts at the prequal baseline, never 0) ────────── */

const PROGRESS_BASELINE = 60; // prequal + contact were already done before /apply
const STEP_WEIGHT: Record<ApplicationStepId, number> = {
  business: 8,
  funding: 8,
  owner: 12,
  documents: 6,
  review: 6,
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
