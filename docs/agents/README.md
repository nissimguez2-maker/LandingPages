# New AgentsNess agents for FundVella automations

These four agents were authored for FundVella's n8n automation hub. They do not
exist in the AgentsNess library yet (the library has no lead-scoring/triage,
outreach-drafting, testimonial-review, or enrichment-normalizer agent), so they
are net-new. Drop each `.md` into the AgentsNess repo under the suggested division
and run your usual conversion (`scripts/`) to generate the per-tool variants.

| File | Suggested AgentsNess division | Job |
|---|---|---|
| `mca-lead-triage-agent.md` | revenue | Escalate / nurture / disqualify borderline cold leads |
| `funding-outreach-drafter.md` | revenue | Draft 1:1 hot/warm outreach for the SDR to send |
| `testimonial-compliance-reviewer.md` | marketing | Vet post-funding reviews before they touch the site |
| `lead-enrichment-normalizer.md` | operations | Normalize fields + write the SDR call note |

## How n8n invokes them
Two options (pick per your runtime):
1. **LLM node with the persona as the system prompt.** Paste the agent body into
   an n8n LLM node's system message, wire the JSON inputs, parse the JSON output.
2. **Agent runner / MCP.** Expose the personas behind an HTTP endpoint (or MCP)
   that n8n calls; lets the agent definitions live in one place (the AgentsNess
   repo) instead of being copied into each workflow.

## Two rules that apply to ALL of them
- **No PII to a free LLM.** n8n strips names, emails, phones, business names, and
  financial figures (NSFs, revenue, balances) before calling any free external
  model. Anything that must include such text runs on a local / no-retention model
  (e.g. Ollama). The triage and outreach agents are designed to work on
  de-identified context for exactly this reason.
- **Agents draft or advise; they never send and never decide a send.** The
  deterministic n8n rules layer (score, consent check, suppression, compliance
  hard-gate) owns every actual send and CRM write. Hot/warm copy is drafted for a
  human to review and send.

## How the app feeds n8n
On each capture, `app/api/lead` emits a signed `lead.captured` event to
`N8N_INGEST_URL` (see `lib/n8n.ts`). n8n verifies `x-fundvella-signature`
(HMAC-SHA256 of `${timestamp}.${body}` with `N8N_INGEST_SECRET`) and rejects stale
timestamps, then routes the event into the workflows. Full architecture:
`docs/n8n-automation-plan.md`.
