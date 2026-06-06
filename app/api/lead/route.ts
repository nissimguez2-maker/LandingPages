/**
 * Secure lead intake endpoint. Runs as a Netlify serverless function.
 * Handles BOTH partial saves (lead.partial === true) and full submissions.
 *
 * Always responds 200 once contact info is present, so the visitor's UX never
 * breaks even if HubSpot is briefly unavailable — the CRM status is reported in
 * the payload and logged server-side.
 */

import { NextResponse } from "next/server";
import { submitLeadToCRM } from "@/lib/crm";
import { computeCompleteness } from "@/lib/completeness";
import type { LeadData } from "@/lib/types";

// Force the Node.js runtime (needs process.env + fetch to HubSpot).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let lead: LeadData;
  try {
    lead = (await req.json()) as LeadData;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Don't persist anonymous noise — require at least one way to reach the lead.
  if (!lead.email && !lead.phone) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }

  // Authoritative completeness (never trust the client's numbers).
  const { percentage, missing } = computeCompleteness(lead);
  lead.formCompletionPercentage = percentage;
  lead.missingInformation = missing;

  const crm = await submitLeadToCRM(lead);
  return NextResponse.json({ ok: true, crm });
}
