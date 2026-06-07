/**
 * Nurture email templates (partial win-back + cold nurture), sent via Resend.
 * Compliance-safe copy (no guarantees), unsubscribe footer in every email.
 */

export interface RenderVars {
  firstName: string;
  ctaUrl: string;
  unsubUrl: string;
}

export interface NurtureEmail {
  key: string;
  subject: string;
  ctaLabel: string;
  paragraphs: string[];
}

export const PARTIAL_EMAILS: NurtureEmail[] = [
  {
    key: "partial_1",
    subject: "Finish your funding check",
    ctaLabel: "Finish your funding check",
    paragraphs: [
      "You're only a few steps away from completing your funding check.",
      "If you'd still like us to review your information, you can finish your submission using the button below.",
      "Once you submit the remaining details, our team can review your file and let you know whether you may qualify.",
    ],
  },
  {
    key: "partial_2",
    subject: "Still want us to review your file?",
    ctaLabel: "Continue your funding review",
    paragraphs: [
      "We noticed your funding request wasn't fully completed.",
      "If you still want us to review your file, you can pick up where you left off. Submitting the rest of your information may help us evaluate whether you qualify.",
      "If you have questions before you continue, just reply to this email and our team will help.",
    ],
  },
  {
    key: "partial_3",
    subject: "Last call: finish your funding review",
    ctaLabel: "Finish your funding review",
    paragraphs: [
      "This is a final reminder to complete your funding check if you'd like our team to review your file.",
      "You can pick up where you left off using the button below.",
      "If you're no longer interested, you can simply ignore this email.",
    ],
  },
];

export const COLD_EMAILS: NurtureEmail[] = [
  {
    key: "cold_1",
    subject: "We received your request. Here is what happens next",
    ctaLabel: "Re-check your readiness",
    paragraphs: [
      "Thanks for your funding request. Here is a clearer picture of what happens next.",
      "Depending on your file, a funding specialist may follow up to learn more about your business. The review usually looks at things like business revenue, recent bank activity, time in business, and overall file strength.",
      "If you'd like to talk it through, just reply to this email.",
    ],
  },
  {
    key: "cold_2",
    subject: "What strengthens a funding file",
    ctaLabel: "Re-check your readiness",
    paragraphs: [
      "A question we hear often is what makes a funding file look stronger.",
      "Reviewers often look more favorably on businesses with steadier monthly deposits, fewer NSFs or negative days, more time in business, and cleaner recent bank statements.",
      "These factors don't guarantee approval, but they can create a clearer picture during underwriting.",
    ],
  },
  {
    key: "cold_3",
    subject: "Simple ways to become more fundable",
    ctaLabel: "Re-check your readiness",
    paragraphs: [
      "If now isn't the right moment, there are still practical steps that may strengthen your profile over the next few months.",
      "Keep deposits consistent, reduce overdrafts and negative-balance days, maintain clean business statements, and keep building time in business and stable revenue.",
      "These steps won't promise approval, but they may improve how your file looks when it's reviewed later.",
    ],
  },
  {
    key: "cold_4",
    subject: "We're here when you're ready",
    ctaLabel: "Re-check your readiness",
    paragraphs: [
      "If the timing isn't right today, that's completely fine.",
      "When things change, you're welcome to reply to this email to talk to a specialist, or take another look at your readiness anytime.",
      "If and when you decide to revisit funding, our team can review the information available and let you know whether you may qualify.",
    ],
  },
];

// Note: hot (green) and warm (yellow) leads are intentionally NOT emailed by this
// engine. Those are worked personally by the SDR (see docs/sdr-outreach-templates.md).
// Automation here only handles partial win-backs and the cold track.

// CAN-SPAM requires a physical postal address in every marketing email.
// Set BUSINESS_ADDRESS in Netlify before sending to real leads.
const BUSINESS_ADDRESS =
  process.env.BUSINESS_ADDRESS || "FundVella · [set BUSINESS_ADDRESS env to your mailing address]";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderEmail(email: NurtureEmail, v: RenderVars): { html: string; text: string } {
  const greet = `Hi ${v.firstName || "there"},`;
  const html = `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#ffffff;border-radius:12px;padding:28px;color:#0f2a4a;font-size:15px;line-height:1.6">
      <p>${escapeHtml(greet)}</p>
      ${email.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")}
      <p style="text-align:center;margin:28px 0">
        <a href="${v.ctaUrl}" style="background:#059669;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${escapeHtml(email.ctaLabel)}</a>
      </p>
      <p style="color:#64748b;font-size:13px">Approval depends on underwriting, and there's no obligation to proceed.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="color:#94a3b8;font-size:12px">You're receiving this because you asked about business funding. <a href="${v.unsubUrl}" style="color:#94a3b8">Unsubscribe</a>.</p>
      <p style="color:#94a3b8;font-size:12px">${escapeHtml(BUSINESS_ADDRESS)}</p>
    </div>
  </div></body></html>`;
  const text = `${greet}\n\n${email.paragraphs.join("\n\n")}\n\n${email.ctaLabel}: ${v.ctaUrl}\n\nApproval depends on underwriting; no obligation.\n\nUnsubscribe: ${v.unsubUrl}\n${BUSINESS_ADDRESS}`;
  return { html, text };
}

/** Send offsets from contact createdate (ms), one per email in each track. */
export const PARTIAL_OFFSETS = [15 * 60 * 1000, 1 * 86400000, 4 * 86400000];
export const COLD_OFFSETS = [1 * 86400000, 5 * 86400000, 12 * 86400000, 22 * 86400000];
