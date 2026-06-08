/**
 * Lead intake — PLACEHOLDER. No backend is wired yet (by design).
 *
 * The landing page POSTs every capture (partial + full) to this endpoint. Right
 * now it just acknowledges the request so the form completes and the visitor
 * sees the thank-you page. Nothing is stored, scored, emailed, or forwarded.
 *
 * Wire your backend here from scratch — e.g. forward the payload to an n8n
 * webhook, or call a CRM / email service directly.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    await req.json(); // accept the payload (ignored until a backend is wired)
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // TODO: wire your backend here (n8n webhook, CRM, email, …).

  return NextResponse.json({ ok: true });
}
