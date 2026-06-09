/**
 * FinBiz lead import — Pipe 2.
 *
 * A freelance client's leads (a Google Sheet) are POSTed here in batches. Each
 * lead is scored and emitted onto the SAME signed event bus as FundVella
 * captures — tagged lead_brand=FinBiz — so the n8n brain enriches, routes, and
 * writes them (Supabase + the thin HubSpot deal) exactly like every other
 * stream. The streams stay distinct by tag; the engine stays single.
 *
 * Auth: the same shared key as the n8n gateway (x-fundvella-key).
 * Body: { "leads": [ { "email", "firstName", "lastName", "phone", "businessName" }, ... ] }
 */

import { NextResponse } from "next/server";

import { buildLeadProfile } from "@/lib/application";
import { scoreLead } from "@/lib/leadScoring";
import { leadDedupeKey, temperatureFor } from "@/lib/server/events";
import { emit } from "@/lib/server/forward";
import { STREAMS } from "@/lib/streams";
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

  const stream = STREAMS.finbiz;
  const results = await Promise.all(
    leads.map((lead) => {
      const score = scoreLead(lead);
      return emit(
        "lead.captured",
        leadDedupeKey(lead.email, lead.phone, lead.industry, "imported"),
        {
          ...lead,
          leadBrand: stream.leadBrand,
          leadProfile: buildLeadProfile(lead),
          band: score.band,
          score: score.score,
          temperature: temperatureFor(lead.urgency),
          stage: "imported",
        },
        stream.leadBrand,
        stream.source,
      );
    }),
  );

  const emitted = results.filter(Boolean).length;
  return NextResponse.json({ ok: true, emitted, received: leads.length });
}
