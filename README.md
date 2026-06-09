# FundVella — Funding Funnel + Capture Engine

Conversion-optimized, compliance-aware landing pages for SMB / MCA funding
verticals, **plus a thin capture backend** that feeds an automation-driven CRM.
**One codebase → one site → many routes**, all driven by a shared config.

---

## Architecture — the engine

```
  FundVella (self-generated) ── landing pages → prequal / stress-test / deep application ─┐
                                                                                          ├─►  capture
  FinBiz (handed over) ──────── Google Sheet → POST /api/import/finbiz ───────────────────┘      │
                                                                                                 │  score server-side,
                                                                                                 │  tag with `leadBrand`,
                                                                                                 ▼  emit ONE signed event
                                                                                               n8n  ── the brain
                                                                                                 │   enrich · route · warm
                                                          ┌──────────────────────────────────────┴───────────────────────────┐
                                                          ▼                                                                    ▼
                                               Supabase (system of record)                                      HubSpot (the human's board)
                                               leads · enrichment · activity                                    thin deal on a per-stream
                                               — the machine's flexible layer                                   pipeline, worked → FUNDED
```

- **Two distinct streams, one engine.** FundVella (this funnel) and FinBiz
  (imported) both flow through the *same* signed event bus, kept distinct only by
  `leadBrand`. Streams are defined once in [`lib/streams.ts`](lib/streams.ts) —
  adding a third is a config entry, not new plumbing.
- **The site never writes to the CRM.** It captures, scores, and emits a signed,
  idempotent domain event ([`lib/server/events.ts`](lib/server/events.ts) +
  [`forward.ts`](lib/server/forward.ts)). **n8n owns all CRM/datastore writes.**
  Events HMAC-sign with `NURTURE_SECRET` and dead-letter to Netlify Blobs if n8n
  is unreachable, so nothing is lost before the brain is wired.
- **Supabase is the malleable system-of-record; HubSpot is a thin working board.**
  The rich data lives in Supabase (n8n-controlled, infinitely flexible). HubSpot
  holds only the deal the closer works to funded — so its schema is set once and
  never wrestled, and the working surface can be swapped later without data loss.

### Status — what's wired vs in progress
- ✅ Capture, server-authoritative scoring, signed event bus + dead-letter, both ingest pipes.
- ✅ Stream registry + `leadBrand` stamped on every event (`schemaVersion: 2`).
- 🚧 n8n consumer (writes deals → Supabase + thin HubSpot pipeline) — being built.
- 🚧 HubSpot deal pipelines (FundVella / FinBiz) — pending Sales Hub Starter (2-pipeline tier).

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

The full UI works with **no configuration**. With no `APPLICATION_WEBHOOK_URL`
or `NURTURE_SECRET`, captures still complete and their events are written to the
dead-letter store to replay once n8n is connected.

---

## 2. The two lead streams

Both run on one engine; they differ only by their entry and their `leadBrand` tag
(see [`lib/streams.ts`](lib/streams.ts)).

| Stream | Entry | Data | `leadBrand` |
|---|---|---|---|
| **FundVella** | this funnel — prequal, Cash-Flow Stress Test, deep `/apply` wizard | rich | `FundVella` |
| **FinBiz** | `POST /api/import/finbiz` (a client's Google Sheet) | thin | `FinBiz` |

The FinBiz import is key-authed (`x-fundvella-key: <NURTURE_SECRET>`) and emits
the **same** `lead.captured` event as a web capture — so the brain enriches,
routes, and writes both identically.

```bash
curl -X POST https://<site>/api/import/finbiz \
  -H "x-fundvella-key: $NURTURE_SECRET" -H "content-type: application/json" \
  -d '{"leads":[{"email":"owner@shop.com","firstName":"Sam","phone":"5551234567","businessName":"Sam'\''s Auto"}]}'
```

---

## 3. Backend map

```
app/api/
  lead/route.ts                 Prequal capture → score → emit lead.captured
  application/route.ts          Deep-app autosave + resume; emits application.abandoned (+ T+0 resume email)
  application/submit/route.ts   Final submit → encrypt SSN, persist, emit application.submitted
  application/plaid/*           Plaid link-token + exchange (bank connect)
  application/upload/route.ts   Signed-URL upload for bank statements
  import/finbiz/route.ts        Pipe 2 — batch import → emit lead.captured (FinBiz)
lib/
  streams.ts                    Stream registry (the per-stream config seam)
  leadScoring.ts                Server-authoritative score + Green/Yellow/Red band
  application.ts                Deep-app model, validation, redaction, leadProfile
  server/events.ts              Canonical event envelope + dedup keys + temperature
  server/forward.ts             Signed, retried, dead-lettered delivery to n8n
  server/store.ts               Application persistence (Supabase → Netlify Blobs → memory)
  server/secure.ts              AES-256-GCM SSN tokenization
  server/email.ts               Magic-link resume email (Resend, optional)
```

**The event contract** ([`lib/server/events.ts`](lib/server/events.ts)): every
event is one `FvEnvelope` — `event`, `eventId` (audit), `idempotencyKey` (n8n
dedups on this), `leadBrand` (the stream + attribution axis), `source`,
`schemaVersion`, a `test` flag, and a `data` payload. Raw SSN and signature
images **never** ride on an event — only `ssnLast4` and flags.

---

## 4. Edit a vertical's content

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

## 7. Environment variables

All optional for the UI; set what the backend needs. Full list + notes in
[`.env.example`](.env.example). The headline ones:

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG/sitemap base URL (set before first build). |
| `APPLICATION_WEBHOOK_URL` | n8n webhook events are sent to. Unset → events dead-letter for replay. |
| `NURTURE_SECRET` | Shared key: HMAC-signs events **and** authorizes the FinBiz import. |
| `APPLICATION_ENC_KEY` | 32-byte key for AES-256-GCM SSN encryption. Unset → SSN never stored. |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Application persistence + system-of-record. Unset → Netlify Blobs. |
| `PLAID_CLIENT_ID` / `PLAID_SECRET` | Optional bank-link (falls back to file upload). |
| `RESEND_API_KEY` | Optional direct resume emails (else routed through n8n). |

> The site holds **no CRM token** — HubSpot is written by n8n, which owns that
> credential.

---

## 8. Deploy

Connect this repo to **Netlify** (settings come from `netlify.toml`; the official
`@netlify/plugin-nextjs` runtime) or to Vercel. Set at least `NEXT_PUBLIC_SITE_URL`.
Build command `npm run build`, Node 20.

### Future: multiple domains
If a vertical needs its own domain, keep **one repo**: create another site
pointed at this repo and set `SITE_VERTICAL=<slug>` in its environment. That
deployment serves only that vertical, on its own domain, from the same source.
