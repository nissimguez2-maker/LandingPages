import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY one-time setup endpoint — creates the 18-stage MCA deal pipeline in
// HubSpot using the server-side token (never exposed to the client). Idempotent.
// This file is DELETED right after the pipeline is created. Gated by a token.
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SETUP_TOKEN = "stp_9Qx7Lk2mB4vR8tZ_mca_pipeline_setup";
const HS = "https://api.hubapi.com";
const PIPELINE_LABEL = "MCA Funding Pipeline";

// [label, probability, isClosed]
const STAGES: [string, string, string][] = [
  ["New Lead", "0.05", "false"],
  ["Prequalification Needed", "0.1", "false"],
  ["Prequalified - Green", "0.3", "false"],
  ["Prequalified - Yellow / Needs Review", "0.2", "false"],
  ["Documents Requested", "0.35", "false"],
  ["Documents Received", "0.45", "false"],
  ["Statement Review", "0.5", "false"],
  ["Submitted to Underwriting", "0.6", "false"],
  ["Offer Received", "0.7", "false"],
  ["Offer Presented", "0.8", "false"],
  ["Contracts Sent", "0.85", "false"],
  ["Contracts Signed", "0.9", "false"],
  ["Closing Stips", "0.95", "false"],
  ["Funded", "1.0", "true"],
  ["Declined", "0.0", "true"],
  ["Lost / Not Interested", "0.0", "true"],
  ["Nurture", "0.1", "false"],
  ["Renewal Opportunity", "0.2", "false"],
];

type Pipeline = { id: string; label: string; stages: { id: string; label: string }[] };

export async function POST(req: Request): Promise<NextResponse> {
  if (req.headers.get("x-setup-token") !== SETUP_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "no_token" }, { status: 500 });
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Idempotent: reuse an existing pipeline with the same label.
  const listRes = await fetch(`${HS}/crm/v3/pipelines/deals`, { headers });
  const listText = await listRes.text();
  if (!listRes.ok) {
    return NextResponse.json({ ok: false, step: "list", status: listRes.status, body: listText.slice(0, 800) }, { status: 502 });
  }
  const list = JSON.parse(listText) as { results: Pipeline[] };
  let pipeline = list.results.find((p) => p.label === PIPELINE_LABEL);

  if (!pipeline) {
    const body = {
      label: PIPELINE_LABEL,
      displayOrder: 1,
      stages: STAGES.map(([label, probability, isClosed], i) => ({
        label,
        displayOrder: i,
        metadata: { probability, isClosed },
      })),
    };
    const createRes = await fetch(`${HS}/crm/v3/pipelines/deals`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const createText = await createRes.text();
    if (!createRes.ok) {
      return NextResponse.json({ ok: false, step: "create", status: createRes.status, body: createText.slice(0, 1500) }, { status: 502 });
    }
    pipeline = JSON.parse(createText) as Pipeline;
  }

  const stages = pipeline.stages.map((s) => ({ label: s.label, id: s.id }));
  const newLead = stages.find((s) => s.label === "New Lead");
  return NextResponse.json({ ok: true, pipelineId: pipeline.id, newLeadStageId: newLead?.id, stages });
}
