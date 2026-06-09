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
    "@id": `${base}/#organization`,
    name: SITE_NAME,
    url: base,
    logo: `${base}/logo.svg`,
    description:
      "FundVella connects small business owners with working capital specialists. FundVella is not a lender. You may qualify; approval depends on underwriting.",
    // `sameAs` intentionally omitted until real, verified social profiles exist.
  };
}

/** Site-level entity, linked to the Organization via @id. Injected once in the layout. */
export function buildWebSiteJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: SITE_NAME,
    url: base,
    publisher: { "@id": `${base}/#organization` },
  };
}

/** FinancialService for a money/vertical page (FundVella as the connector/provider). */
export function buildServiceJsonLd(serviceType: string, slug: string) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: serviceType,
    serviceType,
    url: `${base}/${slug}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: base },
    areaServed: { "@type": "Country", name: "US" },
  };
}

type Crumb = { name: string; path: string };

/** N-level BreadcrumbList. Home is auto-prepended at position 1; callers pass the
 *  remaining crumbs in order. */
export function buildBreadcrumbsJsonLd(crumbs: Crumb[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${base}${c.path}`,
      })),
    ],
  };
}

/** Back-compat wrapper: the vertical pages call buildBreadcrumbJsonLd(title, slug). */
export function buildBreadcrumbJsonLd(verticalTitle: string, slug: string) {
  return buildBreadcrumbsJsonLd([{ name: verticalTitle, path: `/${slug}` }]);
}

/** BlogPosting for a resource article. */
export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/resources/factor-rate-vs-apr". */
  slug: string;
  datePublished: string;
  dateModified?: string;
  /** Site-relative image path; defaults to the generated OG card. */
  image?: string;
}) {
  const base = getSiteUrl();
  const canonical = `${base}${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: `${base}${article.image ?? "/opengraph-image"}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: base },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${base}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
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
