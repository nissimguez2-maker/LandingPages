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
  MCA_PIPELINE_STAGES,
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
    signal: AbortSignal.timeout(8000),
  });
}

async function readError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  return `HubSpot ${res.status}: ${text.slice(0, 500)}`;
}

/** Create the default association between two records (retries once; non-fatal). */
async function associateDefault(
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await hsFetch(
      `/crm/v4/objects/${fromType}/${fromId}/associations/default/${toType}/${toId}`,
      "PUT",
    );
    if (res.ok) return;
    if (attempt === 1) {
      // Non-fatal: the records exist; association can be repaired in HubSpot.
      // eslint-disable-next-line no-console
      console.error("[hubspot] association failed:", await readError(res));
    }
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

  setProp(p, CONTACT.leadNotes, lead.notes);
  if (lead.pollResponses && Object.keys(lead.pollResponses).length) {
    setProp(p, CONTACT.stressTestAnswers, JSON.stringify(lead.pollResponses));
  }

  // Lifecycle fields are OFF by default because they don't exist in the portal
  // yet (sending them would force a wasteful drop-and-retry on every submit).
  // To enable: create these properties in HubSpot, then set
  // HUBSPOT_WRITE_LIFECYCLE=true. The safe-retry still protects against any other
  // unexpected unknown property.
  if (process.env.HUBSPOT_WRITE_LIFECYCLE === "true") {
    const now = Date.now();
    setProp(p, CONTACT.capturedAt, now);
    setProp(p, CONTACT.lastFormActivityDate, now);
    setProp(p, CONTACT.leadCaptureStage, lead.partial ? "partial" : "full_submission");
    if (lead.marketingConsent) {
      setProp(p, CONTACT.consentTimestamp, now);
      setProp(p, CONTACT.consentSourcePage, lead.sourcePage);
    }
  }
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
  setProp(p, DEAL.dealname, `${who} - ${lead.verticalTitle || "Business Funding"}`);

  if (lead.amountNeeded) {
    setProp(p, DEAL.amount, AMOUNT_NUMERIC[lead.amountNeeded]);
    setProp(p, DEAL.amountRequested, AMOUNT_NUMERIC[lead.amountNeeded]);
  }
  setProp(p, DEAL.productType, PIPELINE.defaultProductType);
  setProp(p, DEAL.dealStatus, "in_progress");
  setProp(p, DEAL.fundingReadinessScore, score.score);
  setProp(p, DEAL.leadCategory, bandToHubSpotCategory(score.band));
  setProp(p, DEAL.pipeline, PIPELINE.id);
  // Route by band: Green → Prequalified Green, Yellow → Prequalified Yellow,
  // everything else → New Lead. Falls back to the default stage.
  const stageByBand =
    score.band === "green"
      ? MCA_PIPELINE_STAGES.prequalified_green
      : score.band === "yellow"
        ? MCA_PIPELINE_STAGES.prequalified_yellow
        : MCA_PIPELINE_STAGES.new_lead;
  setProp(p, DEAL.dealStage, stageByBand || PIPELINE.defaultStageId);
  return p;
}

/* ── object upserts ─────────────────────────────────────────────────────── */

/** Pull invalid property names out of a HubSpot 400 validation body. */
function extractInvalidProps(text: string): string[] {
  const names = new Set<string>();
  // HubSpot embeds the offending names as ESCAPED JSON inside `message`
  // (e.g. \"name\":\"captured_at\"), so allow optional backslashes around quotes.
  const re = /\\?"name\\?"\s*:\s*\\?"([^"\\]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) names.add(m[1]);
  return [...names];
}

/**
 * Run a property-bearing request; if HubSpot rejects unknown properties
 * (PROPERTY_DOESNT_EXIST), drop just those and retry once. This makes the
 * integration resilient to custom properties that haven't been created yet.
 */
async function requestWithRetry(
  makeRequest: (props: Props) => Promise<Response>,
  props: Props,
): Promise<Response> {
  const res = await makeRequest(props);
  if (res.status !== 400) return res;
  const text = await res.clone().text();
  if (!/PROPERTY_DOESNT_EXIST|does not exist/i.test(text)) return res;
  const bad = extractInvalidProps(text).filter((n) => n in props);
  if (!bad.length) return res;
  const cleaned: Props = { ...props };
  for (const n of bad) delete cleaned[n];
  // eslint-disable-next-line no-console
  console.warn("[hubspot] dropping unknown propert(ies):", bad.join(", "));
  return makeRequest(cleaned);
}

async function upsertContact(props: Props, email?: string): Promise<string> {
  const make = (p: Props) =>
    email
      ? hsFetch("/crm/v3/objects/contacts/batch/upsert", "POST", {
          inputs: [{ idProperty: "email", id: email, properties: p }],
        })
      : hsFetch("/crm/v3/objects/contacts", "POST", { properties: p });
  const res = await requestWithRetry(make, props);
  if (!res.ok) throw new Error(await readError(res));
  const json = await res.json();
  return email
    ? (json as { results: { id: string }[] }).results[0].id
    : (json as { id: string }).id;
}

/** Find an existing company by domain (preferred) or exact name, to avoid dupes. */
async function findCompanyId(domain?: string, name?: string): Promise<string | null> {
  const filter = domain
    ? { propertyName: "domain", operator: "EQ", value: domain }
    : name
      ? { propertyName: "name", operator: "EQ", value: name }
      : null;
  if (!filter) return null;
  const res = await hsFetch("/crm/v3/objects/companies/search", "POST", {
    filterGroups: [{ filters: [filter] }],
    properties: ["domain"],
    limit: 1,
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { results?: { id: string }[] };
  return json.results?.[0]?.id ?? null;
}

// HubSpot doesn't allow batch upsert by `domain` (not a unique idProperty), so we
// search → update-or-create. This also dedupes across partial + full submissions.
async function upsertCompany(props: Props): Promise<string | null> {
  if (!props[COMPANY.name]) return null;
  const existingId = await findCompanyId(props[COMPANY.domain], props[COMPANY.name]);
  const make = (p: Props) =>
    existingId
      ? hsFetch(`/crm/v3/objects/companies/${existingId}`, "PATCH", { properties: p })
      : hsFetch("/crm/v3/objects/companies", "POST", { properties: p });
  const res = await requestWithRetry(make, props);
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { id: string };
  return json.id;
}

async function createDeal(props: Props): Promise<string> {
  const make = (p: Props) => hsFetch("/crm/v3/objects/deals", "POST", { properties: p });
  const res = await requestWithRetry(make, props);
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { id: string };
  return json.id;
}

/** Find an existing deal already associated with a contact (avoids duplicate deals on resubmit). */
async function findDealIdForContact(contactId: string): Promise<string | null> {
  const res = await hsFetch(`/crm/v4/objects/contacts/${contactId}/associations/deals`, "GET");
  if (!res.ok) return null;
  const json = (await res.json()) as { results?: { toObjectId?: string | number; id?: string }[] };
  const first = json.results?.[0];
  const id = first?.toObjectId ?? first?.id;
  return id != null ? String(id) : null;
}

async function patchDeal(id: string, props: Props): Promise<void> {
  const res = await requestWithRetry(
    (p: Props) => hsFetch(`/crm/v3/objects/deals/${id}`, "PATCH", { properties: p }),
    props,
  );
  if (!res.ok) throw new Error(await readError(res));
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
    // Independent calls run in parallel to stay well under the function timeout.
    const [contactId, companyId] = await Promise.all([
      upsertContact(buildContactProps(lead, score), lead.email),
      lead.businessName ? upsertCompany(buildCompanyProps(lead)) : Promise.resolve<string | null>(null),
    ]);
    if (companyId) await associateDefault("contacts", contactId, "companies", companyId);

    // Partial leads stop here — Contact (+ Company) only, no Deal.
    if (lead.partial) {
      return { ok: true, contactId, companyId: companyId ?? undefined, band: score.band, score: score.score };
    }

    // Idempotent: update the existing deal (refresh score/stage) instead of
    // creating a duplicate when a lead resubmits.
    const existingDealId = await findDealIdForContact(contactId);
    let dealId: string;
    if (existingDealId) {
      await patchDeal(existingDealId, buildDealProps(lead, score));
      dealId = existingDealId;
    } else {
      dealId = await createDeal(buildDealProps(lead, score));
      await Promise.all([
        associateDefault("deals", dealId, "contacts", contactId),
        companyId ? associateDefault("deals", dealId, "companies", companyId) : Promise.resolve(),
      ]);
    }

    return { ok: true, contactId, companyId: companyId ?? undefined, dealId, band: score.band, score: score.score };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[hubspot] submit failed:", error);
    return { ok: false, error, band: score.band, score: score.score };
  }
}
