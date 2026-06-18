/**
 * Pure routing engine for the "Find your fit" path (no React, no window).
 *
 * This ROUTES a profile to the funding option that fits how the business earns —
 * it does NOT score risk or quote a number (that is the stress test + underwriting).
 * It encodes docs/product-matrix.md §2 (fit philosophy) + §3 (the qualify floor).
 *
 * Compliance (see §5): copy here never promises approval, a rate, or a number, and
 * keeps the revenue-based vs. real-loan distinction (factor rate vs. APR). The
 * "not-yet" branch routes to a REAL path (credit runway), never a dead end.
 *
 * Mirrors the lib/stressTest.ts style: small pure functions, readable switch
 * logic, unit-safe defaults, and a buildPrefill bridge for the handoff.
 */

import type {
  ProductId,
  RevenueValue,
  TimeInBusinessValue,
  UseOfFundsValue,
  CreditScoreValue,
  LeadData,
} from "./types";

export interface FitAnswers {
  useOfFunds?: UseOfFundsValue;
  monthlyRevenue?: RevenueValue;
  timeInBusiness?: TimeInBusinessValue;
  creditBand?: CreditScoreValue;
  /** "Do you own real estate with equity?" — drives the HELOC branch. */
  ownsRealEstateEquity?: boolean;
  /** "Is cash stuck in unpaid invoices?" — drives the invoice-factoring branch. */
  hasUnpaidInvoices?: boolean;
  /** Whether the need keeps coming back (recurring) vs. one-time. */
  recurringNeed?: boolean;
  /** Owner explicitly wants the largest/longest option and can wait. */
  patientLargeNeed?: boolean;
}

export interface FitResult {
  productId: ProductId;
  /** Short, compliant headline for the result screen. */
  headline: string;
  /** One or two sentences on WHY this fits — never a promise or a number. */
  why: string;
  /** Where the primary CTA sends the owner. */
  ctaRoute: string;
}

/* ── Floor + signal helpers (§3) ──────────────────────────────────────────── */

/** §3 floor: ~$15K+/mo. Bands below $20K that aren't clearly above the floor are
 *  treated as below it (the under-$10K and $10K–$20K bands straddle/are under). */
function belowRevenueFloor(rev?: RevenueValue): boolean {
  return rev === "under_10k" || rev === "10k_20k";
}

/** §3 floor: 6+ months in business. */
function belowTimeFloor(tib?: TimeInBusinessValue): boolean {
  return tib === "under_3m";
}

/** §3 floor: 500+ FICO. The "Under 580" band can dip below 500 — credit-flexible
 *  but a sub-500 file leads with the credit runway. "Building (580–639)" clears it. */
function belowCreditFloor(band?: CreditScoreValue): boolean {
  return band === "under_580";
}

/** Strong, steady deposits: $20K+/mo. Drives the revenue-based / LOC branch. */
function strongDeposits(rev?: RevenueValue): boolean {
  return rev === "20k_50k" || rev === "50k_150k" || rev === "150k_plus";
}

/** Seasoned enough for the steady-cash-flow products (6+ mo → "3_12m" and up). */
function seasoned(tib?: TimeInBusinessValue): boolean {
  return tib === "3_12m" || tib === "1_2y" || tib === "2y_plus";
}

/** 650+ FICO band (the HELOC / strong-credit gate). Our bands map 640–679 as the
 *  lowest "650-ish" tier; 680+ is unambiguous. We treat 640+ as the strong-credit
 *  threshold, requiring real-estate equity for the HELOC lead either way. */
function strongCredit(band?: CreditScoreValue): boolean {
  return band === "640_679" || band === "680_719" || band === "720_plus";
}

/** Top-tier credit for the SBA last-resort branch. */
function topCredit(band?: CreditScoreValue): boolean {
  return band === "720_plus";
}

/* ── The router (§2 fit philosophy, ordered) ──────────────────────────────── */

/**
 * routeFit — pure. Ordered so the most specific / highest-value matches win first,
 * with the §3 floor checked up front so we never push capital at a file that should
 * lead with the runway. Always returns a real path.
 */
export function routeFit(a: FitAnswers): FitResult {
  // 0) Below the §3 floor → the not-yet path (credit runway), never a dead end.
  if (belowCreditFloor(a.creditBand) || belowRevenueFloor(a.monthlyRevenue) || belowTimeFloor(a.timeInBusiness)) {
    return {
      productId: "credit-repair",
      headline: "Let's get you fundable first",
      why: "Based on what you shared, the strongest move right now is building the file up so funding can follow. A not-yet is not a no — there's a clear path back, and we can revisit once you're in a stronger position.",
      ctaRoute: "/credit-runway",
    };
  }

  // 1) Strong credit + real-estate equity → HELOC (lead with speed; §2).
  if (strongCredit(a.creditBand) && a.ownsRealEstateEquity) {
    return {
      productId: "heloc",
      headline: "A HELOC could be your fastest route",
      why: "With strong credit and equity in your real estate, a line against that equity is often the fastest, lightest option — frequently funded within a day, with an indicative number up front and final terms confirmed against your equity and title.",
      ctaRoute: "/apply/business-funding",
    };
  }

  // 2) Cash stuck in unpaid invoices/receivables → invoice factoring.
  if (a.hasUnpaidInvoices) {
    return {
      productId: "invoice-factoring",
      headline: "Turn your invoices into cash now",
      why: "When the money you're owed is the bottleneck, factoring advances cash against those receivables instead of making you wait on net-30 or net-60 — funding moves at the speed of your invoices.",
      ctaRoute: "/apply/business-funding",
    };
  }

  // 3) Buying equipment → equipment financing (the equipment is the collateral).
  if (a.useOfFunds === "equipment") {
    return {
      productId: "equipment",
      headline: "Equipment financing fits this purchase",
      why: "Because the equipment itself is the collateral, it's often easier to qualify for — and you keep your other cash free for day-to-day operations. Possible write-offs may apply; confirm with a CPA.",
      ctaRoute: "/apply/business-funding",
    };
  }

  // 4) Strong, steady deposits, credit-flexible → revenue-based (or LOC if recurring).
  if (strongDeposits(a.monthlyRevenue) && seasoned(a.timeInBusiness)) {
    if (a.recurringNeed) {
      return {
        productId: "line-of-credit",
        headline: "A line of credit fits a recurring need",
        why: "When the need keeps coming back rather than being one-time, a revolving line lets you draw when you need it and pay down when you don't, so you only pay for what you draw.",
        ctaRoute: "/apply/business-funding",
      };
    }
    return {
      productId: "revenue-based",
      headline: "Revenue-based funding fits how you earn",
      why: "Your steady deposits do the heavy lifting here, so credit matters less. It's a purchase of a set amount of future receivables — not a loan — priced by a factor rate that fixes one total payback up front, with remittance that flexes with a slower week. Speed is the draw.",
      ctaRoute: "/apply/business-funding",
    };
  }

  // 5) Strong credit + a predictable one-time need (no equity) → term loan,
  //    or SBA only for a top profile that is explicitly patient + large (last resort).
  if (strongCredit(a.creditBand)) {
    if (topCredit(a.creditBand) && a.patientLargeNeed) {
      return {
        productId: "sba",
        headline: "An SBA loan suits a patient, larger plan",
        why: "For a top profile that can wait, an SBA loan offers the longest terms. It's a real, bank-funded loan (so an APR applies), it requires tax returns, and it's slower — bridge funding can carry you while it processes.",
        ctaRoute: "/apply/business-funding",
      };
    }
    return {
      productId: "term-loan",
      headline: "A term loan fits a predictable need",
      why: "With stronger credit and a one-time, predictable need, a term loan gives you a fixed payment over a set term. Because it's a real loan, an APR is the right measure here, and there's no prepayment penalty.",
      ctaRoute: "/apply/business-funding",
    };
  }

  // 6) Default for a qualifying file we couldn't slot more specifically →
  //    revenue-based working capital, the primary, credit-flexible option (§2).
  return {
    productId: "revenue-based",
    headline: "Revenue-based funding is a strong starting point",
    why: "It's reviewed on your revenue and bank activity, not credit alone. It's a purchase of future receivables — not a loan — priced by a factor rate that sets one total payback up front, with remittance that flexes with your deposits. A specialist can confirm the best fit for your file.",
    ctaRoute: "/apply/business-funding",
  };
}

/* ── Prefill bridge for the handoff (client reads this on /apply) ──────────── */

/**
 * Build the partial LeadData the /apply wizard reads from sessionStorage, threading
 * the router's recommendation + the new fit flags. Mirrors stressTest.buildPrefill.
 */
export function buildFitPrefill(
  a: FitAnswers,
  result: FitResult,
  slug: string,
  contact?: Partial<LeadData>,
): Partial<LeadData> {
  return {
    industry: slug,
    ...(a.useOfFunds ? { useOfFunds: a.useOfFunds } : {}),
    ...(a.monthlyRevenue ? { monthlyRevenue: a.monthlyRevenue } : {}),
    ...(a.timeInBusiness ? { timeInBusiness: a.timeInBusiness } : {}),
    ...(a.creditBand ? { creditScoreBand: a.creditBand } : {}),
    ...(typeof a.ownsRealEstateEquity === "boolean" ? { ownsRealEstateEquity: a.ownsRealEstateEquity } : {}),
    ...(typeof a.hasUnpaidInvoices === "boolean" ? { hasUnpaidInvoices: a.hasUnpaidInvoices } : {}),
    recommendedProduct: result.productId,
    ...(contact ?? {}),
  };
}
