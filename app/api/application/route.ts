/**
 * Deep-application autosave + resume + recovery.
 *
 *  POST  – upsert the (redacted) application by token; on an "abandoned" beacon
 *          with an email on file, fire ONE resume email (Resend) or hand the
 *          recovery event to the n8n webhook to send + sequence the nudges.
 *  GET    ?app=<token> – return the stored lead so the magic link can restore it.
 *
 * No raw SSN or signature ever passes through here; only ssnLast4 / flags.
 */

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { buildLeadProfile, redactSensitive, type ApplicationSubmission } from "@/lib/application";
import { sendResumeEmail } from "@/lib/server/email";
import { getApplication, isStoreConfigured, markResumeEmailed, upsertApplication } from "@/lib/server/store";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AutosaveBody extends ApplicationSubmission {
  abandoned?: boolean;
}

async function forwardRecovery(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.APPLICATION_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "application.abandoned", data: payload }),
    });
  } catch {
    /* best effort */
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  const token = new URL(req.url).searchParams.get("app");
  if (!token) return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  const rec = await getApplication(token);
  if (!rec) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead: rec.lead });
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: AutosaveBody;
  try {
    body = (await req.json()) as AutosaveBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const token = body.applicationId || randomUUID();
  const safe = redactSensitive({ ...body, applicationId: token });

  await upsertApplication({
    token,
    vertical: body.industry,
    status: body.applicationStatus || "in_progress",
    email: body.email,
    lead: safe,
  });

  // Recovery: a leaving lead with an email gets ONE resume nudge.
  if (body.abandoned && body.email && body.applicationStatus !== "submitted") {
    const rec = isStoreConfigured() ? await getApplication(token) : null;
    if (!rec?.resume_emailed_at) {
      const resumeUrl = `${getSiteUrl()}/apply/${body.industry ?? ""}?app=${token}`;
      const profile = buildLeadProfile(body);
      const sent = await sendResumeEmail({ to: body.email, firstName: body.firstName, resumeUrl, profile });
      if (sent) await markResumeEmailed(token);
      else await forwardRecovery({ email: body.email, firstName: body.firstName, resumeUrl, profile });
    }
  }

  return NextResponse.json({ ok: true, id: token });
}
