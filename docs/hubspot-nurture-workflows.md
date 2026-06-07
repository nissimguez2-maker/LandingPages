# HubSpot Nurture & Follow-up Workflows — Build Guide

These workflows must be built in **HubSpot → Automation → Workflows** (the API/MCP
can't create workflows). This is the spec: enrollment triggers, timing, branches,
copy themes, and compliance notes. Leads arrive from the site with these signals
already set, so segmentation is easy.

## Signals available on every lead
- `lead_category` = **hot / warm / cold** (from the Green/Yellow/Red score)
- `funding_readiness_score` (0–100+)
- `form_completion_percentage` (100 = full submission; < 100 = partial)
- `lead_urgency` = high / medium / low
- `marketing_consent_status` = opted_in / opted_out
- Full submissions also create a **Deal** in the MCA pipeline (stage = Prequalified - Green / Yellow / New Lead)
- `original_landing_page_url` (deep-link back to the exact vertical)

> Partial-lead detection: `form_completion_percentage < 100` **AND** `num_associated_deals = 0`.
> (Cleaner option: create a `lead_capture_stage` property + set `HUBSPOT_WRITE_LIFECYCLE=true` in Netlify, then enroll on `lead_capture_stage = partial`.)

## Compliance rules (apply to all)
- **Marketing emails** → only to `marketing_consent_status = opted_in`; include physical
  address + one-click unsubscribe (CAN-SPAM). **Suppress** anyone unsubscribed.
- **1:1 sales follow-up** to a person who just submitted an inquiry is transactional —
  fine — but still honor opt-outs.
- **SMS** → only to opted-in numbers; every text offers **STOP** (TCPA).
- Truthful copy only — no "guaranteed/instant approval", no fake urgency/scarcity.

---

## Speed-to-lead (applies to every new full lead)
Deal-based or contact-based. On new submission:
1. Assign an owner (round-robin).
2. Create a **task**: "Call new {{lead_category}} lead — {{firstname}} ({{company}})".
3. Notify the owner (email/Slack).
4. **Hot leads: call within 5 minutes.** Speed-to-lead is the #1 conversion lever.

---

## Workflow 1 — Green / Hot  (Deal-based)
**Enroll:** `lead_category = hot` (deal in *Prequalified - Green*).
- **0 min** — Internal: owner task "Call now" + notify.
- **5 min** — Email A1 *(sales)*: "We got your funding request — quick call?" + scheduling link.
- **1 hr** (if stage not advanced) — SMS *(if opted-in)*: "Hi {{firstname}}, it's {{company}} re: your funding request — good time for a quick call? Reply STOP to opt out."
- **1 day** — Email A2: "What to have ready" (3–4 months bank statements) + what to expect.
- **3 days** — Email A3: gentle nudge + scheduling link.
- **7 days** (no contact) — Task: final call attempt → then move deal to **Nurture**.
- **Exit:** contact made or deal stage advances past Prequalified.

## Workflow 2 — Yellow / Warm  (Deal-based)
**Enroll:** `lead_category = warm` (deal in *Prequalified - Yellow*).
- **0–15 min** — Owner task + Email B1: "Here's what strengthens your review" (docs checklist, what underwriting looks at).
- **2 days** — Email B2: address common concerns (recent NSFs, < 1 yr in business, past credit) — reassurance, compliant framing.
- **5 days** — Email B3: "Ready when you are" + scheduling link.
- **7 days** — Owner task to call.
- **14 days** (no engagement) — move to **Nurture** (Workflow 3).
- **Exit:** engages / books / advances.

## Workflow 3 — Red / Cold (educational nurture)  (Contact- or Deal-based)
**Enroll:** `lead_category = cold` (or moved here from W1/W2).
Low-pressure, value-first, every 5–7 days, ~4–6 emails over 60–90 days:
- C1: "Why you may not be ready yet — and how to get there" (build consistent deposits, reduce NSFs, hit 6+ months).
- C2: "What lenders actually look at" (revenue, bank activity, time in business).
- C3: "Common mistakes that stall funding".
- C4: "When to come back" + link to re-check readiness (the prequal form).
- **Re-score:** if they resubmit and score improves, they re-enter W1/W2 automatically.
- **Exit:** resubmits / requests contact / unsubscribes.

## Workflow 4 — Partial / Abandoned win-back  (Contact-based)
**Enroll:** `email is known` AND `form_completion_percentage < 100` AND `num_associated_deals = 0` (created in last 30 days).
- **15 min** — Email D1: "You're almost there — finish your funding check" → button to `original_landing_page_url`.
- **1 day** — Email D2: "Still want us to review your file?" (1-line value + link).
- **3 days** — SMS *(if opted-in)*: short nudge + link + STOP.
- **7 days** — Final email; then exit to **Workflow 3 (Cold)**.
- **Exit / suppress:** completes the form (→ becomes full lead) or unsubscribes.

## Workflow 5 — Post-funding: collect REAL reviews + renewals  (Deal-based)
**Enroll:** deal stage = **Funded**.
- **+14 days** — Email E1: "How did it go? Mind sharing a quick review?" → link to a HubSpot form / review site. **This is how the site's testimonial slots get filled with real, compliant testimonials.**
- Capture the response; once you have a real quote + name/role, add it to that vertical's `testimonials` in `content/landingPagesConfig.ts` and it appears on the site automatically.
- **At `renewal_eligible_date`** — enroll in a **Renewal Opportunity** sequence (move deal to *Renewal Opportunity* stage, owner task, "ready for more capital?" email).

---

## Email copy starters (compliance-safe)
Subject lines (A/B a couple):
- Hot: "Quick call about your funding request?" · "{{firstname}}, let's review your options"
- Warm: "A few things that strengthen your file" · "Here's what helps your funding review"
- Cold: "Getting your business funding-ready" · "What lenders look at (and how to get there)"
- Partial: "You're almost done — finish your funding check" · "Still want us to take a look?"
- Review: "How did your funding go?" · "Quick favor — a 1-line review?"

Body guardrails: lead with value, one clear CTA, keep "you may qualify / approval depends
on underwriting / no obligation", never promise amounts or timing, always include
unsubscribe + business address on marketing emails.

## How to build each (HubSpot)
Automation → Workflows → Create →
1. Pick **Deal-based** (W1, W2, W5) or **Contact-based** (W3, W4).
2. Set the **enrollment trigger** (filters above). Enable re-enrollment where noted.
3. Add **delays**, **if/then branches**, **send email**, **create task**, **send internal notification**, **send SMS** (if you have the SMS add-on).
4. Set **suppression lists** (unsubscribed / opted-out) and **goal/exit criteria**.
5. Turn on. Start with W1 + W4 (highest ROI), then add the rest.
