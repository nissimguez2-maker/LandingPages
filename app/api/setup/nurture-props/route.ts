import { NextResponse } from "next/server";

// TEMPORARY one-time endpoint: creates the 3 contact properties that store
// nurture state. Token-gated; remove after running once.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SETUP_TOKEN = "stp_9Qx7Lk2mB4vR8tZ_mca_pipeline_setup";
const HS = "https://api.hubapi.com";

const PROPS = [
  { name: "nurture_track", label: "Nurture track", type: "string", fieldType: "text" },
  { name: "nurture_step", label: "Nurture step", type: "number", fieldType: "number" },
  { name: "nurture_last_sent", label: "Nurture last sent", type: "datetime", fieldType: "date" },
];

export async function POST(req: Request): Promise<NextResponse> {
  if (req.headers.get("x-setup-token") !== SETUP_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "no_token" }, { status: 500 });
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const created: string[] = [];
  const errors: string[] = [];
  for (const p of PROPS) {
    const res = await fetch(`${HS}/crm/v3/properties/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...p, groupName: "contactinformation" }),
    });
    if (res.ok) {
      created.push(p.name);
    } else {
      const body = (await res.text()).slice(0, 200);
      // 409 = already exists → treat as fine.
      if (res.status === 409 || /already exists/i.test(body)) created.push(`${p.name} (exists)`);
      else errors.push(`${p.name}: ${res.status} ${body}`);
    }
  }
  return NextResponse.json({ ok: errors.length === 0, created, errors });
}
