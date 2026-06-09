/**
 * Central type system + the option sets that power the progressive form and the
 * lead-scoring engine. Defining the options once here keeps the form UI and
 * scoring in sync (and gives a future backend a single shape to map from).
 */

import type { AccentName } from "./themes";

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

/* ── Step 1: low-friction qualification ─────────────────────────────────── */

export const REVENUE_OPTIONS = [
  { value: "under_10k", label: "Under $10,000 / mo" },
  { value: "10k_20k", label: "$10,000 to $20,000 / mo" },
  { value: "20k_50k", label: "$20,000 to $50,000 / mo" },
  { value: "50k_150k", label: "$50,000 to $150,000 / mo" },
  { value: "150k_plus", label: "$150,000+ / mo" },
] as const satisfies readonly Option[];

export const TIME_IN_BUSINESS_OPTIONS = [
  { value: "under_3m", label: "Less than 3 months" },
  { value: "3_12m", label: "3 to 12 months" },
  { value: "1_2y", label: "1 to 2 years" },
  { value: "2y_plus", label: "2+ years" },
] as const satisfies readonly Option[];

export const AMOUNT_OPTIONS = [
  { value: "under_25k", label: "Under $25,000" },
  { value: "25k_50k", label: "$25,000 to $50,000" },
  { value: "50k_100k", label: "$50,000 to $100,000" },
  { value: "100k_250k", label: "$100,000 to $250,000" },
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
  { value: "500_1500_wk", label: "$500 to $1,500 / week" },
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

/* ── Deep application: underwriting selects ─────────────────────────────── */

export const ENTITY_TYPE_OPTIONS = [
  { value: "sole_prop", label: "Sole proprietorship" },
  { value: "llc", label: "LLC" },
  { value: "s_corp", label: "S corporation" },
  { value: "c_corp", label: "C corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const satisfies readonly Option[];

export const CREDIT_SCORE_OPTIONS = [
  { value: "720_plus", label: "Excellent (720+)" },
  { value: "680_719", label: "Good (680 to 719)" },
  { value: "640_679", label: "Fair (640 to 679)" },
  { value: "580_639", label: "Building (580 to 639)" },
  { value: "under_580", label: "Under 580" },
  { value: "unsure", label: "Not sure" },
] as const satisfies readonly Option[];

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
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
export type EntityTypeValue = (typeof ENTITY_TYPE_OPTIONS)[number]["value"];
export type CreditScoreValue = (typeof CREDIT_SCORE_OPTIONS)[number]["value"];
export type YesNoValue = (typeof YES_NO_OPTIONS)[number]["value"];

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

/** Metadata for an uploaded document (the binary lives in private storage). */
export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
  /** Object key/path in the private bucket once the signed-URL upload completes. */
  storageKey?: string;
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

  // ── Deep application: business ──────────────────────────────────────────
  businessLegalName?: string;
  businessDba?: string;
  ein?: string; // formatted "12-3456789" — a business identifier, not personal PII
  entityType?: EntityTypeValue;
  natureOfBusiness?: string;
  productService?: string;
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessZip?: string;
  dateOfIncorporation?: string; // ISO yyyy-mm-dd
  ownershipLengthYears?: string;
  capitalRequested?: string; // specific figure the owner types (distinct from the amountNeeded band)
  acceptsCreditCards?: YesNoValue;
  openMcaPositions?: YesNoValue;
  openMcaPositionsCount?: string;

  // ── Deep application: owner ─────────────────────────────────────────────
  ownerFullName?: string;
  ownerDob?: string; // ISO yyyy-mm-dd
  ownerStreet?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerZip?: string;
  ownershipPercent?: string;
  creditScoreBand?: CreditScoreValue;
  // Raw SSN is NEVER stored on LeadData (this shape feeds analytics + CRM). The
  // wizard sends the raw value once over POST; the server tokenizes it and keeps
  // only the last four here. See ApplicationSubmission in lib/application.ts.
  ssnLast4?: string;
  ssnProvided?: boolean;
  ssnDeferred?: boolean; // owner chose to give it to a specialist by phone instead

  // ── Deep application: documents + signature ─────────────────────────────
  bankStatementFiles?: UploadedFileMeta[];
  bankStatementsDeferred?: boolean;
  bankConnected?: boolean; // linked read-only via Plaid instead of uploading
  plaidItemId?: string;
  creditAuthConsent?: boolean;
  esignConsent?: boolean;
  signatureName?: string;
  signedAt?: string; // ISO timestamp set at submit

  // ── Deep application: lifecycle ─────────────────────────────────────────
  applicationId?: string;
  applicationStatus?: "started" | "in_progress" | "submitted";

  // Stress-test extras (rich signal from the interactive questions)
  priorities?: string[]; // full drag-rank order of cash-flow pains
  pollResponses?: Record<string, string>; // raw swipe answers

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

/** "A day in your cash flow" — a short story where money goes out before it comes in. */
export interface DayInCashFlowStep {
  time: string;
  event: string;
}
export interface DayInCashFlow {
  eyebrow: string;
  headline: string;
  intro?: string;
  steps: DayInCashFlowStep[];
  closer?: string;
}

/** Example use with an illustrative dollar range (never an offer or advance amount). */
export interface ExampleUse {
  label: string;
  rangeLow: number;
  rangeHigh: number;
  when?: string;
  note?: string;
}

/** One plain-English glossary term for a trade. */
export interface GlossaryTerm {
  term: string;
  plain: string;
  example?: string;
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

  // ── "Arrived home" per-trade depth (all optional; sections self-hide when absent) ──
  /** "A day in your cash flow" timeline story. */
  dayInCashFlow?: DayInCashFlow;
  /** Concrete example uses with illustrative dollar ranges (clearly not an offer). */
  exampleUses?: ExampleUse[];
  /** Short "this is normal here" lines shown near the form. */
  reassurance?: string[];
  /** One friendly line that speaks to a small local owner. */
  localTouch?: string;
  /** Plain-English glossary of this trade's terms. */
  glossary?: GlossaryTerm[];
  /** Trade-specific "questions owners like you ask" (kept OUT of FAQ JSON-LD). */
  commonQuestions?: FAQItem[];
  /** Optional industry category for the vertical (handy when mapping to a CRM later). */
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

/* ── Resources / articles hub ───────────────────────────────────────────── */

/**
 * One rendered block in an article body. Keeping long-form copy as typed data
 * (mirroring landingPagesConfig.ts) keeps it compliance-reviewable in TS and the
 * renderer a thin server component. Inside `p` text and `ul`/`ol` items you may
 * use inline markdown links: `[anchor text](/path)` — the renderer turns those
 * into internal <Link>s (only same-origin paths starting with "/").
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title?: string; text: string };

export type ArticleKind = "pillar" | "article" | "glossary";

/** A single resource-hub entry (pillar guide, cluster article, or the glossary). */
export interface ResourceArticle {
  slug: string;
  kind: ArticleKind;
  /** Visible H1 (and card title). */
  title: string;
  /** <title> tag — keep ≤ ~60 chars. */
  seoTitle: string;
  /** Meta description — keep ≤ ~155 chars. */
  seoDescription: string;
  /** One-line summary for the hub card + social/OG. */
  excerpt: string;
  /** Topic label shown on cards + the breadcrumb (e.g. "Costs & Terms"). */
  category: string;
  primaryKeyword: string;
  /** Path to the money page this piece funnels to: a vertical path like
   *  "/restaurant-business-funding", or "/" for general small-business funding. */
  moneyPagePath: string;
  /** Related resource slugs (siblings/parent), for the "Keep reading" rail. */
  related?: string[];
  publishedAt: string; // ISO yyyy-mm-dd
  updatedAt?: string; // ISO yyyy-mm-dd
  readingMinutes?: number;
  body: ArticleBlock[];
  /** Rendered as visible Q&A + FAQPage JSON-LD when present. */
  faqs?: FAQItem[];
  /** Glossary terms (only when kind === "glossary"). */
  terms?: GlossaryTerm[];
}
