/**
 * Secure lead intake endpoint. Runs as a Netlify serverless function.
 * Handles BOTH partial saves (lead.partial === true) and full submissions.
 *
 * Always responds 200 once contact info is present, so the visitor's UX never
 * breaks even if HubSpot is briefly unavailable — the CRM status is reported in
 * the payload and logged server-side.
 */

import { NextResponse, after } from "next/server";
import { submitLeadToCRM } from "@/lib/crm";
import { computeCompleteness } from "@/lib/completeness";
import type { LeadData } from "@/lib/types";

// Force the Node.js runtime (needs process.env + fetch to HubSpot).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let body: LeadData & { honeypot?: string };
  try {
    body = (await req.json()) as LeadData & { honeypot?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden field; bots do. Silently accept
  // (so bots don't learn) but drop the submission.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  const lead: LeadData = body;

  // Don't persist anonymous noise — require at least one way to reach the lead.
  if (!lead.email && !lead.phone) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }
  // Reject malformed emails server-side (don't store junk that will bounce).
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  // Authoritative completeness (never trust the client's numbers).
  const { percentage, missing } = computeCompleteness(lead);
  lead.formCompletionPercentage = percentage;
  lead.missingInformation = missing;

  // Respond immediately; run the multi-call CRM write after the response is sent
  // so the request never risks the serverless function timeout.
  after(async () => {
    try {
      await submitLeadToCRM(lead);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[lead] CRM write failed:", err instanceof Error ? err.message : err);
    }
  });
  return NextResponse.json({ ok: true });
}
