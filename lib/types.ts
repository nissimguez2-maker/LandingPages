/**
 * Central type system + the option sets that power the progressive form,
 * the lead-scoring engine, and the HubSpot mapping. Defining options once here
 * keeps the form UI, scoring, and CRM mapping perfectly in sync.
 */

import type { AccentName } from "./themes";

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

/* ── Step 1: low-friction qualification ─────────────────────────────────── */

export const REVENUE_OPTIONS = [
  { value: "under_10k", label: "Under $10,000 / mo" },
  { value: "10k_20k", label: "$10,000 – $20,000 / mo" },
  { value: "20k_50k", label: "$20,000 – $50,000 / mo" },
  { value: "50k_150k", label: "$50,000 – $150,000 / mo" },
  { value: "150k_plus", label: "$150,000+ / mo" },
] as const satisfies readonly Option[];

export const TIME_IN_BUSINESS_OPTIONS = [
  { value: "under_3m", label: "Less than 3 months" },
  { value: "3_12m", label: "3 – 12 months" },
  { value: "1_2y", label: "1 – 2 years" },
  { value: "2y_plus", label: "2+ years" },
] as const satisfies readonly Option[];

export const AMOUNT_OPTIONS = [
  { value: "under_25k", label: "Under $25,000" },
  { value: "25k_50k", label: "$25,000 – $50,000" },
  { value: "50k_100k", label: "$50,000 – $100,000" },
  { value: "100k_250k", label: "$100,000 – $250,000" },
  { value: "250k_plus", label: "$250,000+" },
] as const satisfies readonly Option[];

export const URGENCY_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "exploring", label: "Just exploring" },
] as const satisfies readonly Option[];

/* ── Step 2: risk / underwriting fit ────────────────────────────────────── */

export const EXISTING_DEBT_OPTIONS = [
  { value: "none", label: "No current advances or loans" },
  { value: "one", label: "One advance / loan" },
  { value: "multiple", label: "Multiple advances / loans" },
  { value: "not_sure", label: "Prefer to discuss" },
] as const satisfies readonly Option[];

export const PAYMENT_BURDEN_OPTIONS = [
  { value: "none", label: "No current payments" },
  { value: "under_500_wk", label: "Under $500 / week" },
  { value: "500_1500_wk", label: "$500 – $1,500 / week" },
  { value: "1500_plus_wk", label: "$1,500+ / week" },
  { value: "not_sure", label: "Not sure" },
] as const satisfies readonly Option[];

export const NSF_OPTIONS = [
  { value: "none", label: "None recently" },
  { value: "a_few", label: "A few" },
  { value: "several", label: "Several" },
  { value: "not_sure", label: "Not sure" },
] as const satisfies readonly Option[];

export const USE_OF_FUNDS_OPTIONS = [
  { value: "inventory", label: "Inventory / supplies" },
  { value: "equipment", label: "Equipment" },
  { value: "payroll", label: "Payroll" },
  { value: "expansion", label: "Expansion / new location" },
  { value: "marketing", label: "Marketing / growth" },
  { value: "working_capital", label: "General working capital" },
  { value: "debt_refinance", label: "Refinance existing debt" },
  { value: "other", label: "Other" },
] as const satisfies readonly Option[];

export const BANK_STATEMENTS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Prefer to discuss" },
] as const satisfies readonly Option[];

/* ── Step 3: contact capture ────────────────────────────────────────────── */

export const CONTACT_TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "anytime", label: "Anytime" },
] as const satisfies readonly Option[];

export const CHANNEL_OPTIONS = [
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
  { value: "text", label: "Text message" },
] as const satisfies readonly Option[];

/* ── Derived value unions ───────────────────────────────────────────────── */

export type RevenueValue = (typeof REVENUE_OPTIONS)[number]["value"];
export type TimeInBusinessValue = (typeof TIME_IN_BUSINESS_OPTIONS)[number]["value"];
export type AmountValue = (typeof AMOUNT_OPTIONS)[number]["value"];
export type UrgencyValue = (typeof URGENCY_OPTIONS)[number]["value"];
export type ExistingDebtValue = (typeof EXISTING_DEBT_OPTIONS)[number]["value"];
export type PaymentBurdenValue = (typeof PAYMENT_BURDEN_OPTIONS)[number]["value"];
export type NsfValue = (typeof NSF_OPTIONS)[number]["value"];
export type UseOfFundsValue = (typeof USE_OF_FUNDS_OPTIONS)[number]["value"];
export type BankStatementsValue = (typeof BANK_STATEMENTS_OPTIONS)[number]["value"];
export type ContactTimeValue = (typeof CONTACT_TIME_OPTIONS)[number]["value"];
export type ChannelValue = (typeof CHANNEL_OPTIONS)[number]["value"];

/* ── UTM + lead data ────────────────────────────────────────────────────── */

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export type LeadBand = "green" | "yellow" | "red";

export interface LeadScore {
  score: number;
  band: LeadBand;
  reasons: string[];
}

/**
 * The full lead payload. All qualification fields are optional so partial leads
 * can be saved at any point in the flow.
 */
export interface LeadData {
  // Step 1
  industry?: string; // vertical slug, set automatically by the page
  monthlyRevenue?: RevenueValue;
  timeInBusiness?: TimeInBusinessValue;
  amountNeeded?: AmountValue;
  urgency?: UrgencyValue;

  // Step 2
  existingDebt?: ExistingDebtValue;
  paymentBurden?: PaymentBurdenValue;
  recentNsfs?: NsfValue;
  useOfFunds?: UseOfFundsValue;
  canProvideBankStatements?: BankStatementsValue;

  // Step 3 — contact
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  email?: string;
  state?: string;
  preferredContactTime?: ContactTimeValue;
  preferredChannel?: ChannelValue;
  marketingConsent?: boolean;

  // Step 4 — optional deeper info
  website?: string;
  currentFunderName?: string;
  currentBalanceOwed?: string;
  notes?: string;

  // Meta / attribution (filled automatically)
  verticalTitle?: string;
  sourcePage?: string;
  utm?: UtmData;
  formCompletionPercentage?: number;
  missingInformation?: string[];
  partial?: boolean;
}

/* ── Landing-page content config ────────────────────────────────────────── */

export interface FAQItem {
  question: string;
  /** Canonical, complete-sentence answer. Used for visible copy AND FAQ JSON-LD. */
  answer: string;
  /** Optional scannable bullets shown in the UI only (never in JSON-LD). */
  bullets?: string[];
}

/** A media slot. `src` empty/undefined → MediaFigure renders a branded placeholder. */
export interface MediaAsset {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Compliant, factual trust signal (NOT a fabricated stat). */
export interface TrustSignal {
  icon: "lock" | "shield" | "user-check" | "eye" | "scale" | "clock";
  title: string;
  description: string;
}

/** Real testimonial — only populated with owner-provided, truthful data. */
export interface Testimonial {
  quote: string;
  attribution: string;
  detail?: string;
}

/** Real stat — only populated with owner-provided, truthful data. */
export interface Stat {
  value: string;
  label: string;
}

/** Funding-estimate calculator config. Produces an ESTIMATE RANGE, never an offer. */
export interface CalculatorConfig {
  lowFactor: number;
  highFactor: number;
  minMonthly: number;
  maxMonthly: number;
  /** Advance sizing: estimated advance ≈ monthly deposits × this multiple. */
  advanceMultipleLow?: number;
  advanceMultipleHigh?: number;
  /** Illustrative cost-of-capital band (factor rate, e.g. 1.15–1.49). */
  factorRateLow?: number;
  factorRateHigh?: number;
  /** Illustrative remittance as a share of deposits (e.g. 0.08–0.20). */
  holdbackLow?: number;
  holdbackHigh?: number;
  /** Illustrative term in months, for the estimated payment math. */
  termMonthsLow?: number;
  termMonthsHigh?: number;
}

export interface FitRow {
  label: string;
  goodFit: string;
  mayNeedReview: string;
}

export interface UseCase {
  title: string;
  description: string;
}

/** One "you know this feeling → here's the position capital puts you in" pairing. */
export interface PainReliefItem {
  /** Recognition: their reality, present tense, NO funding mentioned. Ends on the pinch. */
  pain: string;
  /** Relief: the same moment with capital in place — a POSITION, never a promised outcome. */
  relief: string;
  /** Optional icon key from components/icons/Icon.tsx. */
  icon?: string;
}

/** "Sound familiar?" recognition block, rendered before the stress test. */
export interface PainReliefSection {
  eyebrow: string;
  headline: string;
  intro: string;
  items: PainReliefItem[];
  closer: string;
}

/** A funding option a specialist can match the merchant to (MCA-led). */
export interface OfferingProduct {
  name: string;
  /** One-line "best when…" trigger. */
  bestWhen: string;
  body: string;
  icon?: string;
  /** Exactly one product is the hero (MCA). */
  hero?: boolean;
}

export interface OfferingsSection {
  eyebrow: string;
  headline: string;
  intro: string;
  products: OfferingProduct[];
  footnote: string;
}

export interface VerticalConfig {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  /** Short, scannable proof points shown in the hero trust bar. */
  heroHighlights: string[];
  useCases: UseCase[];
  /** Plain-language notes about what underwriting tends to look at for this vertical. */
  qualificationNotes: string[];
  goodFitCriteria: string[];
  reviewCriteria: string[];
  fitTable: FitRow[];
  faqs: FAQItem[];
  cta: {
    primary: string;
    /** Optional — most pages now use a single canonical CTA. */
    secondary?: string;
  };

  // ── Visual identity (optional; defaults to emerald) ──
  /** Per-vertical accent color. Drives hero tint, CTAs, meters, icon chips. */
  theme?: { accent: AccentName };

  // ── Narrative depth (optional) ──
  /** Visceral, vertical-specific cash-flow pain hook (shown in the hero). */
  cashFlowSignature?: string;
  /** Per-vertical "what we look at" cards (overrides the shared WHAT_WE_LOOK_AT). */
  qualificationFocus?: { title: string; description: string }[];
  /** Calculator subhead in the merchant's own language. */
  calcContext?: string;
  /** Three short, scannable points for the hero readiness card. */
  heroCardPoints?: string[];
  /** "Sound familiar?" pain → relief recognition block (renders before the stress test). */
  painRelief?: PainReliefSection;
  /** Maps to HubSpot company industry_focus when it fits one of HubSpot's options. */
  industryFocus?: "technology" | "healthcare" | "finance" | "retail";
  /** Free-text tag stored for segmentation / future campaign routing. */
  campaignTag: string;

  // ── Narrative (optional) ──
  /** One-line, vertical-specific pain framing shown lightly before reassurance. */
  painPoint?: string;

  // ── Imagery slots (render placeholder until real `src` provided) ──
  heroImage?: MediaAsset;
  /** Icon keys aligned to useCases[] order; falls back to numbered badges. */
  useCaseIcons?: string[];

  // ── Social proof slots (render ONLY when populated with REAL data) ──
  testimonials?: Testimonial[];
  stats?: Stat[];
  logos?: MediaAsset[];

  // ── Optional per-vertical calculator override ──
  calculator?: Partial<CalculatorConfig>;
}
