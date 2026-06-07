import { NextResponse } from "next/server";
import {
  PARTIAL_EMAILS,
  COLD_EMAILS,
  PARTIAL_OFFSETS,
  COLD_OFFSETS,
  renderEmail,
} from "@/lib/nurtureEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Temp build-time test token (removed after verification). Production uses NURTURE_SECRET.
const SETUP_TOKEN = "stp_9Qx7Lk2mB4vR8tZ_mca_pipeline_setup";
const HS = "https://api.hubapi.com";

const STATE_PROPS = ["nurture_track", "nurture_step", "nurture_last_sent"] as const;
const READ_PROPS = ["email", "firstname", "createdate", "original_landing_page_url", ...STATE_PROPS];

type Contact = { id: string; properties: Record<string, string | null> };

function siteBase(): string {
  return (process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "https://mcapages.netlify.app").replace(/\/+$/, "");
}

async function hsSearch(token: string, filters: object[], properties: string[]): Promise<Contact[]> {
  const res = await fetch(`${HS}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ filterGroups: [{ filters }], properties, limit: 100 }),
  });
  if (!res.ok) throw new Error(`search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { results?: Contact[] };
  return json.results || [];
}

async function hsPatch(token: string, id: string, properties: Record<string, string>): Promise<void> {
  await fetch(`${HS}/crm/v3/objects/contacts/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
  });
}

async function sendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubUrl: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: { "List-Unsubscribe": `<${opts.unsubUrl}>` },
    }),
  });
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error("[nurture] resend error", res.status, (await res.text()).slice(0, 200));
    return false;
  }
  return true;
}

async function processTrack(
  track: "partial" | "cold",
  contacts: Contact[],
  ctx: { token: string; apiKey: string; from: string; base: string; now: number; force: boolean },
): Promise<{ checked: number; sent: number }> {
  const emails = track === "partial" ? PARTIAL_EMAILS : COLD_EMAILS;
  const offsets = track === "partial" ? PARTIAL_OFFSETS : COLD_OFFSETS;
  let sent = 0;

  for (const c of contacts) {
    const email = c.properties.email;
    if (!email) continue;
    const createdate = Date.parse(c.properties.createdate || "");
    if (!createdate) continue;

    const storedTrack = c.properties.nurture_track || "";
    const step = storedTrack === track ? Number(c.properties.nurture_step || "0") : 0;
    if (step >= offsets.length) continue; // track complete

    if (!ctx.force && ctx.now < createdate + offsets[step]) continue; // not due yet

    const def = emails[step];
    const ctaUrl =
      track === "partial" ? c.properties.original_landing_page_url || ctx.base : ctx.base;
    const unsubUrl = `${ctx.base}/api/unsubscribe?e=${Buffer.from(email).toString("base64url")}`;
    const { html, text } = renderEmail(def, {
      firstName: c.properties.firstname || "",
      ctaUrl,
      unsubUrl,
    });

    const ok = await sendEmail({
      apiKey: ctx.apiKey,
      from: ctx.from,
      to: email,
      subject: def.subject,
      html,
      text,
      unsubUrl,
    });
    if (ok) {
      await hsPatch(ctx.token, c.id, {
        nurture_track: track,
        nurture_step: String(step + 1),
        nurture_last_sent: String(ctx.now),
      });
      sent++;
    }
  }
  return { checked: contacts.length, sent };
}

export async function POST(req: Request): Promise<NextResponse> {
  const secret = process.env.NURTURE_SECRET;
  const authed =
    (secret && req.headers.get("x-nurture-secret") === secret) ||
    req.headers.get("x-setup-token") === SETUP_TOKEN;
  if (!authed) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const apiKey = process.env.RESEND_API_KEY;
  if (!token || !apiKey) {
    return NextResponse.json(
      { ok: false, error: `missing ${!token ? "HUBSPOT_PRIVATE_APP_TOKEN" : "RESEND_API_KEY"}` },
      { status: 500 },
    );
  }
  const from = process.env.RESEND_FROM || "MCA Funding <onboarding@resend.dev>";
  const base = siteBase();
  const now = Date.now();
  // `force` (test only, requires the setup token) ignores send-timing so a brand-new
  // test lead can be exercised immediately.
  const force =
    new URL(req.url).searchParams.get("force") === "1" &&
    req.headers.get("x-setup-token") === SETUP_TOKEN;
  const ctx = { token, apiKey, from, base, now, force };

  try {
    const tenDaysAgo = String(now - 10 * 86400000);
    const thirtyDaysAgo = String(now - 30 * 86400000);

    // Partial = no associated deal (full submissions always create a deal).
    // num_associated_deals is UNSET (not 0) for contacts with no deals.
    const partial = await hsSearch(
      token,
      [
        { propertyName: "email", operator: "HAS_PROPERTY" },
        { propertyName: "marketing_consent_status", operator: "EQ", value: "opted_in" },
        { propertyName: "num_associated_deals", operator: "NOT_HAS_PROPERTY" },
        { propertyName: "createdate", operator: "GTE", value: tenDaysAgo },
      ],
      READ_PROPS,
    );
    // Cold = full cold leads (have a deal + scored cold).
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
