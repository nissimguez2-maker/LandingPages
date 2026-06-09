/**
 * Resources hub registry + accessors. Article content lives in the
 * content/articles/*.ts modules (authored as typed ResourceArticle data, the
 * same config-driven pattern as landingPagesConfig.ts). This file composes them
 * and exposes the lookups the /resources routes and header/footer use.
 */
import type { ResourceArticle } from "@/lib/types";
import { guidesContent } from "./articles/guides-content";
import { guidesDomain } from "./articles/guides-domain";
import { guidesIndustry } from "./articles/guides-industry";

const ALL: ResourceArticle[] = [...guidesContent, ...guidesDomain, ...guidesIndustry];

/** Pillars, in the order they should appear in the hub + Resources menu. */
const PILLAR_SLUGS = [
  "working-capital-guide",
  "merchant-cash-advance-explained",
  "business-funding-by-industry",
  "business-funding-bad-credit-guide",
] as const;

/** Display order for the "articles by category" section of the hub. */
const ARTICLE_CATEGORY_ORDER = ["Costs & Terms", "Qualifying", "Credit & Qualifying", "By Industry"];

export function getAllResources(): ResourceArticle[] {
  return ALL;
}

export function getResourceSlugs(): string[] {
  return ALL.map((a) => a.slug);
}

export function getResourceBySlug(slug: string): ResourceArticle | undefined {
  return ALL.find((a) => a.slug === slug);
}

export function getPillars(): ResourceArticle[] {
  return PILLAR_SLUGS.map((s) => ALL.find((a) => a.slug === s)).filter(
    (a): a is ResourceArticle => Boolean(a)
  );
}

export function getGlossary(): ResourceArticle | undefined {
  return ALL.find((a) => a.kind === "glossary");
}

/** Non-pillar, non-glossary articles grouped by category, in a sensible order. */
export function getArticlesByCategory(): { category: string; items: ResourceArticle[] }[] {
  const articles = ALL.filter((a) => a.kind === "article");
  const groups = new Map<string, ResourceArticle[]>();
  for (const a of articles) {
    if (!groups.has(a.category)) groups.set(a.category, []);
    groups.get(a.category)!.push(a);
  }
  const ordered: { category: string; items: ResourceArticle[] }[] = [];
  for (const cat of ARTICLE_CATEGORY_ORDER) {
    const items = groups.get(cat);
    if (items) {
      ordered.push({ category: cat, items });
      groups.delete(cat);
    }
  }
  for (const [category, items] of groups) ordered.push({ category, items });
  return ordered;
}

/** Related entries for an article: its declared `related` slugs, then
 *  same-category siblings as a fallback. */
export function getRelated(article: ResourceArticle, n = 3): ResourceArticle[] {
  const out: ResourceArticle[] = [];
  for (const slug of article.related ?? []) {
    const r = getResourceBySlug(slug);
    if (r && r.slug !== article.slug && !out.includes(r)) out.push(r);
    if (out.length >= n) return out;
  }
  for (const a of ALL) {
    if (out.length >= n) break;
    if (a.slug !== article.slug && a.category === article.category && !out.includes(a)) out.push(a);
  }
  return out.slice(0, n);
}
