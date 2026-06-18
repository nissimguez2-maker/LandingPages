/**
 * Credit-runway ("a not-yet isn't a no") content.
 *
 * This is the REAL path for files that aren't fundable yet (docs/product-matrix.md
 * §2 "not a no — a not-yet" + the §1 credit-repair row). It is NOT a loan and NOT
 * a funding product.
 *
 * CROA compliance (§5) is load-bearing here and is encoded in the copy below:
 *   - NEVER promise a score, a number of deletions, or any outcome. We "dispute
 *     inaccurate or questionable items," nothing more.
 *   - No upfront fees — billed monthly, in arrears.
 *   - Cancel within 3 business days.
 *   - It is a route to becoming fundable so we can revisit; never loan language.
 * All copy here must keep those rails. See content/productsConfig.ts (credit-repair).
 */

export interface RunwayStep {
  title: string;
  description: string;
  /** Icon key from components/icons/Icon.tsx (valid set only). */
  icon: string;
}

export const CREDIT_RUNWAY = {
  seoTitle: "Credit runway: a not-yet isn't a no | FundVella",
  seoDescription:
    "Not fundable yet? There's a path back. A credit-restoration partner reviews all three bureaus and disputes inaccurate or questionable items, with no upfront fees and a 3-day cancellation right. Not a loan.",
  eyebrow: "If you're not fundable yet",
  headline: "A “not yet” isn’t a “no”",
  intro:
    "If credit is the thing standing between you and funding right now, that's not a dead end — it's a starting point. A credit-restoration partner can help you build a runway back to fundable, so we can revisit your funding when you're in a stronger position.",
  notALoan:
    "This is a path to becoming fundable, not a loan and not a funding product. There's no borrowing here — just work on your credit file.",

  howItWorksHeading: "How the credit runway works",
  howItWorksIntro:
    "A white-labeled restoration partner handles the work, with you in the loop the whole way.",
  steps: [
    {
      title: "A full 3-bureau review",
      description:
        "Your file is pulled and reviewed across all three credit bureaus to find inaccurate or questionable items worth challenging.",
      icon: "eye",
    },
    {
      title: "Professional disputes",
      description:
        "The partner disputes inaccurate or questionable items on your behalf. There's no promise of a score, a number of deletions, or any specific outcome — just the work, done properly.",
      icon: "shield",
    },
    {
      title: "A dedicated manager and portal",
      description:
        "You get a dedicated manager and a client portal, so you can see what's happening and ask questions along the way.",
      icon: "user-check",
    },
    {
      title: "We revisit funding",
      description:
        "As your file gets stronger, we revisit your funding options. The goal is to get you fundable, not to keep you waiting.",
      icon: "spark",
    },
  ] as RunwayStep[],

  /** CROA rails, stated plainly and visibly. */
  termsHeading: "What you should know",
  terms: [
    "This is credit restoration, not a loan or a funding product.",
    "No upfront fees — you're billed monthly, in arrears, for work performed.",
    "You can cancel within three business days.",
    "The partner disputes inaccurate or questionable items. No score, number of deletions, or outcome is promised.",
  ],

  formHeading: "Tell us where to reach you",
  formIntro:
    "Share your name and a way to reach you, and a specialist will walk you through the credit runway and what becoming fundable could look like. No obligation.",
  formCta: "Get the credit runway details",
  formSuccessHeading: "Thanks — we've got it",
  formSuccessBody:
    "A specialist will reach out to walk you through the credit runway and the path back to fundable. There's no obligation, and you can cancel within three business days once you start.",

  /** Lead tag forwarded to the intake route. */
  leadSource: "credit-runway",
} as const;
