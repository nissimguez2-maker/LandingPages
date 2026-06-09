# AGENTS.md — FundVella

## What FundVella is
FundVella is a lead-generation and prequalification site that connects U.S. small
business owners with working-capital specialists. It is built with Next.js (App
Router). The site presents one general funding page (the homepage) plus 12
industry-specific "-funding" verticals, and a `/resources` content hub.

## What FundVella is NOT
FundVella is **not a lender**, broker-of-record, or financial advisor. It does not
issue funding, set rates, or make approval decisions. It connects business owners
with independent working-capital specialists who review the file and present
options. Underwriting and approval are done by third parties.

Compliance language is load-bearing — preserve it. Always use: "FundVella is not a
lender," "you may qualify," "approval depends on underwriting," "reviewed on
business revenue and bank activity," "a factor rate is not an APR," "no obligation
to accept an offer," "payments must fit your cash flow." Never use:
guaranteed/instant approval, lowest rates, no risk, bank loan, everyone qualifies,
no documents needed. Never fabricate testimonials, stats, or logos.

## Primary user task
1. **Prequalify** — owner answers a few questions on a landing page (about two
   minutes; no hard credit check, no obligation).
2. **Specialist review** — if the file looks viable, the owner shares ~3-4 months
   of business bank statements; a real funding specialist reviews it.
3. **Review options** — if underwriting supports the file, the specialist contacts
   the owner to review options that fit their cash flow.

## Where the flows live
- **Landing pages**: `app/page.tsx` (general/home) and `app/[vertical]/page.tsx`
  (12 verticals). Copy is data-driven from `content/landingPagesConfig.ts`.
- **Resources hub**: `app/resources/page.tsx` + `app/resources/[slug]/page.tsx`;
  content in `content/articles/*.ts`, composed by `content/articlesConfig.ts`.
- **Prequalify / apply flow**: CTAs link to `/apply/[vertical]`
  (`app/apply/[vertical]/page.tsx`), rendering `components/apply/ApplicationWizard.tsx`.
  Apply pages are intentionally `noindex`.
- **Calculator / Cash-Flow Stress Test**: `components/CashFlowStressTest.tsx`,
  `content/stressTest.ts`, `lib/stressTest.ts`, `lib/leadScoring.ts`. This is an
  interactive estimate tool — treat it as a protected area; do not modify it
  without explicit instruction.

## Discovery / AEO infrastructure
- `app/robots.ts` — robots policy (AI crawlers allowed; `/api/` blocked).
- `app/sitemap.ts` — home + verticals + resources + about.
- `app/llms.txt/route.ts` — `/llms.txt` summary for AI clients.
- `lib/structuredData.ts` — JSON-LD builders (Organization, WebSite, FinancialService,
  BreadcrumbList, BlogPosting, FAQPage); injected in `app/layout.tsx` and pages.
- Canonical base URL: always `getSiteUrl()` from `lib/site.ts` — never hardcode.

## Conventions
- Content lives in `content/`; logic in `lib/`; UI in `components/`. Keep page
  components thin. Estimates are ranges, never an offer. A factor rate is never
  called an APR.
