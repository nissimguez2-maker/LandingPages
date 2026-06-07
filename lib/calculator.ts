/**
 * Pure funding-estimate + readiness math (no React, no window) — testable and
 * shared by the calculator island. Produces ILLUSTRATIVE ranges only: never an
 * offer, never an APR, never a guarantee.
 *
 * Readiness uses the SAME directional signals as lib/leadScoring.ts (revenue,
 * time in business, NSFs, existing advances) but normalized to a 0–100 meter the
 * merchant can actually move — same green/yellow/red thresholds as scoreLead.
 */

import type {
  CalculatorConfig,
  TimeInBusinessValue,
  NsfValue,
  ExistingDebtValue,
  RevenueValue,
  LeadBand,
} from "./types";

export interface CalcInputs {
  monthly: number;
  timeInBusiness?: TimeInBusinessValue;
  recentNsfs?: NsfValue;
  existingDebt?: ExistingDebtValue;
}

export interface AdvanceEstimate {
  low: number;
  high: number;
  factorLow: number;
  factorHigh: number;
  holdbackLow: number;
  holdbackHigh: number;
  estPaymentLow: number;
  estPaymentHigh: number;
}

export interface Readiness {
  score: number; // 0–100
  band: LeadBand;
  nudges: string[]; // "boost your range" suggestions from the weakest signals
}

/** Map raw monthly deposits to the form's revenue band (keeps form in sync). */
export function revenueBand(monthly: number): RevenueValue {
  if (monthly < 10000) return "under_10k";
  if (monthly < 20000) return "10k_20k";
  if (monthly < 50000) return "20k_50k";
  if (monthly < 150000) return "50k_150k";
  return "150k_plus";
}

const round = (n: number, to: number) => Math.max(0, Math.round(n / to) * to);

// Underwriting-direction multipliers (same direction as scoreLead penalties).
const TIME_MULT: Record<TimeInBusinessValue, number> = {
  under_3m: 0.4,
  "3_12m": 0.7,
  "1_2y": 0.9,
  "2y_plus": 1.0,
};
const NSF_MULT: Record<NsfValue, number> = {
  none: 1.0,
  a_few: 0.8,
  several: 0.6,
  not_sure: 0.9,
};
const DEBT_MULT: Record<ExistingDebtValue, number> = {
  none: 1.0,
  one: 0.85,
  multiple: 0.5,
  not_sure: 0.9,
};

export function estimateAdvance(input: CalcInputs, cfg: CalculatorConfig): AdvanceEstimate {
  const clamped = Math.min(Math.max(input.monthly || 0, cfg.minMonthly), cfg.maxMonthly);

  const multLow = cfg.advanceMultipleLow ?? cfg.lowFactor;
  const multHigh = cfg.advanceMultipleHigh ?? cfg.highFactor;
  const factorLow = cfg.factorRateLow ?? 1.15;
  const factorHigh = cfg.factorRateHigh ?? 1.49;
  const holdbackLow = cfg.holdbackLow ?? 0.08;
  const holdbackHigh = cfg.holdbackHigh ?? 0.2;
  const termLow = cfg.termMonthsLow ?? 4;
  const termHigh = cfg.termMonthsHigh ?? 12;

  const modifier =
    (input.timeInBusiness ? TIME_MULT[input.timeInBusiness] : 0.85) *
    (input.recentNsfs ? NSF_MULT[input.recentNsfs] : 1.0) *
    (input.existingDebt ? DEBT_MULT[input.existingDebt] : 1.0);

  const low = round(clamped * multLow * modifier, 500);
  const high = round(clamped * multHigh * modifier, 500);

  // Illustrative payment band: cheapest = low advance, low factor, long term;
  // priciest = high advance, high factor, short term.
  const estPaymentLow = round((low * factorLow) / termHigh, 50);
  const estPaymentHigh = round((high * factorHigh) / termLow, 50);

  return { low, high, factorLow, factorHigh, holdbackLow, holdbackHigh, estPaymentLow, estPaymentHigh };
}

const bandFor = (score: number): LeadBand => (score >= 70 ? "green" : score >= 45 ? "yellow" : "red");

export function calcReadiness(input: CalcInputs): Readiness {
  let score = 0;
  const nudges: string[] = [];

  // Deposits (up to 35) — the biggest lever.
  const rb = revenueBand(input.monthly || 0);
  if (rb === "under_10k") {
    score += 8;
    nudges.push("Higher monthly deposits widen your range the most.");
  } else if (rb === "10k_20k") {
    score += 22;
  } else {
    score += 35;
  }

  // Time in business (up to 30).
  switch (input.timeInBusiness) {
    case "2y_plus":
      score += 30;
      break;
    case "1_2y":
      score += 26;
      break;
    case "3_12m":
      score += 15;
      nudges.push("More time in business strengthens your file.");
      break;
    case "under_3m":
      score += 4;
      nudges.push("More time in business strengthens your file.");
      break;
    default:
      score += 18;
  }

  // Recent NSFs / negative days (up to 20).
  switch (input.recentNsfs) {
    case "none":
      score += 20;
      break;
    case "not_sure":
      score += 12;
      break;
    case "a_few":
      score += 10;
      nudges.push("Fewer NSFs or negative days on recent statements helps.");
      break;
    case "several":
      score += 2;
      nudges.push("Fewer NSFs or negative days on recent statements helps.");
      break;
    default:
      score += 14;
  }

  // Existing advances / stacking (up to 15).
  switch (input.existingDebt) {
    case "none":
      score += 15;
      break;
    case "one":
      score += 9;
      break;
    case "multiple":
      score += 2;
      nudges.push("Paying down or consolidating existing advances frees up room.");
      break;
    case "not_sure":
      score += 9;
      break;
    default:
      score += 9;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, band: bandFor(score), nudges: nudges.slice(0, 3) };
}
