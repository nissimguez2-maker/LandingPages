# Project status & continuity notes

_Last updated: 2026-06-21. Orientation for the next session — also read `AGENTS.md` and `docs/product-matrix.md`._

## What this site is
**Fundvella** (Next.js) — lead-gen landing pages for a business-funding broker. Goal: maximum
contactable, qualified leads for **one** phone-working SDR. A human always follows up; nothing is
self-serve lending. Compliance rails live in **`content/compliance.ts`** (factor-rate ≠ APR,
"you may qualify" not "approved", never say "MCA" to consumers).

## Funnel shape (current)
**One front door** — the Cash-Flow Stress Test quiz (`components/CashFlowStressTest.tsx`,
`id="estimate"` on every landing page). The deep application (`/apply`,
`components/apply/ApplicationWizard.tsx`) is a **prefilled continuation**, reachable only after the
quiz — a cold hit with no prequal/draft/resume token redirects back to the quiz. The gate requires
**first name + cell** (business name + email optional). The old `/find-your-fit` quiz was **merged**
into the stress-test enrichment (home-equity → HELOC, credit band, unpaid-invoice signals, routed via
`lib/fitRouting.ts` `routeFit`) and then **removed**.

## Leads pipeline — EXTERNAL, not in this repo (important)
The app POSTs every lead to an **n8n webhook** (`lib/server/forward.ts` → `APPLICATION_WEBHOOK_URL`,
default the FundVella n8n gateway, path `/webhook/fundvella-events`). Inside the owner's n8n account:
- **"Fundvella Leads → Google Sheet"** workflow — appends **one row per person** (matched on a
  normalized Lead Key) to the **"Fundvella Leads"** Google Sheet in the owner's Drive (16
  plain-English columns), and **pings the owner's Telegram on HOT leads**.
- **"FundVella W0 Event Gateway"** (HubSpot/Supabase) exists but is **INACTIVE** — HubSpot is
  intentionally not used; the Google Sheet is the system of record. Fundvella leads are kept
  separate from the FinBiz CRM.
- Secrets (the n8n webhook key `NURTURE_SECRET`, Telegram bot token, etc.) live in **n8n + Netlify
  env vars** — never commit them here. To inspect/edit the pipeline, use the n8n + Google Drive
  tools against the owner's account.

## Deploy
Netlify project **`mcapages`** → **https://fundvella.com**, auto-deploys from **`main`**. Work on a
feature branch → PR → squash-merge to `main` → Netlify builds. Static images in `public/media/` are
cached by filename — hard-refresh (or version the path) after swapping one.

## Deferred / open next-steps
- Deeper **mobile polish** (best validated on a real device).
- Finish migrating the **inline compliance copy** scattered across pages/articles to
  `content/compliance.ts` (the source of truth; `DisclaimerBlock` + the hero already use it).
- Build the **PostHog funnel** insight (events already fire; `deepapp_started` carries a `source`):
  `landing_page_view → stresstest_started → stresstest_contact_captured → stresstest_cta(apply) →
  deepapp_submitted`, with `booking_confirmed` parallel.
- **Decision point:** after watching real usage, decide whether to keep / trim / retire the deep
  `/apply` application (it currently serves the ready-now self-server).

## Guardrails
- The stress test is a **protected area** (see `AGENTS.md`) — change it via its config, not by
  rewriting its state machine.
- Don't reintroduce competing "front doors" or express lanes into `/apply`.
