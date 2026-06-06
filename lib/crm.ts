/**
 * CRM-agnostic entrypoint. The app only ever calls submitLeadToCRM(); swapping
 * or adding a CRM means editing only this file, not any call site.
 */

import type { LeadData } from "./types";
import { submitLeadToHubSpot, type CrmResult } from "./hubspot";

export type { CrmResult };

export async function submitLeadToCRM(lead: LeadData): Promise<CrmResult> {
  return submitLeadToHubSpot(lead);
}
