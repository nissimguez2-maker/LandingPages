/**
 * Prequal lead intake.
 *
 * Was a placeholder that discarded every lead. Now it scores the lead
 * server-side (authoritative band, not the tamperable client one), builds the
 * shared leadProfile, and emits a signed, idempotent `lead.captured` event to
 * n8n (which routes it to the Google Sheet the team works from). The client
 * fires this 2-3x per visitor (beacon + contact + enrichment); the deterministic
 * dedup key collapses those to one lead record.
 */

import { NextResponse } from "next/server";

import { buildLeadProfile, redactSensitive, type ApplicationSubmission } from "@/lib/application";
import { scoreLead } from "@/lib/leadScoring";
import { leadDedupeKey, temperatureFor } from "@/lib/server/events";
import { emit } from "@/lib/server/forward";
import type { LeadData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadBody extends ApplicationSubmission {
  company_website?: string; // honeypot
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Ack OK (don't tip them off), emit nothing.
  if (body.company_website && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const lead = body as LeadData;
  const score = scoreLead(lead); // server-authoritative
  const stage = lead.partial === false ? "complete" : "partial";

  const temperature = temperatureFor(lead.urgency);
  const data = {
    ...redactSensitive(body),
    leadProfile: buildLeadProfile(lead),
    band: score.band,
    score: score.score,
    scoreReasons: score.reasons,
    temperature,
    stage,
  };

  // One signed, idempotent event to n8n, which routes the lead into the Google Sheet.
  await emit("lead.captured", leadDedupeKey(lead.email, lead.phone, lead.industry, stage), data);

  return NextResponse.json({ ok: true });
}
