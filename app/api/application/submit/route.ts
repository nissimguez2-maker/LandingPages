/**
 * Final application submit — the one request carrying the raw SSN + signature.
 *   1. encrypt the SSN server-side (AES-256-GCM); drop it if no key is set,
 *   2. persist the redacted record (+ ciphertext) keyed by token,
 *   3. forward a SAFE summary + leadProfile (the who/what/why for AI emails).
 * The raw SSN / signature are never logged, never analytics, never sent in clear.
 */

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { buildLeadProfile, digitsOnly, redactSensitive, type ApplicationSubmission } from "@/lib/application";
import { encryptSecret } from "@/lib/server/secure";
import { upsertApplication } from "@/lib/server/store";

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
  const safe = redactSensitive({ ...body, applicationId: id });
  const profile = buildLeadProfile(body);

  await upsertApplication({
    token: id,
    vertical: body.industry,
    status: "submitted",
    email: body.email,
    lead: safe,
    ssn_ciphertext: ssnCiphertext,
    plaid_item_id: body.plaidItemId ?? null,
  });

  await forward({ ...safe, leadProfile: profile });

  return NextResponse.json({ ok: true, id });
}
