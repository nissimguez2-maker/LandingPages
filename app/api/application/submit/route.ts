/**
 * Final application submit.
 *
 * This is the ONE request that carries the raw SSN and the signature image. The
 * handler:
 *   1. encrypts the SSN server-side (AES-256-GCM) — or drops it if no key is set,
 *   2. redacts both secrets before anything is logged or forwarded,
 *   3. forwards a SAFE summary (last-4 only) to your CRM/automation webhook.
 *
 * The raw SSN and signature image are never logged, never put in analytics, and
 * never sent to the CRM in the clear.
 */

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { digitsOnly, redactSensitive, type ApplicationSubmission } from "@/lib/application";
import { encryptSecret } from "@/lib/server/secure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function forward(summary: Record<string, unknown>): Promise<void> {
  const url = process.env.APPLICATION_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "application.submitted", data: summary }),
    });
  } catch {
    /* best effort — never block the applicant on a downstream hiccup */
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: ApplicationSubmission;
  try {
    body = (await req.json()) as ApplicationSubmission;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = body.applicationId || randomUUID();
  const ssnDigits = body.ssn ? digitsOnly(body.ssn) : "";
  const ssnCiphertext = ssnDigits ? encryptSecret(ssnDigits) : null;

  // Safe view for logs + CRM: secrets stripped, only last-4 retained.
  const safe = redactSensitive({ ...body, applicationId: id });

  // TODO (Supabase): persist `safe` + `ssnCiphertext` (or null) and move the
  // signature image / bank statements into a private bucket. `ssnCiphertext`
  // is null when APPLICATION_ENC_KEY is unset — in that case do NOT store the SSN.
  void ssnCiphertext;

  await forward(safe);

  return NextResponse.json({ ok: true, id });
}
