/**
 * FinBiz lead import — Pipe 2.
 *
 * Guarded batch upsert into HubSpot, tagged lead_brand=FinBiz. Point a Google
 * Sheet at this (n8n Sheets -> HTTP, or any script) to load a freelance client's
 * leads. Auth: the same shared key as the n8n gateway (x-fundvella-key).
 *
 * Body: { "leads": [ { "email": "...", "firstName": "...", "lastName": "...",
 *         "phone": "...", "businessName": "..." }, ... ] }
 * Field mapping is intentionally generic — extend leadToContactProps when the
 * client's columns are known.
 */

import { NextResponse } from "next/server";

import { upsertHubspotContacts } from "@/lib/server/hubspot";
import type { LeadData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ImportBody {
  leads?: LeadData[];
  rows?: LeadData[];
}

export async function POST(req: Request): Promise<NextResponse> {
  const key = req.headers.get("x-fundvella-key");
  if (!process.env.NURTURE_SECRET || key !== process.env.NURTURE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: ImportBody;
  try {
    body = (await req.json()) as ImportBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const leads = body.leads || body.rows || [];
  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ ok: false, error: "no_leads" }, { status: 400 });
  }

  const imported = await upsertHubspotContacts(leads, { brand: "FinBiz" });
  return NextResponse.json({ ok: true, imported, received: leads.length });
}
