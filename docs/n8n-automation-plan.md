# FundVella → n8n Automation Consolidation Plan

**Date:** 2026-06-08
**Source:** reconciled from 5 Opus agents (inventory/de-dup, n8n architecture, AgentsNess agent layer, security/compliance, migration/cost).
**Status:** PLAN — nothing built or disabled yet. Building needs an n8n instance + credentials (see "What you provide").

---

## 1. The decision (one paragraph)

Make **n8n the single automation hub**, **HubSpot the system of record**, and the **Next.js app a thin event emitter**. `app/api/lead` keeps validating and writing Contact/Company/Deal to HubSpot exactly as today, and additionally fires one **signed, fire-and-forget POST to an n8n "lead.captured" webhook** (inside the existing `after()` block, so it never blocks the 200 or breaks capture). n8n owns all follow-up (speed-to-lead, partial win-back, cold nurture, cold triage, hot/warm reminders, post-funding reviews/renewals), reads/writes HubSpot, and sends through **Resend**. The **AgentsNess agents** (existing + a few net-new) are the "brains," invoked only where judgment or copy is needed, on **free LLM tiers** with a hard no-PII rule. New recurring cost: **~$5/month** (a self-hosted n8n VPS); everything else stays on free tiers at current volume.

```
                       (1) write CRM (existing, unchanged)
 Lead → app/api/lead ───────────────────────────────► HubSpot (Contact/Company/Deal)
   │         └─(2) POST signed "lead.captured" ──► n8n Ingest Webhook        ▲
   │                                                      │                  │ (3) writeback
   │                                            ┌─────────┴─────────┐        │ props/stage/
   │                                            │ n8n orchestration │◄─ AgentsNess (free LLM)
   │                                            │ WF0..WF5 + triage │        │ task/note
   │                                            └────────┬──────────┘────────┘
   │                                            (4) Resend emails
 HubSpot stage / lead_category change ─(HubSpot Workflow custom webhook, v3-signed)─► n8n CRM-Event WF
```

---

## 2. What stays in-app / moves to n8n / gets disabled

| Job | Today | Future | Why |
|---|---|---|---|
| `/api/lead` capture + honeypot + completeness | in-app | **KEEP IN-APP** | Synchronous to the form submit |
| Scoring + band (`lib/leadScoring.ts`) | in-app | **KEEP IN-APP** (single scoring authority) | Band must exist the instant the lead lands; n8n reads, never recomputes |
| `/api/unsubscribe` (HMAC one-click) | in-app | **KEEP IN-APP** | Links are baked into sent emails; one signer, one secret |
| Partial win-back (3 emails) | in-app cron | **MOVE TO n8n** | Time-delayed drip = n8n's job |
| Cold educational (4 emails) | in-app cron | **MOVE TO n8n** | Same |
| Cold-lead triage (escalate/disqualify) | in-app | **MOVE TO n8n** | Threshold logic + SDR alert on HubSpot data |
| Speed-to-lead (owner assign + "call now" task) | **missing today** | **BUILD IN n8n** (Phase 1, highest ROI) | Net-new; nothing to collide with |
| Hot/Warm reminders | manual (SDR) | **n8n drafts + reminds; SDR sends** | Keep the human boundary you set |
| Post-funding reviews + renewals (W5) | spec only | **BUILD IN n8n** | Net-new; feeds real testimonials |
| In-app nurture cron (`netlify/functions/nurture-cron.mts`) | live | **DISABLE** after n8n parity | Replaced by n8n schedule/triggers |
| HubSpot W1–W5 workflows | spec (maybe ON) | **DISABLE any that are ON** | Exact duplicates of the above → double-send risk |

**Single sources of truth:** HubSpot = data · `lib/leadScoring` = score · n8n = automation · Resend = email · in-app `/api/unsubscribe` = opt-out · existing `nurture_track`/`nurture_step`/`nurture_last_sent`/`hs_lead_status` props = sequence state (n8n adopts these, never reinvents).

---

## 3. Architecture decisions

- **Capture event:** dual-write. App → HubSpot (unchanged) **and** App → signed n8n webhook. Do **not** trigger follow-up off HubSpot create-webhooks (they lag the multi-call CRM write and can fire before the Deal exists).
- **Inbound HubSpot → n8n** (for changes that happen *inside* HubSpot, e.g. stage = Funded): use **HubSpot Workflow "send a webhook" actions** (Operations Hub) with **`X-HubSpot-Signature-v3`** verification (HMAC-SHA256 of method+URI+rawBody+timestamp, reject if >5 min old). Avoid the n8n HubSpot Trigger node — it only supports one active subscription. Polling (Schedule + Search with a `hs_lastmodifieddate` high-water mark) is the fallback.
- **Outbound n8n → HubSpot:** HubSpot node for common ops + HTTP Request node (existing Private App token) for v4 associations/batch upserts; port the safe-retry (drop `PROPERTY_DOESNT_EXIST`, retry) into a Code node.
- **Idempotency:** reuse the exact Resend `Idempotency-Key` = `nurture_{id}_{track}_{step}` and the `nurture_*` state props, so even a brief cron/n8n overlap collapses duplicates.

**n8n workflows to build:** WF0 Ingest & Router · WF-CRM-Event (HubSpot change listener) · WF1 Hot speed-to-lead · WF2 Warm · WF3 Cold · WF4 Partial win-back · WF5 Post-funding reviews/renewals · WF-Cold-Triage (scheduled).

---

## 4. Agent layer (rules-first; AgentsNess as brains; free tokens)

**Rules in n8n (NO tokens):** the triage score, enrichment API calls, data hygiene, and the **compliance hard-gate** (regex blocklist for "guaranteed/approved", enforce "you may qualify", require unsubscribe + address, check consent/suppression). These must stay deterministic — never an LLM in the path that decides or sends.

**LLM only for generation** (drafting, cold-educational content, review-request copy), on free tiers with failover:
- **Groq free** = default drafting brain (fast, short copy).
- **Gemini free** = long-context/batch content — **but it can train on free-tier data, so mask/strip PII** or route PII-bearing prompts to **Ollama/local**.
- Add n8n retry + provider failover (Groq → Gemini → local); free tiers have no SLA.

**Job → brain map:**
| Job | Brain | Mode |
|---|---|---|
| Promising-cold judgment (borderline only) | **NEW: MCA Lead Triage Agent** (+ Pipeline Analyst) | rules first, LLM on de-identified borderline records |
| Hot/warm outbound copy | **NEW: Funding Outreach Drafter** (+ Outbound Strategist, Humanizer) | LLM → **draft only, SDR sends** |
| Cold-educational content | Content Creator + Email Marketing Strategist + Humanizer | LLM, batch, auto-send after gate |
| Post-funding review request | Customer Success Manager + Content Creator | LLM, light personalization |
| Review vetting before it touches the site | **NEW: Testimonial Compliance Reviewer** | rules + LLM second-pass, human approves |
| Enrichment normalize | **NEW: Lead Enrichment Normalizer** (+ Data Engineer) | API + thin LLM |
| Compliance hard-gate | Legal Compliance Checker / Compliance Auditor | rules (regex), LLM optional 2nd pass |

**Net-new agents to add to the AgentsNess repo** (the library has no lead-scoring/triage agent): MCA Lead Triage Agent, Funding Outreach Drafter, Testimonial Compliance Reviewer, Lead Enrichment Normalizer. I can author these definition files when we build.

**Human-in-the-loop:** agents **draft** hot/warm into a HubSpot task/note or Gmail draft; the SDR sends. Auto-send only for clean, opt-in, templated cold-educational + post-funding, and only after the compliance gate.

---

## 5. Security & compliance must-haves (non-negotiable)

- **P0 Cutover:** disable each old sender (in-app cron + any ON HubSpot workflow) in the **same change window** its n8n replacement goes live. Replicate the exact idempotency key + state props so a brief overlap can't double-send. Prefer a tiny gap over an overlap.
- **P0 PII never to a free LLM:** no names/email/phone/business or bank-activity signals (NSFs, revenue, balance owed, statements) to Groq/Gemini free. LLM sees **de-identified context only** (band, vertical, "score 18") and is **never** in the send/consent/scoring path.
- **P0 Opt-out = one source of truth, re-checked at send time:** re-read `marketing_consent_status` immediately before every send; mirror opt-outs into Resend suppression (+ an SMS opt-out store if SMS is added).
- **P0 Harden n8n:** strong `N8N_ENCRYPTION_KEY`, secrets only in the credential store, network-isolated, UI behind SSO/MFA; **verify signatures on every inbound webhook** (HubSpot v3 + a shared app→n8n HMAC `N8N_INGEST_SECRET`).
- **P1 Split `NURTURE_SECRET`** into `NURTURE_RUN_SECRET` + `UNSUB_SIGNING_SECRET` (one currently both gates the run and signs unsubscribe links — rotating it would dead-link every unsubscribe). One signer, one secret, unchanged across cutover.
- **P1 Disclose new sub-processors** (n8n + chosen LLM) in the Privacy Policy + DPAs before live PII flows. (Goes in your compliance pass.)
- **P1 Reliability:** global Error Workflow + retry/backoff on HubSpot/Resend nodes; dead-letter; volume + error-rate alerts for the first 48h of each cutover (spike = overlap, zero = gap).

---

## 6. Phased migration (with rollback)

- **Phase 0 — Stand up n8n, change nothing.** Hetzner VPS + Docker + HTTPS; add credentials; build workflows **inactive**. Rollback: destroy VPS.
- **Phase 1 — Speed-to-lead** (net-new, highest ROI, nothing to collide with): owner round-robin + "call now" task + notify; hot = 5-min flag. Rollback: deactivate the n8n flow.
- **Phase 2 — Partial + cold + triage** (the parts the cron runs today): rebuild reading the same state props/offsets/idempotency keys; run **parallel one cycle with the cron still on** (identical keys prevent double-send), verify, then **disable the in-app cron**. Rollback: re-enable cron, deactivate n8n flows.
- **Phase 3 — Hot/Warm (W1/W2)** into n8n, one at a time, parallel-then-cutover; turn off the HubSpot workflow only after the n8n one is proven.
- **Phase 4 — W4 partial + W5 post-funding/renewals.** Pick one owner for partial (n8n) and disable the other.
- **Phase 5 — AgentsNess brains + decommission.** Wire the LLM draft/triage/review steps; once a full clean cycle passes, remove the cron function from the repo (keep `/api/lead`).

---

## 7. Cost (cheapest viable)

| Component | Choice | Cost |
|---|---|---|
| n8n | Self-host Community Edition, Docker, Hetzner CX22 (2 vCPU/4 GB) | **~$5/mo** |
| HubSpot API | existing Private App token | $0 (well under 250k/day) |
| Resend | Free (3,000/mo, 100/day) | $0 until volume (then $20/mo) |
| LLM | Gemini Flash free + Groq fallback (+ Ollama for PII) | $0 |

**Total new recurring: ~$5/month.** (n8n Cloud Starter is €20/mo / 2,500 executions — avoid for a cost-conscious build; the long multi-day Waits also favor a durable self-host with queue mode.)

> Note: HubSpot **Workflows + the Automation v4 API** (to script-disable workflows) require a paid Hub tier that includes Workflows. If you're not on that tier, W1–W5 may not exist at all, and disabling is moot / UI-only.

---

## 8. How to find + disable HubSpot workflows (your step — MCP can't)

1. HubSpot → **Automation → Workflows**: note each one's name, type, **On/Off**, enrolled count. Several of W1–W5 may not exist.
2. For each that is ON: record its enrollment trigger + suppression lists (to replicate in n8n); decide whether enrolled contacts finish in HubSpot or hand to n8n.
3. Toggle **Off** (keeps history) — only after the n8n replacement is verified.
4. (Optional) The Automation v4 API (beta) can enumerate/toggle workflows, but a one-time UI disable is safer.

---

## 9. What you decide / provide

**Recommended defaults (say "yes" to accept):**
- Hot/warm = **agents draft, you send** (matches your stated preference). ✅
- SMS = **skip for now** (email-only) until you add a provider — avoids TCPA/STOP build. ✅
- n8n = **self-host (~$5/mo)** over Cloud. ✅
- Partial win-back owner = **n8n** (disable in-app cron + HubSpot W4). ✅
- W5 testimonials = **human-approve** (n8n drafts/collects; you approve before it hits the repo). ✅
- cal.com → HubSpot sync = **defer** (cal.com's native integration or a later n8n job). ✅
- LLM = **Groq default, Gemini for batch (PII masked), Ollama for anything PII-bearing.** ✅

**You must provide to build:** the n8n instance (VPS or Cloud) + HTTPS URL + admin login; HubSpot owner IDs (round-robin) + SLA; confirmation of which HubSpot W1–W5 are actually ON + your HubSpot tier; `BUSINESS_ADDRESS`, `SDR_ALERT_EMAIL`; free Gemini + Groq keys; (optional) Slack webhook.

**Open decisions:** keep nurture copy in `lib/nurtureEmails.ts` (n8n fetches) vs author in n8n; whether AgentsNess personas live in a callable file/endpoint vs pasted into n8n LLM nodes.

---

## 10. What I can do now (no infra needed)

- Add the **app → n8n webhook emitter** behind an `N8N_INGEST_URL` env (no-op until set) so capture events are ready to flow.
- **Split `NURTURE_SECRET`** into run + unsub-signing secrets (safe pre-launch).
- Author the **4 new AgentsNess agent definitions** (as files to drop into the AgentsNess repo).
- Disclose **n8n + LLM** as processors in the Privacy Policy (fold into your compliance pass).

The actual n8n workflow build (Phase 0+) starts once you stand up the instance and hand me the credentials.
