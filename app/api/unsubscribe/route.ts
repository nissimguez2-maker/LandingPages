import { NextResponse } from "next/server";
import { verifyUnsub } from "@/lib/unsubscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HS = "https://api.hubapi.com";

function page(message: string): NextResponse {
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>
  <body style="font-family:Arial,sans-serif;background:#f1f5f9;margin:0">
    <div style="max-width:480px;margin:10vh auto;background:#fff;border-radius:12px;padding:32px;text-align:center;color:#0f2a4a">
      <h1 style="font-size:20px">${message}</h1>
      <p style="color:#64748b;font-size:14px">You can close this window.</p>
    </div>
  </body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

async function optOut(email: string): Promise<void> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const s = await fetch(`${HS}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      properties: ["email"],
      limit: 1,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!s.ok) return;
  const json = (await s.json()) as { results?: { id: string }[] };
  const id = json.results?.[0]?.id;
  if (!id) return;
  await fetch(`${HS}/crm/v3/objects/contacts/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ properties: { marketing_consent_status: "opted_out" } }),
    signal: AbortSignal.timeout(8000),
  });
}

function confirmPage(token: string): NextResponse {
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>
  <body style="font-family:Arial,sans-serif;background:#f1f5f9;margin:0">
    <div style="max-width:480px;margin:10vh auto;background:#fff;border-radius:12px;padding:32px;text-align:center;color:#0f2a4a">
      <h1 style="font-size:20px">Unsubscribe from these emails?</h1>
      <p style="color:#64748b;font-size:14px">Click below to stop receiving funding emails from us.</p>
      <form method="POST" action="/api/unsubscribe?u=${encodeURIComponent(token)}">
        <button type="submit" style="margin-top:12px;background:#0f2a4a;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:600;font-size:15px;cursor:pointer">Unsubscribe me</button>
      </form>
    </div>
  </body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

// GET never opts out: email scanners / link prefetch would silently unsubscribe a
// real lead. It only shows a confirm button that POSTs.
export async function GET(req: Request): Promise<NextResponse> {
  const u = new URL(req.url).searchParams.get("u");
  if (!verifyUnsub(u)) return page("Invalid or expired unsubscribe link.");
  return confirmPage(u || "");
}

// POST is the real opt-out: covers both one-click (RFC 8058) and the confirm form.
export async function POST(req: Request): Promise<NextResponse> {
  const email = verifyUnsub(new URL(req.url).searchParams.get("u"));
  if (!email) return page("Invalid or expired unsubscribe link.");
  try {
    await optOut(email);
  } catch {
    /* best effort */
  }
  return page("You've been unsubscribed.");
}
