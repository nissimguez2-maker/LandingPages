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
  { value: "renovation", label: "Renovation / build-out" },
  { value: "marketing", label: "Marketing / growth" },
  { value: "working_capital", label: "General working capital" },
  { value: "debt_refinance", label: "Refinance existing debt" },
  { value: "tax_payroll", label: "Taxes / payroll" },
  { value: "seasonal", label: "Seasonal / bridge gap" },
  { value: "other", label: "Other" },
] as const satisfies readonly Option[];

export const BANK_STATEMENTS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Prefer to discuss" },
] as const satisfies readonly Option[];

/**
 * Seed list for the "What your business does" Combobox. Grouped to match the
 * site's 16 verticals plus the common MCA trades a specialist sees. Stored as a
 * FREE-TEXT string on LeadData.natureOfBusiness — the owner may type anything;
 * these are only suggestions to speed selection. Labels are plain trade names a
 * merchant recognizes, never internal jargon.
 */
export interface OptionGroup {
  group: string;
  options: readonly string[];
}

export const NATURE_OF_BUSINESS_OPTIONS: readonly OptionGroup[] = [
  {
    group: "Food & hospitality",
    options: [
      "Restaurant",
      "Bar / nightclub",
      "Café / coffee shop",
      "Bakery",
      "Food truck",
      "Catering",
    ],
  },
  {
    group: "Trucking & transportation",
    options: [
      "Trucking / freight carrier",
      "Owner-operator (trucking)",
      "Courier / last-mile delivery",
      "Moving company",
      "Logistics / dispatch",
    ],
  },
  {
    group: "Construction & trades",
    options: [
      "General contractor",
      "Roofing",
      "Concrete / masonry",
      "Electrician",
      "HVAC",
      "Plumbing",
      "Painting",
      "Flooring",
    ],
  },
  {
    group: "Auto & equipment",
    options: ["Auto repair shop", "Body / collision shop", "Tire shop", "Car wash", "Equipment rental"],
  },
  {
    group: "Health & medical",
    options: [
      "Medical practice",
      "Dental practice",
      "Chiropractic",
      "Physical therapy",
      "Veterinary clinic",
      "Home health care",
      "Pharmacy",
    ],
  },
  {
    group: "Beauty & wellness",
    options: ["Hair / nail salon", "Barbershop", "Med spa / aesthetics", "Gym / fitness studio", "Yoga / Pilates studio"],
  },
  {
    group: "Retail & e-commerce",
    options: [
      "Retail store / boutique",
      "Convenience store",
      "Liquor store",
      "Grocery / market",
      "E-commerce / online seller",
      "Gas station",
    ],
  },
  {
    group: "Home & property services",
    options: ["Cleaning / janitorial", "Landscaping / lawn care", "Tree service", "Pest control", "Property management"],
  },
  {
    group: "Professional & business services",
    options: [
      "Law firm / legal services",
      "Accounting / bookkeeping",
      "Marketing / advertising agency",
      "Consulting",
      "Staffing / recruiting",
      "Real estate / brokerage",
      "Insurance agency",
    ],
  },
  {
    group: "Manufacturing & wholesale",
    options: ["Manufacturing", "Wholesale / distribution", "Printing / signage"],
  },
  {
    group: "Other",
    options: ["Daycare / childcare", "Event / entertainment", "Nonprofit", "Other"],
  },
];

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

/* ── US States ──────────────────────────────────────────────────────────── */

export const US_STATES: readonly Option[] = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
] as const;

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
  /**
   * Use of funds.
   *
   * The prequal (Cash-Flow Stress Test / Find-your-fit) captures a SINGLE
   * use-of-funds and writes it here — that single value also feeds the protected
   * lead-scoring engine (`PRODUCTIVE_USES.has(lead.useOfFunds)`) and the protected
   * stress-test prefill bridge, both of which require a single string. The deep
   * /apply form instead lets the owner pick MANY uses; that multi-select lives in
   * `useOfFundsList` (below). At apply hydration the seeded single value is folded
   * into `useOfFundsList` so the owner sees their prequal choice pre-selected, and
   * at submit the first selected list value is mirrored back here so scoring and
   * automations that read the scalar keep working. Treat `useOfFundsList` as the
   * source of truth on the apply form.
   */
  useOfFunds?: UseOfFundsValue;
  /** Deep-apply multi-select use of funds (array). Source of truth on /apply. */
  useOfFundsList?: UseOfFundsValue[];
  /** Free text shown when "other" is among the selected uses of funds. */
  useOfFundsOther?: string;
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
  notes?: string;

  // ── Deep application: business ──────────────────────────────────────────
  businessLegalName?: string;
  businessDba?: string;
  ein?: string; // formatted "12-3456789" — a business identifier, not personal PII
  entityType?: EntityTypeValue;
  natureOfBusiness?: string; // free text; seeded by NATURE_OF_BUSINESS_OPTIONS
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessZip?: string;
  dateOfIncorporation?: string; // ISO yyyy-mm-dd
  capitalRequested?: string; // specific figure the owner types (distinct from the amountNeeded band)
  acceptsCreditCards?: YesNoValue;
  openMcaPositions?: YesNoValue;
  openMcaPositionsCount?: string;

  // ── Deep application: owner ─────────────────────────────────────────────
  ownerFullName?: string;
  ownerDob?: string; // ISO yyyy-mm-dd
  /** When true, owner home address equals the business address (copied at submit;
   *  owner address fields are hidden in the UI). Default-checked for sole props. */
  ownerAddressSameAsBusiness?: boolean;
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
  // Optional core-file documents (§3): a voided business check and an owner ID.
  // Both are deferrable — they NEVER gate submission; a specialist can collect
  // them later. Same deferred/no-gate pattern as bank statements.
  voidedCheckFiles?: UploadedFileMeta[];
  voidedCheckDeferred?: boolean;
  ownerIdFiles?: UploadedFileMeta[];
  ownerIdDeferred?: boolean;
  creditAuthConsent?: boolean;
  esignConsent?: boolean;
  signatureName?: string;
  signedAt?: string; // ISO timestamp set at submit

  // ── Find-your-fit router (Phase 3) ──────────────────────────────────────
  /** Owner reports real-estate equity (drives the HELOC branch). Non-PII flag. */
  ownsRealEstateEquity?: boolean;
  /** Owner reports cash stuck in unpaid invoices/receivables (factoring branch). */
  hasUnpaidInvoices?: boolean;
  /** Product the fit router matched the owner to, for handoff + segmentation. */
  recommendedProduct?: ProductId;

  // ── Deep application: lifecycle ─────────────────────────────────────────
  applicationId?: string;
  applicationStatus?: "started" | "in_progress" | "submitted";

  // Stress-test extras (rich signal from the interactive questions)
  priorities?: string[]; // full drag-rank order of cash-flow pains
  pollResponses?: Record<string, string>; // raw swipe answers

  // Meta / attribution (filled automatically)
  leadBrand?: string; // which stream this lead belongs to (FundVella | FinBiz | …)
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

/* ── Product catalog (the §1 product matrix as typed data) ──────────────────
 * Single source of truth for the funding options FundVella surfaces. The
 * homepage OFFERINGS array and /products page both derive from PRODUCTS so the
 * matrix lives in one place. Compliance framing (factor rate vs. APR, CROA
 * rails) is carried per-product. See docs/product-matrix.md §1 + §5. */

export type ProductId =
  | "revenue-based"
  | "line-of-credit"
  | "heloc"
  | "term-loan"
  | "sba"
  | "equipment"
  | "bridge"
  | "invoice-factoring"
  | "credit-repair"
  | "card-processing";

export interface Product {
  id: ProductId;
  name: string;
  /** URL/anchor-safe slug (also used as a stable key). */
  slug: string;
  /** funding = a capital option; path = a route back to fundable (credit repair);
   *  service = a supportive merchant service (card processing). */
  category: "funding" | "path" | "service";
  /** Exactly one funding product is primary (revenue-based). Maps to OfferingProduct.hero. */
  isPrimary?: boolean;
  /** How cost is expressed. factor-rate → total payback (never "APR"); apr is
   *  correct for real loans (term/SBA); fee for service; n-a where not applicable. */
  costModel: "factor-rate" | "apr" | "fee" | "n-a";
  /** Icon key from components/icons/Icon.tsx (valid set only). */
  icon: string;
  /** One-line "best when…" trigger. */
  bestWhen: string;
  /** Who the product fits (profile language from §1/§2). */
  whoItFits: string;
  /** Main descriptive paragraph (compliance-correct). */
  body: string;
  /** Short, scannable framing facts from §1 (ranges/terms/how it works — never a promised number). */
  framingFacts: string[];
  /** Optional explicit compliance note (e.g. factor-rate vs APR, CROA rails). */
  complianceNote?: string;
  /** Related vertical slugs, for future cross-linking. */
  relatedVerticals?: string[];
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
  /** Best-fit funding product for this trade (drives the "Often the best fit" callout). */
  primaryProduct?: ProductId;
  /** A common alternative product surfaced alongside the primary fit. */
  secondaryProduct?: ProductId;
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
