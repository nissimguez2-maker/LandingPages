import { getActiveVerticals } from "@/content/landingPagesConfig";
import { getPillars, getGlossary } from "@/content/articlesConfig";
import { getSiteUrl } from "@/lib/site";

// /llms.txt — a concise, AI-client-facing map of the site (AEO discovery file).
export const dynamic = "force-static";

export function GET() {
  const base = getSiteUrl();
  const verticals = getActiveVerticals()
    .map((v) => `- [${v.title}](${base}/${v.slug}): ${v.seoDescription}`)
    .join("\n");
  const pillars = getPillars()
    .map((p) => `- [${p.title}](${base}/resources/${p.slug}): ${p.excerpt}`)
    .join("\n");
  const glossary = getGlossary();

  const lines = [
    "# FundVella",
    "",
    "> FundVella connects small business owners with working-capital specialists. FundVella is NOT a lender. Files are reviewed on business revenue and bank activity (not credit alone) by a real specialist; you may qualify, and approval depends on underwriting. There is no obligation to accept an offer. A factor rate is not an APR.",
    "",
    "## Key pages",
    "",
    `- [Small Business Funding (home)](${base}/): Working capital for almost any operating business, reviewed on revenue and bank activity, not credit alone.`,
    verticals,
    `- [Resources](${base}/resources): Plain-English guides to working capital, costs, qualifying, and choosing a funding option.`,
    pillars,
    glossary ? `- [Glossary](${base}/resources/${glossary.slug}): Plain-language definitions for funding terms (factor rate, holdback, ACH, and more).` : "",
    `- [About](${base}/about): Who FundVella is and the not-a-lender model.`,
    `- [Disclosures](${base}/disclosures): Compliance disclosures.`,
    `- [Privacy](${base}/privacy): How submitted information is collected, used, and protected.`,
    `- [Terms](${base}/terms): Terms of use.`,
    "",
    "## About",
    "",
    "FundVella helps small business owners prequalify in about two minutes, then connects viable files with working-capital specialists who review recent bank statements and match the owner to an option that fits their cash flow. FundVella does not lend, set rates, or approve funding. Prequalifying is free, does not trigger a hard credit check, and carries no obligation to accept an offer.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
