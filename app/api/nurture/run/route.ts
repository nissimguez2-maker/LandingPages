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
const READ_PROPS = ["email", "firstname", "createdate", "original_landing_page_url", ...STATE_PROPS];

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
        { propertyName: "createdate", operator: "GTE", value: thirtyDaysAgo },
      ],
      READ_PROPS,
    );

    const partialResult = await processTrack("partial", partial, ctx);
    const coldResult = await processTrack("cold", cold, ctx);

    return NextResponse.json({ ok: true, partial: partialResult, cold: coldResult });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[nurture] run failed:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
