/**
 * Form completeness — a single definition the client uses to display/track
 * progress and that a backend can reuse for authoritative values. Keeps the
 * "form_completion_percentage" and "missing_information" fields consistent.
 */

import type { LeadData } from "./types";

const TRACKED_FIELDS: { key: keyof LeadData; label: string }[] = [
  { key: "monthlyRevenue", label: "Monthly revenue" },
  { key: "timeInBusiness", label: "Time in business" },
  { key: "amountNeeded", label: "Amount needed" },
  { key: "urgency", label: "Urgency" },
  { key: "existingDebt", label: "Existing financing" },
  { key: "paymentBurden", label: "Current payment burden" },
  { key: "recentNsfs", label: "Recent NSFs / negative days" },
  { key: "useOfFunds", label: "Use of funds" },
  { key: "canProvideBankStatements", label: "Bank statements availability" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "businessName", label: "Business name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "state", label: "State" },
];

function hasValue(v: unknown): boolean {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

export function computeCompleteness(lead: LeadData): {
  percentage: number;
  missing: string[];
} {
  const filled = TRACKED_FIELDS.filter((f) => hasValue(lead[f.key]));
  const missing = TRACKED_FIELDS.filter((f) => !hasValue(lead[f.key])).map((f) => f.label);
  const percentage = Math.round((filled.length / TRACKED_FIELDS.length) * 100);
  return { percentage, missing };
}
