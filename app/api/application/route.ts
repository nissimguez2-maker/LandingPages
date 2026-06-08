/**
 * Deep-application autosave / partial upsert.
 *
 * The wizard POSTs LeadData here on every step advance (and via sendBeacon on
 * exit). This shape carries NO raw SSN or signature — only ssnLast4 / flags — so
 * it is safe to persist and to log after redaction. Wire Supabase + n8n where
 * the TODO is; until then it just acknowledges with a stable application id.
 */

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { redactSensitive, type ApplicationSubmission } from "@/lib/application";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let body: ApplicationSubmission;
  try {
    body = (await req.json()) as ApplicationSubmission;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = body.applicationId || randomUUID();
  const safe = redactSensitive({ ...body, applicationId: id });

  // TODO: upsert `safe` into Supabase (key on `id`); optionally mirror to HubSpot.
  void safe;

  return NextResponse.json({ ok: true, id });
}
