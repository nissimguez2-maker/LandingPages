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

export async function GET(req: Request): Promise<NextResponse> {
  // Accept the signed token (?u=) or a raw email is rejected.
  const email = verifyUnsub(new URL(req.url).searchParams.get("u"));
  if (!email) return page("Invalid or expired unsubscribe link.");
  try {
    await optOut(email);
  } catch {
    /* best effort */
  }
  return page("You've been unsubscribed.");
}

// One-click unsubscribe (RFC 8058).
export async function POST(req: Request): Promise<NextResponse> {
  const email = verifyUnsub(new URL(req.url).searchParams.get("u"));
  if (email) {
    try {
      await optOut(email);
    } catch {
      /* best effort */
    }
  }
  return NextResponse.json({ ok: true });
}
