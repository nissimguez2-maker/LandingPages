# Merchant Capital Review — MCA / SMB Funding Landing Pages

Conversion-optimized, compliance-aware landing pages for 12 funding verticals.
**One codebase → one Netlify site → 12 routes → one centralized HubSpot CRM.**

The landing pages are front-end acquisition routes only. The backend system of
record is **HubSpot** — one CRM, one lead database, one qualification engine, one
funding pipeline.

---

## Table of contents

1. [Architecture (one site, not twelve)](#architecture)
2. [Run locally](#run-locally)
3. [Project structure](#project-structure)
4. [Edit a vertical's content](#edit-content)
5. [Add a new vertical](#add-vertical)
6. [Configure HubSpot](#configure-hubspot)
7. [Edit the HubSpot field mapping](#field-mapping)
8. [Build the HubSpot funding pipeline (manual)](#pipeline)
9. [How lead scoring works](#lead-scoring)
10. [The progressive form + partial lead capture](#the-form)
11. [Analytics events](#analytics)
12. [SEO](#seo)
13. [Deploy to Netlify](#deploy)
14. [Future: multiple domains (Option C)](#multi-domain)
15. [Future: crawler / traffic automation hooks](#crawlers)

---

<a name="architecture"></a>
## 1. Architecture — one site, not twelve

**Decision: Option A, built "C-ready."** One Next.js (App Router) + TypeScript +
Tailwind codebase, deployed to a single Netlify site, serving all 12 routes from
a shared config. This is the lowest-maintenance option and consolidates SEO
authority on one domain. You never maintain 12 sites.

- **Pages** are statically generated (fast, SEO-friendly).
- **Lead submission** runs server-side in `app/api/lead/route.ts` (a Netlify
  serverless function) so the HubSpot token is never exposed to the browser.
- **All content** lives in `content/landingPagesConfig.ts` — pages are rendered
  by one template, not hand-built 12 times.

If you ever need **separate domains per vertical**, you don't rewrite anything —
see [Future: multiple domains](#multi-domain).

The 12 routes:

```
/restaurant-business-funding      /medical-practice-funding
/trucking-business-funding        /dental-practice-funding
/construction-business-funding    /beauty-salon-med-spa-funding
/ecommerce-inventory-funding      /retail-store-funding
/auto-repair-shop-funding         /hvac-plumbing-business-funding
/cleaning-business-funding        /bad-credit-business-funding
```

---

<a name="run-locally"></a>
## 2. Run locally

```bash
npm install
cp .env.example .env.local   # fill in values (see "Configure HubSpot")
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (what Netlify runs)
npm run start      # serve the production build
npm run typecheck  # TypeScript only
```

You can develop the UI without any HubSpot credentials — submissions will be
logged and skipped server-side until a token is set.

---

<a name="project-structure"></a>
## 3. Project structure

```
app/
  layout.tsx               Root layout + base SEO metadata
  page.tsx                 Home (index of all verticals)
  [vertical]/page.tsx      All 12 landing pages (SSG) + FAQ JSON-LD
  thank-you/page.tsx       Neutral confirmation page (noindex)
  api/lead/route.ts        Secure lead intake (full + partial) → CRM
  sitemap.ts · robots.ts   Generated SEO routes
components/
  LandingPageTemplate.tsx  Assembles every section in conversion order
  HeroSection · UseCasesSection · HowItWorksSection
  QualificationCriteriaSection · FitComparisonTable · FAQSection
  CTASection · TrustBar · DisclaimerBlock · CTAButton · PageViewTracker
  SiteHeader · SiteFooter · ThankYou
  prequal/
    PrequalificationFlow.tsx  4-step progressive form + partial capture
    FormStep · ProgressIndicator · Fields
content/
  landingPagesConfig.ts    ← ALL vertical copy/SEO/FAQ/criteria
lib/
  hubspotFieldMap.ts       ← ALL HubSpot property names + value maps + pipeline
  crm.ts                   submitLeadToCRM() — CRM-agnostic entrypoint
  hubspot.ts               submitLeadToHubSpot() — server-only implementation
  leadScoring.ts           Scoring + Green/Yellow/Red bands
  completeness.ts          Form completion % + missing info
  analytics.ts · utm.ts    Event hooks + UTM capture
  types.ts · site.ts       Types/option sets + site constants
```

---

<a name="edit-content"></a>
## 4. Edit a vertical's content

Everything visible on a page comes from one object in
`content/landingPagesConfig.ts`. Find the vertical by its `slug` and edit any of:

`heroHeadline`, `heroSubheadline`, `heroHighlights`, `useCases`,
`qualificationNotes`, `goodFitCriteria`, `reviewCriteria`, `fitTable`, `faqs`,
`cta`, `seoTitle`, `seoDescription`.

Shared building blocks (`baseFaqs()`, `baseFitTable()`, `WHAT_WE_LOOK_AT`) keep
copy consistent — edit them once to change every page.

> **Compliance:** keep the approved language ("you may qualify", "approval
> depends on underwriting", "no obligation to accept an offer", "clean files can
> move faster") and avoid prohibited claims (guaranteed/instant approval, lowest
> rates, no risk, bank loan, everyone qualifies, no documents needed). The
> disclaimer in `DisclaimerBlock.tsx` renders near every form and in the footer.

---

<a name="add-vertical"></a>
## 5. Add a new vertical

1. Append a new `VerticalConfig` object to `landingPages` in
   `content/landingPagesConfig.ts` (copy an existing one as a template). The
   `slug` becomes the route (`/<slug>`).
2. That's it. The dynamic route, sitemap, footer links, and home grid all read
   from the config — `generateStaticParams()` will build the new page on the next
   deploy.
3. (Optional) If the vertical maps to a HubSpot `industry_focus` option
   (technology/healthcare/finance/retail), set `industryFocus`, or add a mapping
   in `SLUG_TO_INDUSTRY_FOCUS` in `lib/hubspot.ts`.

---

<a name="configure-hubspot"></a>
## 6. Configure HubSpot

Submissions use a **Private App token** server-side (created/updated objects:
Contact → Company → Deal, with associations).

1. HubSpot → **Settings → Integrations → Private Apps → Create a private app**.
2. Scopes: `crm.objects.contacts.read/write`, `crm.objects.companies.read/write`,
   `crm.objects.deals.read/write`.
3. Copy the **access token** and set environment variables (locally in
   `.env.local`, and in Netlify → Site settings → Environment variables):

```
HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxxxxxx     # required (server-side secret)
HUBSPOT_PORTAL_ID=148647134                # optional
HUBSPOT_FORM_ID=                           # optional (form mirror, not required)
HUBSPOT_DEAL_PIPELINE_ID=default           # see "Build the pipeline"
HUBSPOT_DEAL_DEFAULT_STAGE_ID=appointmentscheduled
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SITE_VERTICAL=                             # leave empty (Option C only)
```

**Never commit secrets.** `.env*` is gitignored.

**What gets written on a full submission**

- **Contact** (upserted by email): name, email, phone, `lead_source`,
  `funding_readiness_score`, `lead_category`, `lead_urgency`,
  `original_landing_page_url`, `form_completion_percentage`,
  `missing_information`, preferred time/channel, `marketing_consent_status`, UTM.
- **Company** (upserted by domain, else created): name, revenue → `monthly_gross_revenue`,
  `time_in_business` (years), `amount_requested`, bank-statement / NSF / existing-debt
  booleans, advance count, payment burden, current funder/balance, use of funds.
- **Deal** (created + associated): `dealname`, `amount`, `amount_requested`,
  `product_type` (merchant_cash_advance), `deal_status`, `funding_readiness_score`,
  `lead_category`, pipeline + stage.

**Partial leads** create **Contact (+ Company) only — no Deal** (per architecture
decision), so the pipeline stays clean.

> **Verified field-name notes** (already handled in the field map):
> - `estimated_card_sales__processor_volume` (double underscore)
> - `estimated_current_dailyweekly_payment_burden` (no underscore in "dailyweekly")
> - `dba_trade_name` was **not found** in the portal — it's left out of writes
>   until you create it or correct the name in `lib/hubspotFieldMap.ts`.
> - Internal **Green/Yellow/Red** bands map to HubSpot `lead_category`
>   **hot/warm/cold**; urgency maps to **high/medium/low**.

---

<a name="field-mapping"></a>
## 7. Edit the HubSpot field mapping

**One file:** `lib/hubspotFieldMap.ts`. It centralizes every HubSpot internal
property name, the enum value maps (band→category, urgency→enum, channel→enum),
the representative numeric maps (revenue/amount/time-in-business), and the
pipeline config. If HubSpot renames a property, change it here and nowhere else.
No property name is hardcoded anywhere else in the codebase.

---

<a name="pipeline"></a>
## 8. Build the HubSpot funding pipeline (manual)

⚠️ The 18-stage MCA pipeline **must be created manually** — it cannot be created
from code with the current integration, and only the default "Sales Pipeline"
exists today. Until you build it, deals land in the default pipeline at
"Appointment Scheduled" (configurable via env).

**Create it:** HubSpot → Settings → Objects → **Deals → Pipelines → Create
pipeline**. Name it e.g. "MCA Funding Pipeline" and add these stages in order:

1. New Lead
2. Prequalification Needed
3. Prequalified — Green
4. Prequalified — Yellow / Needs Review
5. Documents Requested
6. Documents Received
7. Statement Review
8. Submitted to Underwriting
9. Offer Received
10. Offer Presented
11. Contracts Sent
12. Contracts Signed
13. Closing Stips
14. Funded
15. Declined
16. Lost / Not Interested
17. Nurture
18. Renewal Opportunity

**Then wire it up:**

- Find the **pipeline id** and each **stage id** (Settings → Deals → Pipelines →
  the pipeline → each stage shows its internal id, or via the CRM API).
- Set `HUBSPOT_DEAL_PIPELINE_ID` and `HUBSPOT_DEAL_DEFAULT_STAGE_ID` in Netlify.
- (Optional) Paste the stage ids into `MCA_PIPELINE_STAGES` in
  `lib/hubspotFieldMap.ts` so future routing logic can reference stable keys.

A natural default mapping: full **Green** → "Prequalified — Green", full
**Yellow** → "Prequalified — Yellow", **partial** → "Prequalification Needed".

---

<a name="lead-scoring"></a>
## 9. How lead scoring works

Implemented in `lib/leadScoring.ts` (used both client-side for analytics and
server-side for the authoritative HubSpot write):

| Signal | Points |
|---|---|
| Monthly revenue $20k+ | +25 |
| Monthly revenue $10k–$20k | +10 |
| Monthly revenue under $10k | −20 |
| Time in business 12+ months | +20 |
| Time in business 3–12 months | +5 |
| Time in business under 3 months | −25 |
| Can provide bank statements | +20 |
| Existing MCA / loan | −5 |
| Multiple existing advances | −20 |
| Recent NSFs / negative days | −25 |
| Urgency today / this week | +10 |
| Clear productive use of funds | +10 |

**Hard rules:** missing contact details ⇒ **cannot be Green**; refusing key
documents ⇒ **downgrade**.

**Bands:** `70+` = **Green** (strong fit) · `45–69` = **Yellow** (needs review) ·
`<45` = **Red** (may not be ready).

Bands drive **internal routing only** (`funding_readiness_score` + `lead_category`
hot/warm/cold). The visitor always sees the same neutral thank-you — no rejection
language is ever shown.

---

<a name="the-form"></a>
## 10. The progressive form + partial lead capture

`components/prequal/PrequalificationFlow.tsx` is a 4-step flow (not one long
form), ordered low-friction → sensitive:

1. **Business** — revenue, time in business, amount, urgency
2. **Details** — existing financing, payment burden, NSFs, use of funds, can
   provide statements (sensitive fields allow **"Prefer to discuss" / "Not sure"**)
3. **Contact** — name, business, phone, email, state, preferred time/channel, consent
4. **Optional** — website, current funder/balance, notes → submit

**Partial capture:** the moment contact info is captured (end of step 3), the
lead is saved to HubSpot in the background (`partial: true`). A `beforeunload`
beacon is a safety net if the visitor leaves before submitting. Partial leads
store completion %, missing info, source page, vertical, UTM, urgency, and
computed band/score — and create **Contact (+ Company) only**.

---

<a name="analytics"></a>
## 11. Analytics events

No paid tool is wired up yet (by design), but hooks are ready in
`lib/analytics.ts`. Every event is pushed to `window.dataLayer` (GTM-ready) and
dispatched as a `CustomEvent` (`analytics`). Swap the body of `track()` to send
to GA4/Segment/PostHog without touching call sites.

Events: `landing_page_view`, `cta_clicked`, `prequal_form_started`,
`prequal_step_completed`, `prequal_contact_captured`, `prequal_form_submitted`,
`partial_lead_saved`, `green_lead`, `yellow_lead`, `red_lead`.

---

<a name="seo"></a>
## 12. SEO

Per page: title, meta description, **canonical URL**, OpenGraph + Twitter tags
(in `app/[vertical]/page.tsx`), and **FAQ JSON-LD** structured data.
Site-wide: generated `sitemap.xml` and `robots.txt` (`/api` and `/thank-you`
disallowed). Set `NEXT_PUBLIC_SITE_URL` so canonical/OG/sitemap use your real
domain.

---

<a name="deploy"></a>
## 13. Deploy to Netlify

1. Connect this repo to a new Netlify site (build settings come from
   `netlify.toml`; the official `@netlify/plugin-nextjs` runtime is used so the
   API route deploys as a function).
2. Add the environment variables from [Configure HubSpot](#configure-hubspot)
   (at minimum `HUBSPOT_PRIVATE_APP_TOKEN` and `NEXT_PUBLIC_SITE_URL`).
3. Deploy. Point your domain at the site.

Build command `npm run build`, Node 20 (pinned in `netlify.toml`).

---

<a name="multi-domain"></a>
## 14. Future: multiple domains (Option C) — without losing central maintenance

If a vertical ever needs its own domain (brand or paid-media reason), you keep
**one repo**:

1. Create another Netlify site pointed at **this same repo**.
2. Set `SITE_VERTICAL=<slug>` in that site's environment.

That deployment then serves only that vertical (home, sitemap, footer, and
`generateStaticParams` all respect `SITE_VERTICAL` via `getActiveVerticals()`),
on its own domain — while every site still builds from the same source and feeds
the **same HubSpot backend**. One codebase remains the single source of truth.

---

<a name="crawlers"></a>
## 15. Future: crawler / traffic automation hooks (not built yet)

This foundation is designed so automation can plug in later **without rework**:

- **Config-driven pages:** new campaign / city / industry pages = new entries in
  `landingPagesConfig.ts`. A future generator can append configs programmatically.
- **CRM-agnostic intake:** `submitLeadToCRM()` + `/api/lead` accept the same
  `LeadData` shape, so imported lead lists or outreach tools can post leads
  through the identical path (with scoring + partial logic applied).
- **UTM-native:** every lead already carries UTM attribution for campaign routing.
- **Event stream:** the `analytics` CustomEvent / `dataLayer` can feed content
  ideas, trigger-based outreach, and dashboards.

No crawlers or automated posting are included in this build (out of scope).
