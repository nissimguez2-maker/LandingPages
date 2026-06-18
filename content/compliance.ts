/**
 * Single source of truth for the reusable compliance copy / rails.
 *
 * Keep the wording HERE; components import from this file so the legally-sensitive
 * language can't drift across the site. Rails (see docs/product-matrix.md §5):
 *   - not a lender / not a bank loan; a commitment to lend is never implied
 *   - approval depends on underwriting and is never guaranteed ("you may qualify")
 *   - revenue-based funding is a purchase of future receivables priced by a FACTOR
 *     RATE, not an APR; term/SBA are real loans that carry an APR
 *   - credit repair is partner-run under the CROA (no upfront fee, no promised outcome)
 *   - submitting places the visitor under no obligation
 *
 * Migration note: DisclaimerBlock + the hero eligibility line read from here.
 * Other pages/articles still carry inline copy; point them at COMPLIANCE over time
 * so this stays the one place wording changes.
 */
export const COMPLIANCE = {
  /** One-liner under CTAs / in the footer. */
  line: "Not a commitment to lend or a bank loan. Approval depends on underwriting and is not guaranteed.",
  /** The master disclosure block rendered near the forms. */
  full:
    "This is not a commitment to lend and is not a bank loan. Funding options, amounts, and timing depend " +
    "on underwriting and documentation; approval is not guaranteed. Any payments must fit your business " +
    "cash flow. Submitting your information places you under no obligation. A funding specialist may " +
    "contact you to review your inquiry.",
  /** Short eligibility rail used under heroes / CTAs. */
  mayQualify: "You may qualify. Approval depends on underwriting. No obligation to accept an offer.",
  /** Revenue-based vs. real-loan pricing distinction. */
  factorVsApr:
    "Revenue-based funding is a purchase of future receivables priced by a factor rate, not an APR; " +
    "term and SBA loans are real loans that carry an APR.",
  /** Credit-repair (CROA) rail — only ever shown on the credit/runway path. */
  croa:
    "Credit repair is provided by a third-party partner under the CROA: no upfront fees, billed monthly " +
    "in arrears, with a 3-business-day right to cancel. No score, deletion count, or outcome is promised.",
} as const;
