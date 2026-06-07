/**
 * Cash-Flow Stress Test — all copy, config-driven and shared across every
 * vertical + the catch-all. Per-vertical flavor comes for free from each
 * config's `cashFlowSignature` (the Step-1 "Sound familiar?" mirror) and
 * `calcContext` (intro subhead) — so there's no per-slug copy to maintain.
 *
 * Compliance-locked: no dollar amount, no "approval/guaranteed/instant", factor
 * rate is explicitly NOT an APR, "payments fit cash flow", "estimate not an offer".
 */

import type { Option, UseOfFundsValue } from "@/lib/types";
import {
  REVENUE_OPTIONS,
  TIME_IN_BUSINESS_OPTIONS,
  NSF_OPTIONS,
  EXISTING_DEBT_OPTIONS,
  URGENCY_OPTIONS,
} from "@/lib/types";
import type { StressAnswers, ExposureTier, FitKey } from "@/lib/stressTest";

type StressField = keyof StressAnswers;

export interface StressStep {
  id: string;
  field: StressField;
  prompt: string;
  help?: string;
  options: readonly Option[];
  columns?: 1 | 2 | 3 | 4;
  /** Per-answer "mirror" reaction — the WHY engine. Keyed by option value. */
  mirror: Record<string, string>;
}

export const STRESS_INTRO = {
  eyebrow: "60-second cash-flow stress test",
  headline: "How would your cash flow handle a bad week?",
  subhead:
    "Six quick taps — no credit pull, and nothing is saved until you choose to continue. You'll see exactly where your cash flow is exposed, and what to do about it.",
  startLabel: "Start the stress test",
};

/** Step 1 uses use-of-funds VALUES but pressure-point WORDING. */
const PRESSURE_OPTIONS = [
  { value: "inventory", label: "Stock or inventory I delay buying" },
  { value: "payroll", label: "Payroll I sweat over" },
  { value: "equipment", label: "Repairs or equipment I put off" },
  { value: "expansion", label: "Growth I can't say yes to yet" },
  { value: "working_capital", label: "Nothing — I keep a buffer" },
] as const satisfies readonly Option<UseOfFundsValue>[];

export const STRESS_STEPS: StressStep[] = [
  {
    id: "pressure",
    field: "useOfFunds",
    prompt: "When money's due before money's in, what gives first?",
    help: "Most owners feel at least one of these every single month.",
    options: PRESSURE_OPTIONS,
    columns: 1,
    mirror: {
      inventory: "So growth waits on cash you don't have yet. That's the gap talking — not your demand.",
      payroll: "Payroll should never be the thing you sweat. That's a timing problem, not a you problem.",
      equipment: "Every repair you put off quietly costs more than the fix would have.",
      expansion: "Read that back: you're turning down growth over timing, not demand. That's the most expensive problem there is.",
      working_capital: "A buffer is smart. The owners who win build it before they need it — not during the crunch.",
    },
  },
  {
    id: "revenue",
    field: "monthlyRevenue",
    prompt: "On a normal month, what lands in the business account?",
    help: "Card batches, settlements, draws, collections — however the money comes in.",
    options: REVENUE_OPTIONS,
    columns: 1,
    mirror: {
      under_10k: "Lean. Every dollar has to work — which is exactly when timing hurts the most.",
      "10k_20k": "Solid base. You're right at the line where capital starts unlocking real moves.",
      "20k_50k": "Real cash flow. If it still feels tight, the gap — not the revenue — is the problem.",
      "50k_150k": "Strong deposits. Owners at this level usually have the most room to move.",
      "150k_plus": "Serious volume. Up here, the cost of standing still is the highest.",
    },
  },
  {
    id: "time",
    field: "timeInBusiness",
    prompt: "How long have you been building this?",
    options: TIME_IN_BUSINESS_OPTIONS,
    columns: 2,
    mirror: {
      under_3m: "Early days — momentum is everything right now.",
      "3_12m": "You've proven it works. This is the stage where capital separates who scales from who stalls.",
      "1_2y": "Past survival mode. Now it's about not leaving growth on the table.",
      "2y_plus": "You've built something real. That track record usually opens the strongest options.",
    },
  },
  {
    id: "nsfs",
    field: "recentNsfs",
    prompt: "In the last 90 days, has the account ever cut it closer than you'd like?",
    help: "Overdrafts, NSFs, or days the balance dipped near zero.",
    options: NSF_OPTIONS,
    columns: 2,
    mirror: {
      none: "Disciplined. That's exactly why capital becomes a growth tool in your hands, not a lifeline.",
      a_few: "Those fees are the gap charging you rent — money that should've stayed in your business.",
      several: "Then this isn't a someday problem. The good news: you just took the first step.",
      not_sure: "Worth a look — the statements always tell the real story.",
    },
  },
  {
    id: "debt",
    field: "existingDebt",
    prompt: "Already carrying payments on advances or loans?",
    help: "Any business loans, advances, or credit lines you're repaying now.",
    options: EXISTING_DEBT_OPTIONS,
    columns: 1,
    mirror: {
      none: "A clean slate is the strongest position to walk in from.",
      one: "One payment is manageable — and it shows you've used capital and kept going.",
      multiple: "Stacked payments quietly eat your day. The smart move is a better structure, not more of the same.",
      not_sure: "No problem — a specialist can map it out with you.",
    },
  },
  {
    id: "urgency",
    field: "urgency",
    prompt: "How soon do you want this handled?",
    options: URGENCY_OPTIONS,
    columns: 2,
    mirror: {
      immediately: "Then let's not slow you down.",
      this_week: "Moving early beats scrambling later.",
      this_month: "Smart to line it up before you actually need it.",
      exploring: "No pressure — knowing your options now beats finding out under pressure.",
    },
  },
];

export const TIER_REVEAL: Record<ExposureTier, { headline: string; body: string }> = {
  resilient: {
    headline: "Resilient — with a pressure point or two",
    body: "Your cash flow holds up most weeks. But 'most weeks' isn't every week, and the owners who stay ahead close the gaps before a bad one shows up.",
  },
  exposed: {
    headline: "Exposed — a normal bad week would pinch",
    body: "Your business is working; your cash flow is fighting it. That gap is the only thing standing between where you are and where you're headed.",
  },
  stretched: {
    headline: "Stretched — little room for a surprise",
    body: "You're carrying more weight than you should have to, and you already feel it. The good news: naming it is the hard part — and you just did.",
  },
};

export const FIT_COPY: Record<FitKey, { title: string; rationale: string }> = {
  mca: {
    title: "Working Capital Advance",
    rationale:
      "When the problem is timing, you don't need the cheapest option — you need the one that fits. Funding is sized to your deposits and repaid as a small share of sales, so it flexes with a slow week instead of fighting it. A factor rate (not an APR) sets your total payback up front.",
  },
  equipment: {
    title: "Equipment Financing",
    rationale:
      "The equipment earns while you pay for it. Financing it means the asset starts paying you back now — and your cash stays free for payroll and the day-to-day.",
  },
  line: {
    title: "Business Line of Credit",
    rationale:
      "Stop reacting to every tight week. Draw what you need, pay down what you don't, and keep capital on standby for the next gap.",
  },
  factoring: {
    title: "Invoice Factoring",
    rationale:
      "You already did the work — don't let slow-paying clients hold it hostage. Turn unpaid invoices into cash you can use now.",
  },
};

export const PAYBACK_CLOSE = {
  title: "Here's how the owners who get ahead think about it",
  points: [
    "The gap costs you whether you act or not — in late fees, passed-up orders, and nights spent doing math instead of building.",
    "Your total payback is set up front by a simple factor rate (that's total payback, not an APR) and structured to fit the way your money already moves.",
    "So ask the only question that matters: what's one filled order, one covered payroll, one problem solved on time actually worth to your business?",
  ],
};

export const STRESS_CTA = "See what you may qualify for";
