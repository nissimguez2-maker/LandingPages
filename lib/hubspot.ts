/**
 * HubSpot implementation of the CRM contract. SERVER-SIDE ONLY — it reads
 * HUBSPOT_PRIVATE_APP_TOKEN, which must never reach the browser.
 *
 * Full submission   -> upsert Contact + Company, associate, create Deal.
 * Partial submission -> upsert Contact (+ Company if a business name exists). No Deal.
 *   (Per architecture decision: partials never create deal noise.)
 */

import "server-only";

import type { LeadData, LeadScore } from "./types";
import { CONTACT_TIME_OPTIONS, USE_OF_FUNDS_OPTIONS } from "./types";
import { scoreLead, bandToHubSpotCategory } from "./leadScoring";
import {
  CONTACT,
  COMPANY,
  DEAL,
  LEAD_CATEGORY_VALUE,
  URGENCY_VALUE,
  CHANNEL_VALUE,
  REVENUE_NUMERIC,
  TIB_YEARS,
  AMOUNT_NUMERIC,
  PAYMENT_BURDEN_NUMERIC,
  ADVANCES_COUNT,
  PIPELINE,
} from "./hubspotFieldMap";

const HS_BASE = "https://api.hubapi.com";

export interface CrmResult {
  ok: boolean;
  skipped?: boolean;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  band?: LeadScore["band"];
  score?: number;
  error?: string;
}

type Props = Record<string, string>;

/* ── small helpers ──────────────────────────────────────────────────────── */

function setProp(props: Props, key: string, value: string | number | boolean | undefined | null) {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && value.trim() === "") return;
  props[key] = String(value);
}

function parseMoney(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function domainFromWebsite(website?: string): string | undefined {
  if (!website) return undefined;
  try {
    const url = new URL(website.includes("://") ? website : `https://${website}`);
    return url.hostname.replace(/^www\./, "") || undefined;
  } catch {
    return undefined;
  }
}

function labelOf(options: readonly { value: string; label: string }[], value?: string): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Verticals that map cleanly onto a HubSpot industry_focus option. */
const SLUG_TO_INDUSTRY_FOCUS: Record<string, "healthcare"> = {
  "medical-practice-funding": "healthcare",
  "dental-practice-funding": "healthcare",
  "beauty-salon-med-spa-funding": "healthcare",
};

async function hsFetch(path: string, method: string, body?: unknown): Promise<Response> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  return fetch(`${HS_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function readError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  return `HubSpot ${res.status}: ${text.slice(0, 500)}`;
}

/** Create the default association between two records (no numeric typeId needed). */
async function associateDefault(
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
): Promise<void> {
  const res = await hsFetch(
    `/crm/v4/objects/${fromType}/${fromId}/associations/default/${toType}/${toId}`,
    "PUT",
  );
  if (!res.ok) {
    // Non-fatal: the records exist; association can be repaired in HubSpot.
    // eslint-disable-next-line no-console
    console.error("[hubspot] association failed:", await readError(res));
  }
}

/* ── property builders ──────────────────────────────────────────────────── */

function buildContactProps(lead: LeadData, score: LeadScore): Props {
  const p: Props = {};
  setProp(p, CONTACT.firstName, lead.firstName);
  setProp(p, CONTACT.lastName, lead.lastName);
  setProp(p, CONTACT.email, lead.email);
  setProp(p, CONTACT.phone, lead.phone);
  setProp(p, CONTACT.leadSource, "website");
  setProp(p, CONTACT.fundingReadinessScore, score.score);
  setProp(p, CONTACT.leadCategory, LEAD_CATEGORY_VALUE[score.band]);
  if (lead.urgency) setProp(p, CONTACT.leadUrgency, URGENCY_VALUE[lead.urgency]);
  setProp(p, CONTACT.originalLandingPageUrl, lead.sourcePage);
  setProp(p, CONTACT.formCompletionPercentage, lead.formCompletionPercentage);
  if (lead.missingInformation?.length) {
    setProp(p, CONTACT.missingInformation, lead.missingInformation.join(", "));
  }

  // Preferred contact time (+ preserve the SMS nuance HubSpot can't store as a channel).
  let contactTime = labelOf(CONTACT_TIME_OPTIONS, lead.preferredContactTime) ?? "";
  if (lead.preferredChannel === "text") {
    contactTime = `${contactTime}${contactTime ? " " : ""}(prefers text)`.trim();
  }
  setProp(p, CONTACT.preferredContactTime, contactTime);
  if (lead.preferredChannel) {
    setProp(p, CONTACT.preferredCommunicationChannel, CHANNEL_VALUE[lead.preferredChannel]);
  }

  if (lead.marketingConsent !== undefined) {
    setProp(p, CONTACT.marketingConsentStatus, lead.marketingConsent ? "opted_in" : "opted_out");
  }

  setProp(p, CONTACT.utmSource, lead.utm?.utm_source);
  setProp(p, CONTACT.utmMedium, lead.utm?.utm_medium);
  setProp(p, CONTACT.utmCampaign, lead.utm?.utm_campaign);
  setProp(p, CONTACT.utmContent, lead.utm?.utm_content);
  setProp(p, CONTACT.utmTerm, lead.utm?.utm_term);
  return p;
}

function buildCompanyProps(lead: LeadData): Props {
  const p: Props = {};
  setProp(p, COMPANY.name, lead.businessName);
  setProp(p, COMPANY.businessLegalName, lead.businessName);

  const domain = domainFromWebsite(lead.website);
  setProp(p, COMPANY.website, lead.website);
  setProp(p, COMPANY.domain, domain);
  setProp(p, COMPANY.state, lead.state);

  if (lead.monthlyRevenue) {
    setProp(p, COMPANY.monthlyGrossRevenue, REVENUE_NUMERIC[lead.monthlyRevenue]);
  }
  if (lead.timeInBusiness) {
    setProp(p, COMPANY.timeInBusiness, TIB_YEARS[lead.timeInBusiness]);
  }
  if (lead.amountNeeded) {
    setProp(p, COMPANY.amountRequested, AMOUNT_NUMERIC[lead.amountNeeded]);
  }

  // Booleans — only when the answer is definite (skip "not_sure").
  if (lead.canProvideBankStatements === "yes" || lead.canProvideBankStatements === "no") {
    setProp(p, COMPANY.canProvide34MonthsBankStatements, lead.canProvideBankStatements === "yes");
  }
  if (lead.recentNsfs && lead.recentNsfs !== "not_sure") {
    setProp(p, COMPANY.recentNsfsOrNegativeDays, lead.recentNsfs !== "none");
  }
  if (lead.existingDebt && lead.existingDebt !== "not_sure") {
    setProp(p, COMPANY.existingMcaOrBusinessLoans, lead.existingDebt !== "none");
    setProp(p, COMPANY.numberOfExistingAdvances, ADVANCES_COUNT[lead.existingDebt]);
  }
  if (lead.paymentBurden && lead.paymentBurden !== "not_sure") {
    setProp(p, COMPANY.estimatedCurrentDailyWeeklyPaymentBurden, PAYMENT_BURDEN_NUMERIC[lead.paymentBurden]);
  }

  setProp(p, COMPANY.currentFunderName, lead.currentFunderName);
  setProp(p, COMPANY.currentBalanceOwed, parseMoney(lead.currentBalanceOwed));
  setProp(p, COMPANY.useOfFunds, labelOf(USE_OF_FUNDS_OPTIONS, lead.useOfFunds));

  if (lead.industry && SLUG_TO_INDUSTRY_FOCUS[lead.industry]) {
    setProp(p, COMPANY.industryFocus, SLUG_TO_INDUSTRY_FOCUS[lead.industry]);
  }
  return p;
}

function buildDealProps(lead: LeadData, score: LeadScore): Props {
  const p: Props = {};
  const who =
    lead.businessName ||
    [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
    "New lead";
  setProp(p, DEAL.dealname, `${who} — ${lead.verticalTitle || "Business Funding"}`);

  if (lead.amountNeeded) {
    setProp(p, DEAL.amount, AMOUNT_NUMERIC[lead.amountNeeded]);
    setProp(p, DEAL.amountRequested, AMOUNT_NUMERIC[lead.amountNeeded]);
  }
  setProp(p, DEAL.productType, PIPELINE.defaultProductType);
  setProp(p, DEAL.dealStatus, "in_progress");
  setProp(p, DEAL.fundingReadinessScore, score.score);
  setProp(p, DEAL.leadCategory, bandToHubSpotCategory(score.band));
  setProp(p, DEAL.pipeline, PIPELINE.id);
  setProp(p, DEAL.dealStage, PIPELINE.defaultStageId);
  return p;
}

/* ── object upserts ─────────────────────────────────────────────────────── */

async function upsertContact(props: Props, email?: string): Promise<string> {
  if (email) {
    const res = await hsFetch("/crm/v3/objects/contacts/batch/upsert", "POST", {
      inputs: [{ idProperty: "email", id: email, properties: props }],
    });
    if (!res.ok) throw new Error(await readError(res));
    const json = (await res.json()) as { results: { id: string }[] };
    return json.results[0].id;
  }
  // No email — create by phone (best effort; HubSpot has no phone upsert key).
  const res = await hsFetch("/crm/v3/objects/contacts", "POST", { properties: props });
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { id: string };
  return json.id;
}

async function upsertCompany(props: Props): Promise<string | null> {
  if (!props[COMPANY.name]) return null;
  const domain = props[COMPANY.domain];
  if (domain) {
    const res = await hsFetch("/crm/v3/objects/companies/batch/upsert", "POST", {
      inputs: [{ idProperty: "domain", id: domain, properties: props }],
    });
    if (!res.ok) throw new Error(await readError(res));
    const json = (await res.json()) as { results: { id: string }[] };
    return json.results[0].id;
  }
  const res = await hsFetch("/crm/v3/objects/companies", "POST", { properties: props });
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { id: string };
  return json.id;
}

async function createDeal(props: Props): Promise<string> {
  const res = await hsFetch("/crm/v3/objects/deals", "POST", { properties: props });
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { id: string };
  return json.id;
}

/* ── public entrypoint ──────────────────────────────────────────────────── */

export async function submitLeadToHubSpot(lead: LeadData): Promise<CrmResult> {
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    // eslint-disable-next-line no-console
    console.warn("[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping CRM write.");
    return { ok: false, skipped: true };
  }

  const score = scoreLead(lead);

  try {
    const contactId = await upsertContact(buildContactProps(lead, score), lead.email);

    let companyId: string | null = null;
    if (lead.businessName) {
      companyId = await upsertCompany(buildCompanyProps(lead));
      if (companyId) await associateDefault("contacts", contactId, "companies", companyId);
    }

    // Partial leads stop here — Contact (+ Company) only, no Deal.
    if (lead.partial) {
      return { ok: true, contactId, companyId: companyId ?? undefined, band: score.band, score: score.score };
    }

    const dealId = await createDeal(buildDealProps(lead, score));
    await associateDefault("deals", dealId, "contacts", contactId);
    if (companyId) await associateDefault("deals", dealId, "companies", companyId);

    return { ok: true, contactId, companyId: companyId ?? undefined, dealId, band: score.band, score: score.score };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[hubspot] submit failed:", error);
    return { ok: false, error, band: score.band, score: score.score };
  }
}
