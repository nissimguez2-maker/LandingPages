import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { createLinkToken, isPlaidConfigured } from "@/lib/server/plaid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let body: { applicationId?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }
  if (!isPlaidConfigured()) return NextResponse.json({ ok: true, configured: false });
  try {
    const link_token = await createLinkToken(body.applicationId || randomUUID());
    return NextResponse.json({ ok: true, configured: true, link_token });
  } catch {
    return NextResponse.json({ ok: false, configured: true, error: "link_token_failed" }, { status: 502 });
  }
}
