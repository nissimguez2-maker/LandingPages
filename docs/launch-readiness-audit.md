# FundVella Launch-Readiness Audit (Master Plan)

**Date:** 2026-06-08
**Method:** 41 Opus agents (AgentsNess roster) in 8 groups, 3 waves, each group's members feeding a group leader, all 8 leaders feeding one Leader-of-Leaders reconciler. Read-only audit; spot-checks confirmed in-repo.
**Status:** 🔴 NO-GO until the P0 set is cleared.
**Guardrails honored in every proposed fix:** no em-dashes, plain ESL English, MCA-led, never name competitors, keep compliance language ("you may qualify", "approval depends on underwriting", factor rate is not an APR, estimate not an offer, FundVella is not the lender).

---

## 1. Verdict

NO-GO until the P0 set is cleared. Three independent issues each block launch on their own:

1. **Unlawful / unprovable claims.** Literal legal placeholders ship live; "No credit check" contradicts the site's own disclosures; unqualified "does not hurt your credit" guarantees across ~12 verticals; "flexes with a slow week" repayment language is deceptive for fixed daily/weekly ACH products; consent proof (text/version/timestamp/source) is never stored; no CCPA/CPRA notice.
2. **The lead pipeline is broken end to end.** The Green (hot) band needs 70 points but the live quiz can only reach 65 (bank-statements +20 and NSF -25 are no longer asked before scoring), so the entire hot route is dead; booked calls never create a Deal; no owner/speed-to-lead task is created, so even warm leads are invisible.
3. **Intake and analytics lose data and money.** `/api/lead` awaits ~9 sequential HubSpot calls before responding and can exceed Netlify's 10s function limit; the hero image is lazy-loaded (LCP); there are no security headers; and `booking_confirmed` (the SDR's #1 metric) undercounts.

Clear Batches A through C (and the P0 list) and the site is launchable.

---

## 2. Cross-group conflicts, resolved

- **PainReliefSection → RENDER it (do not delete).** The component is production-ready and self-guards (`if (!pr) return null`); `painRelief` content is already authored for ~11 verticals; `app/page.tsx` has a natural slot. It is wired-up-pending content, not dead weight. (This is the only "unused section" to render; the rest are deleted.)
- **"No credit check" → reword, scoped to prequal.** Remove the blanket claim everywhere. Where intent is "a soft check won't ding you": "Checking your options here does not affect your credit score. A full review may include a credit check."
- **"Flexes with a slow week" → reframe to fixed.** Describe a set daily or weekly payment honestly. Reserve any "flexes with sales" language strictly for true split/holdback products if any exist.
- **Green band → rebalance thresholds (do NOT re-add quiz questions).** The quiz was deliberately shortened; re-adding friction undoes a conversion decision. Lower Green (e.g. to ~60) or redistribute weights so a strong file reachable from the live quiz can land Green; re-score and upgrade when optional enrichment supplies bank-statements.
- **Dead CalculatorConfig → delete now, backlog the feature.** The current per-vertical calculator config is dead and untrusted; delete it for launch and open a post-launch item to build a compliant gated calculator if desired.

---

## 3. P0 launch-blockers (de-duplicated, ranked)

Tags: **CODE** = fixable in-repo. **OWNER** = needs the human (env, counsel, photos, webhook/plan, HubSpot props, domain, address, testimonials). Effort: S / M / L.

### A. Compliance & legal
| # | Finding | Files | Fix | Eff | Tag |
|---|---|---|---|---|---|
| 1 | Legal placeholders (`[your contact email]`, `[your state/jurisdiction]`) ship live | `app/privacy/page.tsx`, `app/terms/page.tsx` | Insert real entity, email, governing-law state, mailing address | S | OWNER values + CODE wiring |
| 2 | "No credit check" deceptive vs own disclosures | `content/stressTest.ts:17,184`, `content/landingPagesConfig.ts` | Remove; reword scoped to prequal | M | CODE + counsel |
| 3 | "Does not hurt your credit score" unqualified guarantee (~12 verticals) | `content/landingPagesConfig.ts` reassurance arrays | Qualify to "starting does not trigger a hard credit check" | M | CODE + counsel |
| 4 | "Flexes with a slow week" UDAAP/deceptive for fixed ACH | `content/landingPagesConfig.ts:97`, `content/stressTest.ts` FIT_COPY, 3 holdback glossaries | Reframe to fixed daily/weekly payment | M | CODE + counsel |
| 5 | Consent unprovable (text/version/timestamp/source not stored; proof behind default-off flag) | `lib/hubspot.ts:164-173`, lead intake, field map | Store consent text + version + UTC timestamp + source URL on every opt-in; create HS props; enable by default | M | CODE + OWNER (props) |
| 6 | No CCPA/CPRA notice / Do-Not-Sell-or-Share; no CA SB 362 (Jan 2026) financing/estimate-vs-APR note | `app/privacy/page.tsx`, `app/disclosures/page.tsx` | Add CA rights section + Do-Not-Sell-or-Share + state disclosure | M | OWNER (counsel) + CODE |
| 7 | `BUSINESS_ADDRESS` unset/placeholder = CAN-SPAM violation | `.env`, `lib/nurtureEmails.ts:101-102`, legal pages | Set real mailing address env; render in footer + legal pages; block send if placeholder | S | OWNER value |

### B. Lead pipeline & CRM
| # | Finding | Files | Fix | Eff | Tag |
|---|---|---|---|---|---|
| 8 | **Green/hot band unreachable** (max 65, needs 70) → hot route dead | `lib/leadScoring.ts:40-93,117` | Rebalance thresholds/weights; re-score on enrichment | M | CODE |
| 9 | Booked calls never create a Deal (`onCalBooked` sends `partial:true`) | `components/CashFlowStressTest.tsx:155`, `lib/hubspot.ts:381` | On booking, submit non-partial so a Deal is created | M | CODE |
| 10 | No owner/queue/speed-to-lead task → hot/warm leads invisible | `lib/hubspot.ts:362-405` | Assign owner + create "call now" task on hot/warm | M | CODE + OWNER (owner IDs) |
| 11 | `pollResponses` + `notes` + `priorities` collected/typed but never written to HubSpot | `lib/hubspot.ts`, field map | Map and write these properties | M | CODE + OWNER (props) |
| 12 | Triage overloads standard `hs_lead_status` as idempotency marker (collides with SDR workflow; skips touched leads) | `app/api/nurture/run/route.ts:253,260,279` | Use a dedicated custom `triage_status` property | M | CODE + OWNER (prop) |
| 13 | `SDR_ALERT_EMAIL` unset → escalations silent | `.env`, alert code | Set env; log loudly if unset while escalating | S | OWNER value |
| 14 | Unsubscribe GET opts out on prefetch/scan | `app/api/unsubscribe/route.ts:46-56` | Require POST confirm; verify HMAC (see #28) | M | CODE |

### C. Intake, performance, analytics
| # | Finding | Files | Fix | Eff | Tag |
|---|---|---|---|---|---|
| 15 | `/api/lead` awaits ~9 sequential HubSpot calls (8s each); can exceed Netlify 10s; no early 200 | `app/api/lead/route.ts:48`, `lib/hubspot.ts:362-405` | Respond 200 once contact validates; background/parallelize CRM writes | M | CODE |
| 16 | Hero LCP lazy-loaded; no width/height (CLS) | `components/MediaFigure.tsx:22-27`, `HeroSection.tsx` | Eager + fetchpriority on hero; set width/height | M | CODE |
| 17 | No security headers / CSP | `netlify.toml` | Add HSTS, X-Content-Type-Options, X-Frame, Referrer-Policy, CSP (allow cal.com/PostHog/Clarity/HubSpot/Resend) | M | CODE |
| 18 | `booking_confirmed` undercounts (only inline fires; fallback link + popup redirect off-page) + double-fires elsewhere | analytics + cal handlers | One handler covering inline/fallback/popup; fire exactly once | M | CODE + OWNER (cal.com webhook) |
| 19 | No consent gate before session recording + Clarity | `components/analytics/Analytics.tsx:20-51` | Gate recording/analytics behind consent (EU banner) | M | CODE |
| 20 | PostHog `$pageview` double-fires; `identify()` never called; no `stresstest_viewed`; no amount/value on lead events | `lib/analytics.ts`, `Analytics.tsx:34,57` | Single pageview; identify on contact capture; add view event + value props | M | CODE |
| 21 | Progress bar shows 0% on Q1, never 100% | `components/CashFlowStressTest.tsx:296` | Use `(stepIdx+1)/STEPS` | S | CODE |

### D. Conversion & UX correctness
| # | Finding | Files | Fix | Eff | Tag |
|---|---|---|---|---|---|
| 22 | Skip-path shows fabricated tier / empty read; skip-then-Back lands at Q5 with 80% bar | `components/CashFlowStressTest.tsx:194-201,214-223,297` | Honest neutral read for skippers; Back restores correct step/progress | M | CODE |
| 23 | Strong tier gives a clean "I'm fine, leave" exit; "exploring" scores 0 exposure | `content/stressTest.ts:120-124`, `lib/stressTest.ts:68-73` | Replace the easy exit with a soft next step; future-pace "exploring" | M | CODE |
| 24 | PainReliefSection built but rendered nowhere | `app/page.tsx`, `LandingPageTemplate.tsx` | RENDER before the test (conflict A) | S | CODE |
| 25 | Exit-intent fires mid-typing; desktop+cal-only; no partial-save-on-exit | `components/CashFlowStressTest.tsx:170-184` | Suppress while a field is focused/filled; add partial save; add mobile path | M | CODE |
| 26 | Disabled "Next" + no auto-advance on single-tap steps | `components/CashFlowStressTest.tsx:361,374,...` | Auto-advance on tap | S | CODE |
| 27 | Diagnostic CTA "See Where Your Cash Runs Short" mismatches funding intent | `content/landingPagesConfig.ts:176` | "See What You May Qualify For" | S | CODE |
| 28 | Emerald `btn-primary` white text fails AA (3.77:1); OfferingsSection tile `bg-accent-600` fails AA on 7/12 accents | `lib/themes.ts:47`, `app/globals.css:20`, `components/OfferingsSection.tsx:26` | Route white-on-accent fills through `--accent-cta`; darken emerald to 700/800 | M | CODE |
| 29 | Foreign-signage photos (trucking=Turkish, auto-repair=Cyrillic) + off-message dental/cleaning/bad-credit/construction/home | `public/media/*.jpg`, config | Replace with on-message US imagery | M | OWNER (photos) |

---

## 4. P1 (high-value, right after launch)

- Spanish path (ES route + visible toggle on home/general/gate).
- ESL/jargon pass: hero `cashFlowSignature` hooks lead with COD/net-45/ROAS/AR; trade slang ("walk-in dies", "blown turbo") read literally.
- Copy de-templating: "With X in place" opener 41x, identical `dayInCashFlow` closers (11/12), compliance-phrase saturation; weak home/medical/bad-credit/restaurant headlines.
- Standardize booking CTA label (3 variants) and funnel noun (check/read/plan); rename vague "See your full plan".
- Either-or contact error binds only to phone; gate renders sub as h3 + headline as eyebrow; no inline email validation.
- En-dash "3-4" → "3 to 4" (~30 spots).
- Homepage example lows $3-5k under the $25k floor (config:1554-1556) → raise to ≥$25k.
- Holdback term in only 3/13 glossaries; `under_25k`=$15k; pair factor rate with a term; soften "Real funding ranges/$5M"; drop food-service "like 1.2".
- Vertical taxonomy: cleaning invites residential but pitch is commercial net-60; beauty mis-tagged "healthcare"; retail/ecommerce overlap; medical/dental near-twins; auto-repair omits fleet/warranty receivables.
- Result-flow: anticlimax + terminal CTA re-pitches the completed check; `cashFlowSignature` shown twice; supporting story all collapsed; SwipePoll loses its answer on Back; phone-before-email; free read gives away the full diagnostic.
- Analytics hygiene: `track()`/`result_shown`/`contact_shown` fire in render body; `lead_saved` fires before `/api/lead` resolves; `session_id` not forwarded to PostHog; Clarity events carry no props.
- Mobile: inline cal.com missing `useSlotsViewOnSmallScreen`; swipe needs iOS direction-lock + `releasePointerCapture`; text-link CTAs under 44px; no custom 404; no favicon; no OG image.
- SEO: home missing canonical/OG/Twitter/FAQPage JSON-LD; Organization JSON-LD thin; `/thank-you` not static; hardcoded analytics keys → env; no www/apex redirect; no preconnect; nurture cron @hourly vs 15-min offset.
- Pipeline: company dedupe-by-domain race; wrong default stage id (`appointmentscheduled` vs `5498908918`); empty deal amount; no-score cold lead skipped forever; disqualify gated on age not sequence-complete; revenue bands too coarse; `findDealIdForContact` no pipeline filter; archive drops suppression history; `.env.example` incomplete.
- Compliance: privacy mislabels session recording as "anonymized" + omits heatmaps; no SMS program terms (HELP/frequency) + no confirmed STOP handler; "a specialist reviews, not an algorithm" may be untrue if third-party; "you qualify for the most"/"best terms" promises; unsubscribe HMAC weak (sliced + non-constant-time + dev-secret fallback); `/api/lead` no rate limit/CAPTCHA.
- Design: focus ring invisible on navy/accent; "Change an answer" jumps to Q5; swipe no undo; gate value-exchange unclear.

## 5. P2 (polish)

- Unify the two button systems; fix back-link contrast (~3:1) and result-headline-smaller-than-setup; add a section-padding token.
- Add favicon; complete `.env.example`; replace the CRM-internal dealname em-dash (`lib/hubspot.ts:228`).
- `beforeunload` double-submit guard.
- Set `NEXT_PUBLIC_SITE_URL` + `BUSINESS_ADDRESS`; de-duplicate FAQ across 12 verticals; add legal-page canonicals.
- Delete ~700 LOC dead code: `PrequalificationFlow` (+ `FormStep`, `ProgressIndicator`, `Fields.TextArea`), 5 unused section components, dormant `CalculatorConfig` + 12 per-vertical blocks. **Keep PainReliefSection** (render it).

---

## 6. Recommended fix-pass sequence

- **Batch A — Compliance & legal (P0 #1-7).** CODE wiring + drafted copy, but BLOCKED on OWNER values + counsel sign-off. Start the OWNER asks first; wire in parallel.
- **Batch B — Pipeline + intake (P0 #8-15).** Mostly pure CODE (scoring rebalance, deal-on-booking, intake early-200, idempotency property). OWNER: owner/queue IDs, custom props, `SDR_ALERT_EMAIL`, `BUSINESS_ADDRESS`.
- **Batch C — Conversion + UX (P0 #16, 21-28).** Pure CODE except #29 photos (OWNER). Render PainReliefSection here.
- **Batch D — Perf / SEO / analytics (P0 #17-20 + SEO P1).** Mostly CODE; OWNER for OG art, domain redirect, keys-to-env, cal.com webhook.
- **Batch E — Code cleanup (P2 dead code).** Pure CODE; do last.

Pure-CODE batches that can start with no human input: **B (most), C (most), E.** Blocked on OWNER: **A**, and parts of **B/D**.

---

## 7. OWNER / external action checklist (cannot be fixed in the repo)

**Counsel sign-off (gates Batch A):**
- [ ] Final wording: remove "No credit check" (scoped credit-pull language), "flexes" → fixed-payment reframe, "best terms / qualify for the most" claims, "a specialist reviews, not an algorithm".
- [ ] CCPA/CPRA notice + Do-Not-Sell-or-Share, and CA SB 362 (Jan 2026) financing disclosure.
- [ ] SMS program terms (HELP/frequency/STOP) if SMS is used.
- [ ] Governing-law state + legal entity name.

**Env vars / values:**
- [ ] `BUSINESS_ADDRESS` (real mailing address).
- [ ] `SDR_ALERT_EMAIL`.
- [ ] Real privacy/terms contact email.
- [ ] Correct HubSpot deal default stage id (`5498908918`, not the `appointmentscheduled` label).
- [ ] `NEXT_PUBLIC_SITE_URL`; complete `.env.example`; move hardcoded analytics keys to env.

**HubSpot configuration:**
- [ ] Custom properties: pollResponses, notes, priorities, consent (text/version/timestamp/source), and a dedicated triage-idempotency field (not `hs_lead_status`).
- [ ] Owner / queue IDs for speed-to-lead routing + target SLA.

**External services:**
- [ ] cal.com webhook (or plan tier) for server-side booking capture.
- [ ] DNS www↔apex redirect.

**Creative assets:**
- [ ] Real US photos for trucking, auto-repair, dental, cleaning, bad-credit, construction, home.
- [ ] OG share image + favicon source art.
- [ ] Real testimonials (Testimonials section is empty).
- [ ] Spanish translation sign-off (P1).

---

## 8. Load-bearing findings verified in-repo

- `lib/leadScoring.ts:116-119`: Green needs `>= 70`. Live-quiz max without bank-statements/NSF = 25+20+10+10 = **65**. Bank-statements is collected only in a collapsed, post-result, optional enrichment block; NSF is not collected at all. → Green is unreachable from the quiz result.
- `app/api/lead/route.ts:48`: `await submitLeadToCRM(lead)` before the 200; `lib/hubspot.ts:362-405` runs serial upsertContact → upsertCompany → associate → findDeal → createDeal → associate ×2. → Confirms timeout risk and no early-200.
- `lib/hubspot.ts:381-383`: `lead.partial` stops at Contact, no Deal. → Booked calls (`partial:true`) create no Deal.
- `components/PainReliefSection.tsx`: self-guards; `painRelief` authored for ~11 verticals; zero references in `app/page.tsx`. → Render, don't delete.
- `netlify.toml`: no headers block at all. → No security headers / CSP.
- `content/landingPagesConfig.ts:1556`: homepage example `rangeLow: 3000`, under the $25k floor.

---

## 9. Agent roster & method

8 groups, each a leader + 4 members (all real AgentsNess agents), + 1 Leader-of-Leaders:

1. **Conversion & Persuasion** — CRO/Conversion Auditor (lead); Offer & Lead-Gen Strategist, Psychologist, Narratologist, Behavioral Engagement & Retention Designer.
2. **Copy, Voice & Localization** — Content Creator (lead); Humanizer, Technical Writer, Cultural Intelligence Strategist, Ad Creative Strategist.
3. **Domain Truth & Per-Vertical** — Product & Market Research (lead); Loan Officer Assistant, Financial Analyst, Pricing Analyst, Business Strategist.
4. **Design, Brand & Visual UX** — UX Architect (lead); UI Designer, Brand Guardian, AI Visual Generation Specialist, UX Researcher.
5. **Mobile, Accessibility & Frontend Quality** — QA Engineer (lead); Frontend Developer, Mobile App Builder, Code Reviewer & Quality, QA Reality Checker.
6. **Performance, SEO & Measurement** — SEO Specialist (lead); AI Search & Answer-Engine Optimizer, DevOps & Reliability Engineer, Tracking & Measurement Specialist, Analytics Reporter.
7. **Lead Pipeline, CRM & Automation** — Backend Architect (lead); Data Engineer, Pipeline Analyst, Email Marketing Strategist, Sales Reporting & Ops.
8. **Compliance, Legal & Security** — Legal Compliance Checker (lead); US Business Law Navigator, Compliance Auditor, Legal Document Review, Security Engineer.

Reconciler: **Agent & Workflow Orchestrator** (Leader-of-Leaders).
