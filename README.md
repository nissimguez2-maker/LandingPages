# FundVella — Funding Landing Pages

Conversion-optimized, compliance-aware landing pages for SMB / MCA funding
verticals. **One codebase → one site → many routes**, all driven by a shared
config.

This repo is the **landing page (front end) only** — a clean slate. There is
**no backend wired yet**: the form POSTs to a placeholder endpoint that simply
acknowledges the capture. You'll build the backend (CRM, email, routing,
automation) from scratch.

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # fill in values as needed
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript only
```

The full UI works with no configuration. The lead form submits to
`app/api/lead`, which currently just returns `{ ok: true }` — nothing is stored
or sent anywhere yet.

---

## 2. Project structure

```
app/
  layout.tsx               Root layout + base SEO metadata
  page.tsx                 Home (index of all verticals)
  [vertical]/page.tsx      All landing pages (SSG) + FAQ JSON-LD
  thank-you/page.tsx       Neutral confirmation page (noindex)
  api/lead/route.ts        Lead endpoint — emits a signed event to n8n (→ Google Sheet)
  privacy · terms · disclosures   Legal pages (linked in the footer)
  sitemap.ts · robots.ts   Generated SEO routes
components/
  LandingPageTemplate.tsx  Assembles every section in conversion order
  HeroSection · OfferingsSection · HowItWorksSection · SocialProofSection · …
  CashFlowStressTest.tsx   Tap-only diagnostic that captures intel + pre-fills the form
  prequal/                 Progressive prequalification form
content/
  landingPagesConfig.ts    ← ALL vertical copy / SEO / FAQ / criteria
  stressTest.ts            Stress-test copy
lib/
  leadScoring.ts           Scoring + Green/Yellow/Red bands (drives the stress-test UX)
  completeness.ts          Form completion % + missing info
  analytics.ts · utm.ts    Vendor-neutral events + UTM capture
  stressTest.ts            Stress-test scoring math
  site.ts · themes.ts · structuredData.ts · types.ts
```

---

## 3. Edit a vertical's content

Everything visible on a page comes from one object in
`content/landingPagesConfig.ts`. Find the vertical by its `slug` (which becomes
the route, `/<slug>`) and edit any of: `heroHeadline`, `heroSubheadline`,
`heroHighlights`, `useCases`, `qualificationNotes`, `goodFitCriteria`,
`reviewCriteria`, `fitTable`, `faqs`, `cta`, `seoTitle`, `seoDescription`,
`painRelief`, `cashFlowSignature`.

### Add a new vertical
Append a new entry to `landingPages` in `content/landingPagesConfig.ts` (copy an
existing one). The dynamic route, sitemap, footer links, and home grid all read
from the config — `generateStaticParams()` builds the new page on the next deploy.

> **Compliance:** keep the approved language ("you may qualify", "approval
> depends on underwriting", "no obligation to accept an offer") and avoid
> prohibited claims (guaranteed/instant approval, lowest rates, no risk, bank
> loan, everyone qualifies). The disclaimer renders near every form and in the
> footer (`components/DisclaimerBlock.tsx`).

---

## 4. The lead form (how leads flow)

The form (and the Cash-Flow Stress Test) POST to `app/api/lead/route.ts`, which
scores the lead and emits a signed, idempotent `lead.captured` event to an n8n
webhook (`APPLICATION_WEBHOOK_URL`). Your n8n workflow appends the lead to a
**Google Sheet**, where the team calls/texts each lead manually. The payload
shape is the `LeadData` type in `lib/types.ts`.

No CRM and no booking tool are wired — the Google Sheet is the destination.

---

## 5. Analytics

Vendor-neutral by design (`lib/analytics.ts`). Every event is pushed to
`window.dataLayer` (GTM-ready) and dispatched as a `CustomEvent`. PostHog and
Clarity turn on only if their `NEXT_PUBLIC_*` keys are set; otherwise events are
still emitted locally.

---

## 6. SEO

Per page: title, meta description, **canonical URL**, OpenGraph + Twitter tags,
and **FAQ JSON-LD**. Site-wide: generated `sitemap.xml` and `robots.txt` (`/api`
and `/thank-you` disallowed). Set `NEXT_PUBLIC_SITE_URL` so canonical/OG/sitemap
use your real domain.

---

## 7. Deploy

Connect this repo to **Netlify** (settings come from `netlify.toml`; the official
`@netlify/plugin-nextjs` runtime) or to Vercel. Set at least
`NEXT_PUBLIC_SITE_URL`. Build command `npm run build`, Node 20.

### Future: multiple domains
If a vertical needs its own domain, keep **one repo**: create another site
pointed at this repo and set `SITE_VERTICAL=<slug>` in its environment. That
deployment serves only that vertical, on its own domain, from the same source.
