/**
 * Find-your-fit content: the question set and the page/result copy.
 *
 * The router itself lives in lib/fitRouting.ts (pure). This file is the human copy
 * layer: ~5 quick taps reusing the existing enums, plus compliant result framing
 * per ProductId, drawn from content/productsConfig.ts (the single product source
 * of truth). Compliance rails (docs/product-matrix.md §5) apply throughout: no
 * promised approval/rate/number, factor-rate vs APR kept straight, CROA framing on
 * the credit-runway path, and the not-yet path is always a real route.
 */

import type { Option, ProductId } from "@/lib/types";
import {
  USE_OF_FUNDS_OPTIONS,
  REVENUE_OPTIONS,
  TIME_IN_BUSINESS_OPTIONS,
  CREDIT_SCORE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/types";

/* ── Page-level copy ──────────────────────────────────────────────────────── */

export const FIT_PAGE = {
  seoTitle: "Find your funding fit | FundVella",
  seoDescription:
    "Answer five quick questions and see which funding option fits how your business actually earns. No hard credit check, no obligation. FundVella is not a lender.",
  eyebrow: "Find your fit",
  headline: "Find the funding that fits how you earn",
  intro:
    "There's no one-size-fits-all funding. Answer five quick questions and we'll point you to the option that fits your file, then a specialist confirms it. This is a quick match, not a credit check or an offer — there's no obligation.",
  startCta: "Find my fit",
  /** Default vertical used for the apply handoff and prefill. */
  defaultVertical: "business-funding",
} as const;

/* ── The quiz steps (tap-through, reusing existing enums) ──────────────────── */

export type FitFieldKind = "options" | "yesno";

export interface FitStep {
  /** Stable key, also the FitAnswers field it sets. */
  id:
    | "useOfFunds"
    | "monthlyRevenue"
    | "timeInBusiness"
    | "creditBand"
    | "ownsRealEstateEquity"
    | "hasUnpaidInvoices";
  kind: FitFieldKind;
  /** Question shown as the fieldset legend. */
  legend: string;
  /** Optional helper line under the legend. */
  help?: string;
  /** Option set (already-existing enums for "options" steps). */
  options: readonly Option[];
  /** Columns for the radio grid. */
  columns?: 1 | 2;
  /** When true, the step is informational/optional and can be skipped. */
  optional?: boolean;
}

export const FIT_STEPS: readonly FitStep[] = [
  {
    id: "useOfFunds",
    kind: "options",
    legend: "What's the money mainly for?",
    help: "Pick the closest. It points us at the right kind of funding.",
    options: USE_OF_FUNDS_OPTIONS,
    columns: 2,
  },
  {
    id: "monthlyRevenue",
    kind: "options",
    legend: "About how much does your business deposit a month?",
    help: "Your average monthly deposits — a rough range is fine.",
    options: REVENUE_OPTIONS,
    columns: 1,
  },
  {
    id: "timeInBusiness",
    kind: "options",
    legend: "How long have you been in business?",
    options: TIME_IN_BUSINESS_OPTIONS,
    columns: 2,
  },
  {
    id: "creditBand",
    kind: "options",
    legend: "Roughly where does your personal credit sit?",
    help: "A range is plenty. For most options, revenue does the heavy lifting.",
    options: CREDIT_SCORE_OPTIONS,
    columns: 1,
  },
  {
    id: "ownsRealEstateEquity",
    kind: "yesno",
    legend: "Do you own real estate with equity in it?",
    help: "Home or commercial property you owe less on than it's worth.",
    options: YES_NO_OPTIONS,
    columns: 2,
  },
  {
    id: "hasUnpaidInvoices",
    kind: "yesno",
    legend: "Is a chunk of your cash stuck in unpaid invoices?",
    help: "Optional — for businesses that bill net-30 or net-60.",
    options: YES_NO_OPTIONS,
    columns: 2,
    optional: true,
  },
] as const;

/* ── Result screen copy ───────────────────────────────────────────────────── */

export interface FitResultCopy {
  /** Primary CTA label on the result screen. */
  ctaLabel: string;
  /** Subtle reassurance under the CTA. */
  reassurance: string;
}

/**
 * Per-product result CTA framing. The matched product's name/body come straight
 * from productsConfig at render time; this only supplies the action + reassurance.
 * The credit-repair entry routes to the runway (a real path), never an apply gate.
 */
export const FIT_RESULT_COPY: Record<ProductId, FitResultCopy> = {
  "revenue-based": {
    ctaLabel: "Start my application",
    reassurance: "About two minutes to start. No hard credit check, and no obligation.",
  },
  "line-of-credit": {
    ctaLabel: "Start my application",
    reassurance: "A specialist confirms the fit. No obligation, and approval depends on underwriting.",
  },
  heloc: {
    ctaLabel: "Start my application",
    reassurance: "Indicative only — final terms confirm against your equity and title. No obligation.",
  },
  "term-loan": {
    ctaLabel: "Start my application",
    reassurance: "Rates and terms are indicative ranges; final terms depend on underwriting.",
  },
  sba: {
    ctaLabel: "Start my application",
    reassurance: "Bank-funded and slower; approval is the bank's decision. Bridge funding can carry you meanwhile.",
  },
  equipment: {
    ctaLabel: "Start my application",
    reassurance: "A specialist confirms the fit. No obligation, and approval depends on underwriting.",
  },
  bridge: {
    ctaLabel: "Start my application",
    reassurance: "Short-term by design. A specialist confirms the fit. No obligation.",
  },
  "invoice-factoring": {
    ctaLabel: "Start my application",
    reassurance: "A specialist confirms the fit. No obligation, and approval depends on underwriting.",
  },
  "credit-repair": {
    ctaLabel: "See the credit runway",
    reassurance: "Not a loan. No upfront fees, and you can cancel within three business days.",
  },
  "card-processing": {
    ctaLabel: "Talk to a specialist",
    reassurance: "A supportive service for operating merchants, not funding.",
  },
};

/** Generic compliance footnote shown on the result screen. */
export const FIT_RESULT_FOOTNOTE =
  "This is a quick match, not an offer. FundVella is not a lender; a specialist reviews your file and presents options. You may qualify; approval depends on underwriting, and there's no obligation to accept an offer. Revenue-based funding is a purchase of future receivables priced by a factor rate, not an APR; term and SBA loans are real loans that carry an APR.";
