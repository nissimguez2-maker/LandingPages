/**
 * Centralized JSON-LD (schema.org) builders. Keeping these pure functions in
 * one place mirrors the lib/ utility pattern and keeps page components thin.
 */

import type { FAQItem } from "./types";
import { SITE_NAME, getSiteUrl } from "./site";

export function buildOrganizationJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: base,
    description:
      "FundVella connects small business owners with working capital specialists. FundVella is not a lender. You may qualify; approval depends on underwriting.",
    // `logo` / `sameAs` intentionally omitted until real brand + social assets exist.
  };
}

export function buildBreadcrumbJsonLd(verticalTitle: string, slug: string) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: verticalTitle, item: `${base}/${slug}` },
    ],
  };
}

export function buildFaqJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      // Uses the canonical `answer` only — never the UI-only `bullets`.
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
