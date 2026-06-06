/**
 * Internal lead-scoring engine.
 *
 * One source of truth used in two places:
 *  - client-side, to fire green_lead / yellow_lead / red_lead analytics events
 *  - server-side (authoritative), to write funding_readiness_score + lead_category
 *
 * Bands:  70+  = Green (strong fit for review)
 *         45-69 = Yellow (needs review)
 *         < 45  = Red (may not be ready)
 *
 * Visitors NEVER see harsh rejection language — bands drive internal routing only.
 */

import type { LeadData, LeadScore, LeadBand } from "./types";

const PRODUCTIVE_USES = new Set([
  "inventory",
  "equipment",
  "payroll",
  "expansion",
  "marketing",
  "working_capital",
]);

export function scoreLead(lead: LeadData): LeadScore {
  let score = 0;
  const reasons: string[] = [];

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${points >= 0 ? "+" : ""}${points} ${reason}`);
  };

  // Monthly revenue
  switch (lead.monthlyRevenue) {
    case "20k_50k":
    case "50k_150k":
    case "150k_plus":
      add(25, "monthly revenue $20k+");
      break;
    case "10k_20k":
      add(10, "monthly revenue $10k–$20k");
      break;
    case "under_10k":
      add(-20, "monthly revenue under $10k");
      break;
  }

  // Time in business
  switch (lead.timeInBusiness) {
    case "1_2y":
    case "2y_plus":
      add(20, "12+ months in business");
      break;
    case "3_12m":
      add(5, "3–12 months in business");
      break;
    case "under_3m":
      add(-25, "under 3 months in business");
      break;
  }

  // Bank statements (key documents)
  let refusesDocuments = false;
  if (lead.canProvideBankStatements === "yes") {
    add(20, "can provide bank statements");
  } else if (lead.canProvideBankStatements === "no") {
    refusesDocuments = true;
    add(-20, "cannot provide key documents");
  }

  // Existing obligations
  if (lead.existingDebt === "one") {
    add(-5, "has an existing MCA/loan");
  } else if (lead.existingDebt === "multiple") {
    add(-20, "multiple existing advances");
  }

  // Recent NSFs / negative days
  if (lead.recentNsfs === "a_few" || lead.recentNsfs === "several") {
    add(-25, "recent NSFs / negative days");
  }

  // Urgency
  if (lead.urgency === "immediately" || lead.urgency === "this_week") {
    add(10, "near-term urgency");
  }

  // Productive use of funds
  if (lead.useOfFunds && PRODUCTIVE_USES.has(lead.useOfFunds)) {
    add(10, "clear productive use of funds");
  }

  // ── Hard rules ──────────────────────────────────────────────────────────
  // Reachable if we have at least one channel (email OR phone) — a strong file
  // shouldn't be capped just because phone was left blank.
  const hasContact = Boolean(lead.email) || Boolean(lead.phone);
  let band = bandFor(score);

  // No way to reach the lead => cannot be Green.
  if (!hasContact && band === "green") {
    band = "yellow";
    reasons.push("⚠ capped at Yellow: no contact channel");
  }

  // Refuses key documents => downgrade one band.
  if (refusesDocuments && band === "green") {
    band = "yellow";
    reasons.push("⚠ downgraded: refuses key documents");
  }

  return { score, band, reasons };
}

function bandFor(score: number): LeadBand {
  if (score >= 70) return "green";
  if (score >= 45) return "yellow";
  return "red";
}

/** Internal band -> HubSpot lead_category option value (hot/warm/cold). */
export function bandToHubSpotCategory(band: LeadBand): "hot" | "warm" | "cold" {
  return band === "green" ? "hot" : band === "yellow" ? "warm" : "cold";
}

/** Analytics event name for a band. */
export function bandEvent(band: LeadBand): "green_lead" | "yellow_lead" | "red_lead" {
  return `${band}_lead` as "green_lead" | "yellow_lead" | "red_lead";
}
