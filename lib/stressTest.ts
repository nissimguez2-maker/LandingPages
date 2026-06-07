/**
 * Pure engine for the Cash-Flow Stress Test (no React, no window).
 *
 * The game surfaces PAIN, not a dollar amount. We compute an "Exposure" read
 * (higher = more exposed to a bad week) from the same signals underwriting cares
 * about, derive diagnostic "pressure points", recommend a product fit (MCA-led),
 * and build the sessionStorage prefill the prequal form reads.
 */

import type {
  LeadData,
  RevenueValue,
  TimeInBusinessValue,
  NsfValue,
  ExistingDebtValue,
  UseOfFundsValue,
  UrgencyValue,
} from "./types";

export interface StressAnswers {
  useOfFunds?: UseOfFundsValue;
  monthlyRevenue?: RevenueValue;
  timeInBusiness?: TimeInBusinessValue;
  recentNsfs?: NsfValue;
  existingDebt?: ExistingDebtValue;
  urgency?: UrgencyValue;
}

export type ExposureTier = "resilient" | "exposed" | "stretched";

export interface StressResult {
  exposure: number; // 0–100, higher = more exposed (more pain)
  tier: ExposureTier;
  pressurePoints: string[];
  fitKey: FitKey;
}

/** Exposure points per signal — higher means MORE exposed to a bad week. */
export function computeExposure(a: StressAnswers): number {
  let x = 0;
  switch (a.monthlyRevenue) {
    case "under_10k": x += 30; break;
    case "10k_20k": x += 18; break;
    default: x += a.monthlyRevenue ? 6 : 14;
  }
  switch (a.timeInBusiness) {
    case "under_3m": x += 25; break;
    case "3_12m": x += 15; break;
    case "1_2y": x += 6; break;
    case "2y_plus": x += 2; break;
    default: x += 12;
  }
  switch (a.recentNsfs) {
    case "several": x += 25; break;
    case "a_few": x += 14; break;
    case "not_sure": x += 8; break;
    case "none": x += 0; break;
    default: x += 10;
  }
  switch (a.existingDebt) {
    case "multiple": x += 22; break;
    case "one": x += 10; break;
    case "not_sure": x += 8; break;
    case "none": x += 0; break;
    default: x += 8;
  }
  switch (a.urgency) {
    case "immediately": x += 12; break;
    case "this_week": x += 9; break;
    case "this_month": x += 5; break;
    default: x += 0;
  }
  return Math.max(0, Math.min(100, Math.round(x)));
}

export function tierFor(exposure: number): ExposureTier {
  if (exposure >= 55) return "stretched";
  if (exposure >= 30) return "exposed";
  return "resilient";
}

/** Diagnostic findings worded as PAIN (never "boost your range"). Top 3. */
export function pressurePoints(a: StressAnswers): string[] {
  const out: string[] = [];
  if (a.monthlyRevenue === "under_10k" || a.monthlyRevenue === "10k_20k")
    out.push("Thin deposits leave little room when a week comes in slow.");
  if (a.timeInBusiness === "under_3m" || a.timeInBusiness === "3_12m")
    out.push("You are still early. There is not much cushion yet, so timing hits harder.");
  if (a.recentNsfs === "several")
    out.push("Tight days keep happening. One surprise could push the account negative.");
  else if (a.recentNsfs === "a_few")
    out.push("A few tight days mean your room for error is small.");
  if (a.existingDebt === "multiple")
    out.push("Two or more payments are pulling from the same deposits.");
  else if (a.existingDebt === "one")
    out.push("One payment is already pulling from every deposit.");
  if (a.urgency === "immediately" || a.urgency === "this_week")
    out.push("You said this is urgent. Every week you wait, it gets tighter.");
  // Everyone leaves with at least one finding (even strong shops).
  if (out.length === 0)
    out.push("Even strong shops get caught by timing. One big surprise can still hurt.");
  return out.slice(0, 3);
}

export type FitKey = "mca" | "equipment" | "line" | "factoring";

/** Use-of-funds → recommended product. MCA is the default/hero. */
export function fitFor(use?: UseOfFundsValue): FitKey {
  switch (use) {
    case "equipment": return "equipment";
    case "inventory": return "mca"; // MCA-led; line of credit is the soft alternative in copy
    case "debt_refinance": return "mca";
    default: return "mca";
  }
}

/** Build the partial LeadData the prequal form reads from sessionStorage. */
export function buildPrefill(a: StressAnswers, slug: string, contact?: Partial<LeadData>): Partial<LeadData> {
  return {
    industry: slug,
    ...(a.monthlyRevenue ? { monthlyRevenue: a.monthlyRevenue } : {}),
    ...(a.timeInBusiness ? { timeInBusiness: a.timeInBusiness } : {}),
    ...(a.recentNsfs ? { recentNsfs: a.recentNsfs } : {}),
    ...(a.existingDebt ? { existingDebt: a.existingDebt } : {}),
    ...(a.useOfFunds ? { useOfFunds: a.useOfFunds } : {}),
    ...(a.urgency ? { urgency: a.urgency } : {}),
    ...(contact ?? {}),
  };
}

/** One concrete "fix this first" action tied to the weakest signal (plain English). */
export function fixFirst(a: StressAnswers): string {
  if (a.existingDebt === "multiple")
    return "Ask a specialist about turning your current payments into one. Stacked payments are the fastest thing to fix.";
  if (a.recentNsfs === "several" || a.recentNsfs === "a_few")
    return "Build a small cash cushion so a slow week stops costing you overdraft fees.";
  if (a.monthlyRevenue === "under_10k" || a.monthlyRevenue === "10k_20k")
    return "Line up working capital before your next slow week, not during it.";
  if (a.timeInBusiness === "under_3m" || a.timeInBusiness === "3_12m")
    return "Keep your deposits steady. Time and steady sales open up better options.";
  return "Get working capital in place before you need it, so the next surprise does not set you back.";
}

export function runStressTest(a: StressAnswers): StressResult {
  const exposure = computeExposure(a);
  return { exposure, tier: tierFor(exposure), pressurePoints: pressurePoints(a), fitKey: fitFor(a.useOfFunds) };
}
