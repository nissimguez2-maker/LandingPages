/**
 * ════════════════════════════════════════════════════════════════════════════
 *  PRODUCT MATRIX — the single source of truth for the funding options FundVella
 *  surfaces. Mirrors docs/product-matrix.md §1 (products) and §5 (compliance).
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Both the homepage OFFERINGS array (content/landingPagesConfig.ts) and the
 * /products page derive from PRODUCTS, so the matrix is defined exactly once.
 *
 * Compliance rails (load-bearing — see §5):
 *   - Revenue-Based Funding (MCA) = a PURCHASE OF FUTURE RECEIVABLES, not a loan.
 *     Cost = factor rate → one total payback. NEVER "interest", "APR", or
 *     "bank loan" for it.
 *   - APR is correct ONLY for real loans: Term Loan and SBA.
 *   - No promised rate/number before statement review; show ranges / how it works.
 *   - Always: FundVella is not a lender; no obligation; approval depends on
 *     underwriting. Never "guaranteed / instant / lowest rates / no risk /
 *     everyone qualifies".
 *   - Credit Repair (CROA): no upfront fees (billed in arrears), cancel within
 *     3 business days, NEVER promise a score, a number of deletions, or any
 *     outcome ("dispute inaccurate or questionable items").
 *   - Card Processing is a SERVICE, never the headline / never framed as funding.
 *
 * Icons use ONLY the valid keys in components/icons/Icon.tsx.
 */

import type { Product } from "@/lib/types";
import type { OfferingProduct } from "@/lib/types";

export const PRODUCTS: Product[] = [
  {
    id: "revenue-based",
    name: "Revenue-Based Funding",
    slug: "revenue-based-funding",
    category: "funding",
    isPrimary: true,
    costModel: "factor-rate",
    icon: "spark",
    bestWhen: "Best for covering a gap or moving on an opportunity fast.",
    whoItFits: "Active daily or weekly deposits, needs speed, and credit-flexible.",
    body:
      "Funding based on your revenue, not credit alone. It is a purchase of a set amount of your future receivables, not a loan, repaid as a small automatic share of deposits so it flexes with a slow week. A factor rate sets one total payback amount up front; it is not an APR.",
    framingFacts: [
      "Purchase of future receivables, not a loan",
      "Cost is a factor rate → one total payback amount, not an APR",
      "Daily or weekly remittance that flexes with deposits",
      "No tax returns; reviewed on bank activity",
    ],
    complianceNote:
      "Revenue-based funding is a purchase of future receivables. Cost is a factor rate that fixes one total payback amount up front; it is not an interest rate or APR. You see the full payback before you decide.",
  },
  {
    id: "line-of-credit",
    name: "Business Line of Credit",
    slug: "business-line-of-credit",
    category: "funding",
    costModel: "n-a",
    icon: "scale",
    bestWhen: "Best when the need keeps coming back.",
    whoItFits: "Flexible, recurring needs and a cleaner business profile.",
    body:
      "A revolving limit you draw on when you need it and pay down when you don't, so you only pay for what you draw. Useful when the need is recurring rather than one-time.",
    framingFacts: [
      "Revolving limit, often $250K–$500K",
      "Draw and repay as needed",
      "Pay only for what you draw",
    ],
  },
  {
    id: "heloc",
    name: "HELOC",
    slug: "heloc",
    category: "funding",
    costModel: "apr",
    icon: "shield",
    bestWhen: "Best with 650+ credit and equity in your real estate.",
    whoItFits: "Owners with 650+ FICO and real-estate equity who want speed.",
    body:
      "A line against your property's equity, often funded within a day. You get an indicative number up front; final terms confirm against your equity and title. Speed is the draw.",
    framingFacts: [
      "Line against real-estate equity",
      "Often funded within a day",
      "Indicative number up front; final terms confirm against equity & title",
      "Typically needs 650+ FICO and property equity",
    ],
  },
  {
    id: "term-loan",
    name: "Term Loan",
    slug: "term-loan",
    category: "funding",
    costModel: "apr",
    icon: "clock",
    bestWhen: "Best for a one-time use with a predictable monthly payment.",
    whoItFits: "Stronger credit, a predictable need, and room for a monthly payment.",
    body:
      "A real business loan with a fixed payment over a set term. Because it is a true loan, an APR is the right measure here (unlike revenue-based funding), and there is no prepayment penalty.",
    framingFacts: [
      "A real loan — APR from ~4.99%",
      "$10K–$10M, terms 1–10 years",
      "No prepayment penalty",
      "APR language is correct here",
    ],
    complianceNote:
      "A term loan is a real loan, so an APR is the correct measure (unlike revenue-based funding). Rates and terms shown are indicative ranges; final terms depend on underwriting.",
  },
  {
    id: "sba",
    name: "SBA Loan",
    slug: "sba-loan",
    category: "funding",
    costModel: "apr",
    icon: "lock",
    bestWhen: "Best for strong profiles on an unhurried timeline.",
    whoItFits: "Top profiles with a patient timeline.",
    body:
      "Bank-funded term financing with the longest terms. As a real loan it carries an APR. It requires tax returns and more patience, so shorter bridge funding can carry you while it processes.",
    framingFacts: [
      "Bank-funded term loan (carries an APR)",
      "Requires tax returns",
      "Longest terms, slower to fund",
    ],
    complianceNote:
      "An SBA loan is a real, bank-funded loan, so an APR applies. It requires tax returns and a longer timeline; approval is the bank's decision.",
  },
  {
    id: "equipment",
    name: "Equipment Financing",
    slug: "equipment-financing",
    category: "funding",
    costModel: "n-a",
    icon: "tools",
    bestWhen: "Best when you're buying equipment, new or used.",
    whoItFits: "Acquiring machinery, vehicles, technology, or furniture.",
    body:
      "The equipment itself is the collateral, so it is often easier to qualify for. Possible tax write-offs may apply — confirm with a CPA.",
    framingFacts: [
      "Equipment is the collateral → easier to qualify",
      "Up to 100% financing",
      "Terms up to 7 years",
      "Possible write-offs (confirm with a CPA)",
    ],
  },
  {
    id: "bridge",
    name: "Bridge Funding",
    slug: "bridge-funding",
    category: "funding",
    costModel: "factor-rate",
    icon: "expand",
    bestWhen: "Best when you need capital now while a slower loan is in process.",
    whoItFits: "Needs capital now while a slower loan (SBA or term) is in process.",
    body:
      "Short-term funding that puts cash to work today and can be cashed out when your term loan or SBA funds.",
    framingFacts: [
      "Short-term bridge to capital now",
      "Can be cashed out when the long-term loan funds",
    ],
  },
  {
    id: "invoice-factoring",
    name: "Invoice Factoring",
    slug: "invoice-factoring",
    category: "funding",
    costModel: "fee",
    icon: "inventory",
    bestWhen: "Best when cash is stuck in unpaid invoices.",
    whoItFits: "Has receivables or a specific asset to fund against.",
    body:
      "Turn outstanding invoices into cash now instead of waiting on net-30 or net-60. Funding is advanced against your receivables or a specific asset.",
    framingFacts: [
      "Funding against receivables or assets",
      "Cash now instead of waiting on net-30 / net-60",
    ],
  },
  {
    id: "credit-repair",
    name: "Credit Repair",
    slug: "credit-repair",
    category: "path",
    costModel: "fee",
    icon: "user-check",
    bestWhen: "A path back when a business isn't fundable yet.",
    whoItFits: "Not fundable today — for example a sub-500 FICO or a credit-blocked file.",
    body:
      "A not-yet is not a no. If credit is the blocker, a restoration partner runs a 3-bureau forensic audit and disputes inaccurate or questionable items on your behalf, with a dedicated manager and a client portal, so you have a runway back to fundable.",
    framingFacts: [
      "3-bureau forensic audit and professional disputes",
      "Dedicated manager and client portal",
      "No upfront fees — billed monthly, in arrears",
      "Cancel within 3 business days",
    ],
    complianceNote:
      "Credit repair disputes inaccurate or questionable items; it does not promise a specific score, a number of deletions, or any outcome. There are no upfront fees (you are billed monthly, in arrears) and you can cancel within 3 business days.",
  },
  {
    id: "card-processing",
    name: "Card Processing",
    slug: "card-processing",
    category: "service",
    costModel: "fee",
    icon: "cart",
    bestWhen: "A supportive service for existing, operating merchants.",
    whoItFits: "Existing or operating merchants that accept card payments.",
    body:
      "Payment processing for merchants that already take cards. This is a service, not funding — supportive, and never the headline.",
    framingFacts: [
      "Card payment processing for operating merchants",
      "A service, not funding",
    ],
  },
];

/* ── Derived selections ─────────────────────────────────────────────────── */

/** The 8 capital options (excludes the credit-repair path and card-processing service). */
export const FUNDING_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.category === "funding");

/** The credit-repair "path back" (one entry). */
export const PATH_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.category === "path");

/** Supportive merchant services (card processing). */
export const SERVICE_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.category === "service");

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Map the funding products into the OfferingProduct shape the OfferingsSection
 * component consumes (name, bestWhen, body, icon, hero). One source of truth.
 */
export function toOfferingProducts(): OfferingProduct[] {
  return FUNDING_PRODUCTS.map((p) => ({
    name: p.name,
    bestWhen: p.bestWhen,
    body: p.body,
    icon: p.icon,
    ...(p.isPrimary ? { hero: true } : {}),
  }));
}
