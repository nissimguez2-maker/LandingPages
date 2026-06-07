import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  PARTIAL_EMAILS,
  COLD_EMAILS,
  PARTIAL_OFFSETS,
  COLD_OFFSETS,
  renderEmail,
} from "@/lib/nurtureEmails";
import { signUnsub } from "@/lib/unsubscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HS = "https://api.hubapi.com";
const MAX_SENDS_PER_RUN = 50; // bound runtime so the function never times out

const STATE_PROPS = ["nurture_track", "nurture_step", "nurture_last_sent"] as const;
const READ_PROPS = [
  "email", "firstname", "phone", "createdate", "original_landing_page_url",
  "funding_readiness_score", "hs_lead_status", ...STATE_PROPS,
];

// ── Cold-lead triage tuning (all env-overridable) ──────────────────────────
// A red/cold lead whose readiness score still lands at or above this is treated
// as "potential warm/hot hiding in the cold pile" and handed to the human.
const PROMISING_MIN = Number(process.env.NURTURE_PROMISING_MIN || 30);
// Only disqualify a weak cold lead after it has had the full cold sequence.
const DISQUALIFY_DAYS = Number(process.env.NURTURE_DISQUALIFY_DAYS || 25);
// Off by default. When "true", disqualified leads are also archived in HubSpot
// (archived contacts stay recoverable for 90 days; nothing is hard-deleted).
const DELETE_IRRELEVANT = process.env.NURTURE_DELETE_IRRELEVANT === "true";
const MAX_ALERTS_PER_RUN = 25; // don't flood the SDR's inbox in one run

type Contact = { id: string; properties: Record<string, string | null> };

function siteBase(): string {
  return (process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "https://fundvella.com").replace(/\/+$/, "");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function sameHost(url: string, base: string): boolean {
  try {
    return new URL(url).hostname === new URL(base).hostname;
  } catch {
    return false;
  }
}

async function hsSearch(token: string, filters: object[], properties: string[]): Promise<Contact[]> {
  const res = await fetch(`${HS}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ filterGroups: [{ filters }], properties, limit: 100 }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { results?: Contact[] };
  return json.results || [];
}

async function hsPatch(token: string, id: string, properties: Record<string, string>): Promise<void> {
  const res = await fetch(`${HS}/crm/v3/objects/contacts/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`patch ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function sendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubUrl: string;
  idempotencyKey: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": opts.idempotencyKey,
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: {
        "List-Unsubscribe": `<${opts.unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        Precedence: "bulk",
      },
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error("[nurture] resend error", res.status, (await res.text()).slice(0, 200));
    return false;
  }
  return true;
}

type Ctx = { token: string; apiKey: string; from: string; base: string; now: number; budget: { n: number } };

async function processTrack(
  track: "partial" | "cold",
  contacts: Contact[],
  ctx: Ctx,
): Promise<{ checked: number; sent: number; errors: number }> {
  const emails = track === "partial" ? PARTIAL_EMAILS : COLD_EMAILS;
  const offsets = track === "partial" ? PARTIAL_OFFSETS : COLD_OFFSETS;
  let sent = 0;
  let errors = 0;

  for (const c of contacts) {
    if (ctx.budget.n <= 0) break;
    try {
      const email = c.properties.email;
      if (!email) continue;

      const createdate = Date.parse(c.properties.createdate || "");
      if (!Number.isFinite(createdate)) {
        // eslint-disable-next-line no-console
        console.warn(`[nurture] skip ${c.id}: invalid createdate ${c.properties.createdate}`);
        continue;
      }

      const storedTrack = c.properties.nurture_track || "";
      const step = storedTrack === track ? Number(c.properties.nurture_step || "0") : 0;
      if (step >= offsets.length) continue; // track complete
      if (ctx.now < createdate + offsets[step]) continue; // not due yet

      const def = emails[step];
      const landing = c.properties.original_landing_page_url || "";
      const ctaUrl = track === "partial" && sameHost(landing, ctx.base) ? landing : ctx.base;
      const unsubUrl = `${ctx.base}/api/unsubscribe?u=${signUnsub(email)}`;
      const { html, text } = renderEmail(def, { firstName: c.properties.firstname || "", ctaUrl, unsubUrl });

      const ok = await sendEmail({
        apiKey: ctx.apiKey,
        from: ctx.from,
        to: email,
        subject: def.subject,
        html,
        text,
        unsubUrl,
        idempotencyKey: `nurture_${c.id}_${track}_${step}`,
      });
      if (!ok) {
        errors++;
        continue;
      }
      // Advance state. If this PATCH fails, the Resend idempotency key prevents a
      // duplicate send on the retry next run.
      await hsPatch(ctx.token, c.id, {
        nurture_track: track,
        nurture_step: String(step + 1),
        nurture_last_sent: String(ctx.now),
      });
      sent++;
      ctx.budget.n--;
    } catch (err) {
      errors++;
      // eslint-disable-next-line no-console
      console.error(`[nurture] contact ${c.id} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return { checked: contacts.length, sent, errors };
}

/** Archive a contact (recoverable in HubSpot for 90 days; not a hard delete). */
async function hsArchive(token: string, id: string): Promise<void> {
  const res = await fetch(`${HS}/crm/v3/objects/contacts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok && res.status !== 404) throw new Error(`archive ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Internal heads-up to the SDR that a cold-scored lead looks worth a call. */
async function sendSdrAlert(
  ctx: Ctx,
  to: string,
  lead: { id: string; name: string; email: string; phone: string; score: number },
): Promise<boolean> {
  const portalId = process.env.HUBSPOT_PORTAL_ID || "";
  const link = portalId
    ? `https://app.hubspot.com/contacts/${portalId}/record/0-1/${lead.id}`
    : `search "${lead.email}" in HubSpot`;
  const lines = [
    "A lead scored cold but still looks worth a personal call.",
    `Name: ${lead.name || "(none)"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "(none)"}`,
    `Readiness score: ${lead.score}`,
    `Open: ${link}`,
  ];
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f2a4a;line-height:1.6">${lines
    .map((l) => `<p style="margin:4px 0">${esc(l)}</p>`)
    .join("")}</div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${ctx.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ctx.from,
      to: [to],
      subject: `Promising lead to call: ${lead.name || lead.email}`,
      html,
      text: lines.join("\n"),
    }),
    signal: AbortSignal.timeout(10000),
  });
  return res.ok;
}

/**
 * Triage cold (red-band) full leads. Promising ones (score still near the warm
 * cutoff) are flagged OPEN and the SDR is alerted to call them personally. Weak
 * ones that already had the full cold sequence are marked UNQUALIFIED (and
 * optionally archived). hs_lead_status doubles as the "already triaged" marker,
 * so each lead is handled exactly once.
 */
async function triageCold(
  contacts: Contact[],
  ctx: Ctx,
  alertTo: string,
): Promise<{ checked: number; escalated: number; disqualified: number; archived: number; errors: number }> {
  let escalated = 0;
  let disqualified = 0;
  let archived = 0;
  let errors = 0;
  let alerts = 0;

  for (const c of contacts) {
    try {
      const email = c.properties.email;
      if (!email) continue;
      if (c.properties.hs_lead_status) continue; // already triaged

      const score = Number(c.properties.funding_readiness_score);
      if (!Number.isFinite(score)) continue; // no score yet, cannot judge

      if (score >= PROMISING_MIN) {
        // Potential warm/hot hiding in the cold pile. Flag it and ping the human.
        await hsPatch(ctx.token, c.id, { hs_lead_status: "OPEN" });
        escalated++;
        if (alertTo && alerts < MAX_ALERTS_PER_RUN) {
          const ok = await sendSdrAlert(ctx, alertTo, {
            id: c.id,
            name: (c.properties.firstname || "").trim(),
            email,
            phone: c.properties.phone || "",
            score,
          });
          if (ok) alerts++;
        }
        continue;
      }

      const createdate = Date.parse(c.properties.createdate || "");
      const oldEnough = Number.isFinite(createdate) && ctx.now - createdate >= DISQUALIFY_DAYS * 86400000;
      if (oldEnough) {
        // Tried the full cold sequence, still weak. Clear it out of the pipeline.
        await hsPatch(ctx.token, c.id, { hs_lead_status: "UNQUALIFIED" });
        disqualified++;
        if (DELETE_IRRELEVANT) {
          await hsArchive(ctx.token, c.id);
          archived++;
        }
      }
    } catch (err) {
      errors++;
      // eslint-disable-next-line no-console
      console.error(`[nurture] triage ${c.id} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return { checked: contacts.length, escalated, disqualified, archived, errors };
}

export async function POST(req: Request): Promise<NextResponse> {
  const secret = process.env.NURTURE_SECRET;
  const provided = req.headers.get("x-nurture-secret") || "";
  if (!secret || !safeEqual(provided, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const apiKey = process.env.RESEND_API_KEY;
  if (!token || !apiKey) {
    return NextResponse.json(
      { ok: false, error: `missing ${!token ? "HUBSPOT_PRIVATE_APP_TOKEN" : "RESEND_API_KEY"}` },
      { status: 500 },
    );
  }
  const from = process.env.RESEND_FROM || "FundVella <funding@fundvella.com>";
  const base = siteBase();
  const now = Date.now();
  const ctx: Ctx = { token, apiKey, from, base, now, budget: { n: MAX_SENDS_PER_RUN } };

  try {
    const tenDaysAgo = String(now - 10 * 86400000);
    const thirtyDaysAgo = String(now - 30 * 86400000);
    const fiveMinAgo = String(now - 5 * 60000); // avoid search-index lag misclassifying fresh full leads

    const partial = await hsSearch(
      token,
      [
        { propertyName: "email", operator: "HAS_PROPERTY" },
        { propertyName: "marketing_consent_status", operator: "EQ", value: "opted_in" },
        { propertyName: "num_associated_deals", operator: "NOT_HAS_PROPERTY" },
        { propertyName: "createdate", operator: "GTE", value: tenDaysAgo },
        { propertyName: "createdate", operator: "LTE", value: fiveMinAgo },
      ],
      READ_PROPS,
    );
    const cold = await hsSearch(
      token,
      [
        { propertyName: "email", operator: "HAS_PROPERTY" },
        { propertyName: "marketing_consent_status", operator: "EQ", value: "opted_in" },
        { propertyName: "lead_category", operator: "EQ", value: "cold" },
        { propertyName: "num_associated_deals", operator: "HAS_PROPERTY" },
        { propertyName: "hs_lead_status", operator: "NOT_HAS_PROPERTY" },
        { propertyName: "createdate", operator: "GTE", value: thirtyDaysAgo },
      ],
      READ_PROPS,
    );
    // Cold full leads not yet triaged: decide escalate-to-human vs disqualify.
    const sixtyDaysAgo = String(now - 60 * 86400000);
    const triageList = await hsSearch(
      token,
      [
        { propertyName: "email", operator: "HAS_PROPERTY" },
        { propertyName: "lead_category", operator: "EQ", value: "cold" },
        { propertyName: "num_associated_deals", operator: "HAS_PROPERTY" },
        { propertyName: "hs_lead_status", operator: "NOT_HAS_PROPERTY" },
        { propertyName: "createdate", operator: "GTE", value: sixtyDaysAgo },
      ],
      READ_PROPS,
    );

    const partialResult = await processTrack("partial", partial, ctx);
    const coldResult = await processTrack("cold", cold, ctx);
    const triageResult = await triageCold(triageList, ctx, process.env.SDR_ALERT_EMAIL || "");

    return NextResponse.json({ ok: true, partial: partialResult, cold: coldResult, triage: triageResult });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[nurture] run failed:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
