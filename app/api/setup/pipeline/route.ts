import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY one-time setup endpoint. The account is limited to 1 deal pipeline,
// so this REPURPOSES the existing pipeline: adds the 18 MCA stages, removes the
// default stages, renames it, and cleans up the integration test records. Uses
// the server-side token (never client-exposed). Token-gated. Deleted after use.
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

type Stage = { id: string; label: string };
type Pipeline = { id: string; label: string; stages: Stage[] };

export async function POST(req: Request): Promise<NextResponse> {
  if (req.headers.get("x-setup-token") !== SETUP_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "no_token" }, { status: 500 });
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const errors: string[] = [];

  // ── 1. Clean up integration test records (server can delete; MCP couldn't) ──
  const cleanup: Record<string, number> = { contacts: 0, companies: 0, deals: 0 };
  async function del(objectType: string, id: string) {
    const r = await fetch(`${HS}/crm/v3/objects/${objectType}/${id}`, { method: "DELETE", headers });
    if (r.ok) cleanup[objectType] = (cleanup[objectType] || 0) + 1;
  }
  async function searchIds(objectType: string, propertyName: string, operator: string, value: string): Promise<string[]> {
    const r = await fetch(`${HS}/crm/v3/objects/${objectType}/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName, operator, value }] }], limit: 100 }),
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { results?: { id: string }[] };
    return (j.results || []).map((x) => x.id);
  }
  try {
    for (const id of await searchIds("contacts", "email", "CONTAINS_TOKEN", "integration-test*")) await del("contacts", id);
    for (const id of await searchIds("companies", "name", "CONTAINS_TOKEN", "Mcapages")) await del("companies", id);
    for (const id of await searchIds("deals", "dealname", "CONTAINS_TOKEN", "Mcapages")) await del("deals", id);
  } catch (e) {
    errors.push(`cleanup: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 2. Get the single existing deal pipeline ──
  const listRes = await fetch(`${HS}/crm/v3/pipelines/deals`, { headers });
  const listText = await listRes.text();
  if (!listRes.ok) {
    return NextResponse.json({ ok: false, step: "list", status: listRes.status, body: listText.slice(0, 800) }, { status: 502 });
  }
  const list = JSON.parse(listText) as { results: Pipeline[] };
  const pipeline = list.results.find((p) => p.label === PIPELINE_LABEL) || list.results[0];
  if (!pipeline) return NextResponse.json({ ok: false, error: "no_pipeline" }, { status: 500 });
  const pipelineId = pipeline.id;
  const originalStageIds = pipeline.stages.map((s) => s.id);
  const existingByLabel = new Map(pipeline.stages.map((s) => [s.label, s.id] as const));

  // ── 3. Add the 18 MCA stages (skip any that already exist by label) ──
  const stageMap: Record<string, string> = {};
  for (let i = 0; i < STAGES.length; i++) {
    const [label, probability, isClosed] = STAGES[i];
    if (existingByLabel.has(label)) {
      stageMap[label] = existingByLabel.get(label)!;
      continue;
    }
    const r = await fetch(`${HS}/crm/v3/pipelines/deals/${pipelineId}/stages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ label, displayOrder: i, metadata: { probability, isClosed } }),
    });
    const t = await r.text();
    if (!r.ok) {
      errors.push(`stage "${label}": ${r.status} ${t.slice(0, 200)}`);
      continue;
    }
    stageMap[label] = (JSON.parse(t) as Stage).id;
  }

  // ── 4. Delete the original (default) stages now that MCA stages exist ──
  const deletedStages: string[] = [];
  for (const sid of originalStageIds) {
    const r = await fetch(`${HS}/crm/v3/pipelines/deals/${pipelineId}/stages/${sid}`, { method: "DELETE", headers });
    if (r.ok) deletedStages.push(sid);
    else errors.push(`delete stage ${sid}: ${r.status} ${(await r.text()).slice(0, 120)}`);
  }

  // ── 5. Rename the pipeline ──
  if (pipeline.label !== PIPELINE_LABEL) {
    const r = await fetch(`${HS}/crm/v3/pipelines/deals/${pipelineId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ label: PIPELINE_LABEL }),
    });
    if (!r.ok) errors.push(`rename: ${r.status}`);
  }

  return NextResponse.json({
    ok: errors.length === 0,
    pipelineId,
    newLeadStageId: stageMap["New Lead"],
    stageMap,
    deletedStages: deletedStages.length,
    cleanup,
    errors,
  });
}
