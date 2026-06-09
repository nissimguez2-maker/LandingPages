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
import { scoreLead } from "@/lib/leadScoring";
import { temperatureFor } from "@/lib/server/events";
import { emit } from "@/lib/server/forward";
import { STREAMS } from "@/lib/streams";
import { sendResumeEmail } from "@/lib/server/email";
import { getApplication, isStoreConfigured, markResumeEmailed, upsertApplication } from "@/lib/server/store";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AutosaveBody extends ApplicationSubmission {
  abandoned?: boolean;
  dropStep?: string;
  furthestStep?: string;
  signals?: Record<string, unknown>;
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

  // On abandon: the app owns the instant (T+0) resume email; n8n owns the later
  // branched cadence — so we ALWAYS emit application.abandoned for it to pick up.
  if (body.abandoned && body.applicationStatus !== "submitted") {
    const rec = isStoreConfigured() ? await getApplication(token) : null;
    const alreadyEmailed = Boolean(rec?.resume_emailed_at);
    const resumeUrl = `${getSiteUrl()}/apply/${body.industry ?? ""}?app=${token}`;
    const profile = buildLeadProfile(body);

    let emailedByApp = alreadyEmailed;
    if (body.email && !alreadyEmailed) {
      emailedByApp = await sendResumeEmail({ to: body.email, firstName: body.firstName, resumeUrl, profile });
      if (emailedByApp) await markResumeEmailed(token);
    }

    const score = scoreLead(body);
    await emit(
      "application.abandoned",
      `app:${token}:abandoned:${body.dropStep ?? "unknown"}`,
      {
        ...safe,
        leadBrand: STREAMS.fundvella.leadBrand,
        leadProfile: profile,
        band: score.band,
        score: score.score,
        temperature: temperatureFor(body.urgency),
        dropStep: body.dropStep,
        furthestStep: body.furthestStep,
        signals: body.signals,
        completionPct: body.formCompletionPercentage,
        resume: { resumeUrl, emailedByApp },
      },
      STREAMS.fundvella.leadBrand,
    );
  }

  return NextResponse.json({ ok: true, id: token });
}
