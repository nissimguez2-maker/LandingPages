import "server-only";

import { buildLeadProfile } from "@/lib/application";
import type { LeadData } from "@/lib/types";

/**
 * HubSpot CRM upsert (contacts), keyed by email. Used by both lead "pipes":
 * FundVella (auto, on capture) and FinBiz (batch import). Tags every contact
 * with `lead_brand` and maps the fv_* underwriting properties.
 *
 * Best-effort: failures are swallowed (the event also goes to n8n), and the call
 * is time-bounded so it never hangs the request.
 */

const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const BASE = "https://api.hubapi.com";

export interface HubspotUpsertOpts {
  brand?: "FundVella" | "FinBiz" | string;
  band?: string;
  temperature?: string;
  score?: number;
  status?: string;
}

export function isHubspotConfigured(): boolean {
  return Boolean(TOKEN);
}

function set(props: Record<string, string>, key: string, value: unknown): void {
  if (value === undefined || value === null || value === "") return;
  props[key] = String(value);
}

/** Build the HubSpot contact property map from a lead. */
export function leadToContactProps(lead: LeadData, opts: HubspotUpsertOpts = {}): Record<string, string> {
  const profile = buildLeadProfile(lead);
  const props: Record<string, string> = {};
  set(props, "email", lead.email);
  set(props, "firstname", lead.firstName || lead.ownerFullName);
  set(props, "lastname", lead.lastName);
  set(props, "phone", lead.phone);
  set(props, "company", profile.businessName);
  set(props, "lead_brand", opts.brand || "FundVella");
  set(props, "fv_vertical", lead.industry);
  set(props, "fv_use_of_funds", lead.useOfFunds);
  set(props, "fv_urgency", lead.urgency);
  set(props, "fv_monthly_revenue_band", lead.monthlyRevenue);
  set(props, "fv_time_in_business", lead.timeInBusiness);
  set(props, "fv_amount_band", lead.amountNeeded);
  set(props, "fv_credit_band", lead.creditScoreBand);
  set(props, "fv_lead_band", opts.band);
  set(props, "fv_temperature", opts.temperature);
  set(props, "fv_lead_score", typeof opts.score === "number" ? opts.score : undefined);
  set(props, "fv_application_status", opts.status || lead.applicationStatus);
  set(props, "fv_application_id", lead.applicationId);
  set(props, "fv_ssn_last4", lead.ssnLast4);
  set(props, "fv_marketing_consent", typeof lead.marketingConsent === "boolean" ? lead.marketingConsent : undefined);
  set(props, "fv_utm_source", lead.utm?.utm_source);
  set(props, "fv_utm_medium", lead.utm?.utm_medium);
  set(props, "fv_utm_campaign", lead.utm?.utm_campaign);
  return props;
}

async function hubspotFetch(path: string, body: unknown): Promise<boolean> {
  if (!TOKEN) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/** Upsert a single contact by email. Returns true on success. */
export async function upsertHubspotContact(lead: LeadData, opts: HubspotUpsertOpts = {}): Promise<boolean> {
  if (!lead.email) return false; // email is the upsert key
  const properties = leadToContactProps(lead, opts);
  return hubspotFetch("/crm/v3/objects/contacts/batch/upsert", {
    inputs: [{ idProperty: "email", id: lead.email, properties }],
  });
}

/** Upsert a batch of contacts (used by the FinBiz import). HubSpot caps batches at 100. */
export async function upsertHubspotContacts(leads: LeadData[], opts: HubspotUpsertOpts = {}): Promise<number> {
  const inputs = leads
    .filter((l) => l.email)
    .map((l) => ({ idProperty: "email", id: l.email as string, properties: leadToContactProps(l, opts) }));
  if (!inputs.length) return 0;
  let ok = 0;
  for (let i = 0; i < inputs.length; i += 100) {
    const chunk = inputs.slice(i, i + 100);
    if (await hubspotFetch("/crm/v3/objects/contacts/batch/upsert", { inputs: chunk })) ok += chunk.length;
  }
  return ok;
}
