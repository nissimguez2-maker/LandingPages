import "server-only";

import type { LeadProfile } from "@/lib/application";

/**
 * Recovery / resume email. Sends via Resend when RESEND_API_KEY is set; otherwise
 * returns false so the caller can route the event to the n8n webhook instead.
 * From-address defaults to funding@fundvella.com.
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
// Honour the site's existing RESEND_FROM, then our own var, then a safe default.
const FROM = process.env.RESEND_FROM || process.env.RESUME_EMAIL_FROM || "FundVella <funding@fundvella.com>";

export interface ResumeEmailInput {
  to: string;
  firstName?: string;
  resumeUrl: string;
  profile?: LeadProfile;
}

export async function sendResumeEmail(input: ResumeEmailInput): Promise<boolean> {
  if (!RESEND_KEY || !input.to) return false;
  const hi = input.firstName ? `Hi ${input.firstName},` : "Hi,";
  const html = `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#0f2a4a">
    <p>${hi}</p>
    <p>Your FundVella application is saved and nearly done. Pick up right where you left off:</p>
    <p><a href="${input.resumeUrl}" style="display:inline-block;background:#047857;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Finish your application</a></p>
    <p style="color:#64748b;font-size:13px">Your progress is held securely. Questions? Just reply to this email.</p>
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: FROM,
        to: input.to,
        reply_to: "funding@fundvella.com",
        subject: "Your saved application — pick up where you left off",
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
