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
import { scoreLead } from "@/lib/leadScoring";
import { temperatureFor } from "@/lib/server/events";
import { emit } from "@/lib/server/forward";
import { encryptSecret } from "@/lib/server/secure";
import { STREAMS } from "@/lib/streams";
import { upsertApplication } from "@/lib/server/store";

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

  const score = scoreLead(body);
  const temperature = temperatureFor(body.urgency);
  const stream = STREAMS.fundvella;
  await emit(
    "application.submitted",
    `app:${id}:submitted`,
    {
      ...safe,
      leadBrand: stream.leadBrand,
      leadProfile: profile,
      band: score.band,
      score: score.score,
      temperature,
    },
    stream.leadBrand,
  );

  return NextResponse.json({ ok: true, id });
}
