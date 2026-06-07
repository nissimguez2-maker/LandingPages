/**
 * ════════════════════════════════════════════════════════════════════════════
 *  HubSpot field map — THE ONE FILE TO EDIT IF A PROPERTY NAME CHANGES.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Every HubSpot internal property name lives here. The integration code never
 * hardcodes a property name — it reads from these maps. If HubSpot renames a
 * property, change it here and nowhere else.
 *
 * ✅ All names below were VERIFIED against the live portal (account 148647134)
 *    on 2026-06-06 unless flagged otherwise.
 *
 * ⚠️ Verified naming gotchas (do not "fix" these — they match HubSpot exactly):
 *    - estimated_card_sales__processor_volume   (DOUBLE underscore)
 *    - estimated_current_dailyweekly_payment_burden  (no underscore in "dailyweekly")
 *
 * ❌ Not found in the portal at verification time (left here for completeness,
 *    NOT written by the integration until you create it / correct the name):
 *    - dba_trade_name (company)
 */

/* ── CONTACT properties ─────────────────────────────────────────────────── */
export const CONTACT = {
  firstName: "firstname",
  lastName: "lastname",
  email: "email",
  phone: "phone",
  leadSource: "lead_source", // enum: website | referral | social_media | event
  fundingReadinessScore: "funding_readiness_score", // number
  leadCategory: "lead_category", // enum: hot | warm | cold
  leadUrgency: "lead_urgency", // enum: high | medium | low
  originalLandingPageUrl: "original_landing_page_url",
  formCompletionPercentage: "form_completion_percentage", // number
  missingInformation: "missing_information",
  nextFollowupDate: "next_followup_date", // date (ms epoch)
  lastFollowupDate: "last_followup_date", // date
  preferredContactTime: "preferred_contact_time", // free text
  preferredCommunicationChannel: "preferred_communication_channel", // enum: email | phone | social_media | in_person
  contactEngagementScore: "contact_engagement_score", // number
  marketingConsentStatus: "marketing_consent_status", // enum: opted_in | opted_out
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmTerm: "utm_term",
  // ── Lifecycle (optional). Create these in HubSpot to power nurture/win-back
  //    workflows. If a property doesn't exist yet, the integration silently
  //    drops it (see safe-retry in hubspot.ts) — it will NOT break submissions.
  capturedAt: "captured_at", // datetime
  leadCaptureStage: "lead_capture_stage", // e.g. full_submission | partial
  lastFormActivityDate: "last_form_activity_date", // datetime
  consentTimestamp: "consent_timestamp", // datetime
  consentSourcePage: "consent_source_page", // text
} as const;

/* ── COMPANY properties ─────────────────────────────────────────────────── */
export const COMPANY = {
  name: "name",
  businessLegalName: "business_legal_name",
  dbaTradeName: "dba_trade_name", // ❌ not found at verification — create or correct before use
  website: "website",
  domain: "domain", // HubSpot dedupe key
  industry: "industry",
  industryFocus: "industry_focus", // enum: technology | healthcare | finance | retail
  state: "state",
  businessAddress: "business_address",
  numberOfEmployees: "numberofemployees",
  monthlyGrossRevenue: "monthly_gross_revenue", // number
  averageMonthlyDeposits: "average_monthly_deposits", // number
  estimatedCardSalesProcessorVolume: "estimated_card_sales__processor_volume", // ⚠ double underscore
  timeInBusiness: "time_in_business", // number (YEARS)
  businessBankAccountConfirmed: "business_bank_account_confirmed", // bool
  canProvide34MonthsBankStatements: "can_provide_34_months_bank_statements", // bool
  recentNsfsOrNegativeDays: "recent_nsfs_or_negative_days", // bool
  existingMcaOrBusinessLoans: "existing_mca_or_business_loans", // bool
  numberOfExistingAdvances: "number_of_existing_advances", // number
  estimatedCurrentDailyWeeklyPaymentBurden: "estimated_current_dailyweekly_payment_burden", // ⚠ no underscore in dailyweekly
  currentFunderName: "current_funder_name",
  currentBalanceOwed: "current_balance_owed", // number
  useOfFunds: "use_of_funds", // free text
  amountRequested: "amount_requested", // number
  documentsReceived: "documents_received", // bool
  bankStatementsReceived: "bank_statements_received", // bool
  voidedCheckReceived: "voided_check_received", // bool
  ownerIdReceived: "owner_id_received", // bool
  applicationReceived: "application_received", // bool
  payoffLettersReceived: "payoff_letters_received", // bool
} as const;

/* ── DEAL properties ────────────────────────────────────────────────────── */
export const DEAL = {
  dealname: "dealname",
  amount: "amount",
  amountRequested: "amount_requested", // number
  estimatedFundedAmount: "estimated_funded_amount",
  finalFundedAmount: "final_funded_amount",
  productType: "product_type", // enum: loan | merchant_cash_advance | line_of_credit
  dealStatus: "deal_status", // enum: in_progress | funded | declined
  dealStage: "dealstage", // pipeline stage (see PIPELINE below)
  pipeline: "pipeline",
  fundingReadinessScore: "funding_readiness_score", // number
  leadCategory: "lead_category", // enum: hot | warm | cold
  monthlyRevenueVerified: "monthly_revenue_verified",
  bankStatementReviewStatus: "bank_statement_review_status", // enum: pending | reviewed | rejected
  underwritingStatus: "underwriting_status", // enum: pending | approved | declined
  offerAmount: "offer_amount",
  factorRate: "factor_rate",
  totalPayback: "total_payback",
  paymentFrequency: "payment_frequency", // enum: daily | weekly | monthly
  estimatedPaymentAmount: "estimated_payment_amount",
  termNumberOfPayments: "term_number_of_payments",
  existingDebtIssue: "existing_debt_issue",
  riskFlags: "risk_flags",
  declineReason: "decline_reason",
  lostReason: "lost_reason",
  contractsSentDate: "contracts_sent_date",
  contractsSignedDate: "contracts_signed_date",
  stipulationsNeeded: "stipulations_needed",
  stipulationsCleared: "stipulations_cleared",
  fundingDate: "funding_date",
  renewalEligibleDate: "renewal_eligible_date",
  renewalStatus: "renewal_status", // enum: eligible | not_eligible | pending_review
} as const;

/* ── TICKET properties (reserved for support handoff, not used at capture) ── */
export const TICKET = {
  subject: "subject",
  issueType: "issue_type",
  ticketUrgency: "ticket_urgency",
  resolutionTimeEstimate: "resolution_time_estimate",
  pipelineStage: "hs_pipeline_stage",
} as const;

/* ════════════════════════════════════════════════════════════════════════
 *  VALUE MAPS — internal form values -> exact HubSpot enum option values.
 * ════════════════════════════════════════════════════════════════════════ */

/** Internal Green/Yellow/Red band -> lead_category option (hot/warm/cold). */
export const LEAD_CATEGORY_VALUE = {
  green: "hot",
  yellow: "warm",
  red: "cold",
} as const;

/** Form urgency -> lead_urgency option (high/medium/low). */
export const URGENCY_VALUE: Record<string, "high" | "medium" | "low"> = {
  immediately: "high",
  this_week: "high",
  this_month: "medium",
  exploring: "low",
};

/**
 * Form channel -> preferred_communication_channel option.
 * HubSpot has no "text/SMS" option, so "text" maps to phone and we also append
 * "(prefers text)" to preferred_contact_time so the nuance is never lost.
 */
export const CHANNEL_VALUE: Record<string, "email" | "phone" | "social_media" | "in_person"> = {
  phone: "phone",
  email: "email",
  text: "phone",
};

/** Representative numeric value (USD/mo) for monthly_gross_revenue. */
export const REVENUE_NUMERIC: Record<string, number> = {
  under_10k: 7500,
  "10k_20k": 17500, // band midpoint (was 15000 — the bottom of the band)
  "20k_50k": 35000,
  "50k_150k": 100000,
  "150k_plus": 200000,
};

/** Representative time_in_business in YEARS. */
export const TIB_YEARS: Record<string, number> = {
  under_3m: 0.25,
  "3_12m": 0.75,
  "1_2y": 1.5,
  "2y_plus": 3,
};

/** Representative requested amount (USD) for amount_requested / deal amount. */
export const AMOUNT_NUMERIC: Record<string, number> = {
  under_25k: 15000,
  "25k_50k": 37500,
  "50k_100k": 75000,
  "100k_250k": 175000,
  "250k_plus": 300000,
};

/** Representative weekly payment burden (USD). */
export const PAYMENT_BURDEN_NUMERIC: Record<string, number> = {
  none: 0,
  under_500_wk: 300,
  "500_1500_wk": 1000,
  "1500_plus_wk": 2000,
};

/** Existing-debt answer -> count for number_of_existing_advances. */
export const ADVANCES_COUNT: Record<string, number> = {
  none: 0,
  one: 1,
  multiple: 3,
};

/* ════════════════════════════════════════════════════════════════════════
 *  PIPELINE — overridable via env. The 18-stage MCA pipeline is LIVE: the
 *  account's single deal pipeline (id "default") was repurposed with the 18
 *  stages below. Stage ids are real values from the portal (2026-06).
 * ════════════════════════════════════════════════════════════════════════ */
export const PIPELINE = {
  id: process.env.HUBSPOT_DEAL_PIPELINE_ID || "default",
  /** Stage a brand-new full-submission deal lands in ("New Lead"). */
  defaultStageId: process.env.HUBSPOT_DEAL_DEFAULT_STAGE_ID || "5498908918",
  /** Default product for these MCA acquisition funnels. */
  defaultProductType: "merchant_cash_advance" as const,
};

/**
 * The 18 funding-pipeline stages you should create in HubSpot (label -> the
 * internal id you'll paste back here once created). Used for documentation and
 * so routing logic can reference stable keys.
 */
export const MCA_PIPELINE_STAGES = {
  new_lead: "5498908918",
  prequalification_needed: "5498908919",
  prequalified_green: "5498908920",
  prequalified_yellow: "5498854606",
  documents_requested: "5498908921",
  documents_received: "5498854607",
  statement_review: "5498854608",
  submitted_to_underwriting: "5498909882",
  offer_received: "5498854609",
  offer_presented: "5498909883",
  contracts_sent: "5498909884",
  contracts_signed: "5498854610",
  closing_stips: "5498854611",
  funded: "5498909885",
  declined: "5498909886",
  lost_not_interested: "5498909887",
  nurture: "5498909888",
  renewal_opportunity: "5498854612",
} as const;
