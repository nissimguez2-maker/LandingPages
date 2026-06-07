/**
 * Cash-Flow Stress Test copy. Config-driven, shared across every vertical.
 * Voice: professional but very easy English. Short sentences. No em-dashes.
 * Per-vertical flavor comes free from each config's `cashFlowSignature`.
 *
 * Compliance-locked: no dollar amount in the result, no "approval/guaranteed",
 * factor rate is NOT an APR, payments fit cash flow, estimate not an offer.
 */

import type { Option, UseOfFundsValue, RevenueValue, TimeInBusinessValue, NsfValue, ExistingDebtValue, UrgencyValue } from "@/lib/types";
import type { ExposureTier, FitKey } from "@/lib/stressTest";

export interface StressStep {
  id: string;
  field: "useOfFunds" | "monthlyRevenue" | "timeInBusiness" | "recentNsfs" | "existingDebt" | "urgency";
  prompt: string;
  help?: string;
  options: readonly Option[];
  columns?: 1 | 2 | 3 | 4;
  mirror: Record<string, string>;
}

export const STRESS_INTRO = {
  eyebrow: "60-second cash-flow check",
  headline: "How would your business handle a slow week?",
  subhead:
    "Six quick taps. No credit check. You will see where your money runs short, and what can help.",
  startLabel: "Start the check",
};

/* Friendly, easy labels. Values still match the form + scoring exactly. */
const USE_OPTS = [
  { value: "inventory", label: "Buying stock or supplies" },
  { value: "payroll", label: "Making payroll" },
  { value: "equipment", label: "Fixing or buying equipment" },
  { value: "expansion", label: "Growing or opening a new spot" },
  { value: "working_capital", label: "Nothing yet, but it gets tight" },
] as const satisfies readonly Option<UseOfFundsValue>[];

const REV_OPTS = [
  { value: "under_10k", label: "Less than $10,000" },
  { value: "10k_20k", label: "$10,000 to $20,000" },
  { value: "20k_50k", label: "$20,000 to $50,000" },
  { value: "50k_150k", label: "$50,000 to $150,000" },
  { value: "150k_plus", label: "More than $150,000" },
] as const satisfies readonly Option<RevenueValue>[];

const TIME_OPTS = [
  { value: "under_3m", label: "Less than 3 months" },
  { value: "3_12m", label: "3 to 12 months" },
  { value: "1_2y", label: "1 to 2 years" },
  { value: "2y_plus", label: "More than 2 years" },
] as const satisfies readonly Option<TimeInBusinessValue>[];

const NSF_OPTS = [
  { value: "none", label: "No, never" },
  { value: "a_few", label: "Once or twice" },
  { value: "several", label: "Many times" },
  { value: "not_sure", label: "Not sure" },
] as const satisfies readonly Option<NsfValue>[];

const DEBT_OPTS = [
  { value: "none", label: "No, none" },
  { value: "one", label: "Yes, just one" },
  { value: "multiple", label: "Yes, two or more" },
  { value: "not_sure", label: "Rather not say yet" },
] as const satisfies readonly Option<ExistingDebtValue>[];

const URG_OPTS = [
  { value: "immediately", label: "Right away" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "exploring", label: "Just looking" },
] as const satisfies readonly Option<UrgencyValue>[];

export const STRESS_STEPS: StressStep[] = [
  {
    id: "pressure",
    field: "useOfFunds",
    prompt: "When money gets tight, what is the first thing you put off?",
    help: "Pick the one that hurts most.",
    options: USE_OPTS,
    columns: 1,
    mirror: {
      inventory: "So growth waits on money you do not have yet. That is timing, not your sales.",
      payroll: "Payroll should never be the thing you sweat. That is a timing problem, not a you problem.",
      equipment: "Every repair you put off ends up costing more than the fix.",
      expansion: "You are saying no to work you could win. Not because it is slow, but because the cash is not in yet.",
      working_capital: "Smart to keep a cushion. The owners who win build it before they need it.",
    },
  },
  {
    id: "revenue",
    field: "monthlyRevenue",
    prompt: "How much money goes into your business account each month?",
    help: "A close guess is fine. We mean total deposits, not profit.",
    options: REV_OPTS,
    columns: 1,
    mirror: {
      under_10k: "Lean. Every dollar has to work, so timing hits the hardest here.",
      "10k_20k": "Good base. You are right at the point where funding can really help.",
      "20k_50k": "Real money coming in. If it still feels tight, the timing is the problem, not the sales.",
      "50k_150k": "Strong deposits. Owners at this level usually have the most room to move.",
      "150k_plus": "Big volume. Up here, standing still costs you the most.",
    },
  },
  {
    id: "time",
    field: "timeInBusiness",
    prompt: "How long has your business been open?",
    help: "Count from the day you started taking sales.",
    options: TIME_OPTS,
    columns: 2,
    mirror: {
      under_3m: "Early days. Every bit of momentum counts right now.",
      "3_12m": "You proved it works. Now the right funding helps you grow instead of stall.",
      "1_2y": "Past the hard part. Now it is about not leaving money on the table.",
      "2y_plus": "You built something real. That track record opens up better options.",
    },
  },
  {
    id: "nsfs",
    field: "recentNsfs",
    prompt: "In the last 3 months, did your account go negative or bounce a payment?",
    help: "This is normal for many owners. An honest answer helps us help you.",
    options: NSF_OPTS,
    columns: 2,
    mirror: {
      none: "Clean account. That is why funding works as a growth tool for you, not a lifeline.",
      a_few: "Those fees are money that should have stayed in your business.",
      several: "Then this is not a someday problem. The good news is you just took the first step.",
      not_sure: "No problem. The bank statements will tell the real story.",
    },
  },
  {
    id: "debt",
    field: "existingDebt",
    prompt: "Do you already pay back any business loan or cash advance?",
    help: "We just want to see your full picture.",
    options: DEBT_OPTS,
    columns: 1,
    mirror: {
      none: "A clean slate is the strongest spot to start from.",
      one: "One payment is fine. It shows you used funding before and kept going.",
      multiple: "Two or more payments add up fast. A better setup beats stacking more on top.",
      not_sure: "That is okay. A specialist can map it out with you.",
    },
  },
  {
    id: "urgency",
    field: "urgency",
    prompt: "How soon do you need the money?",
    help: "There is no wrong answer.",
    options: URG_OPTS,
    columns: 2,
    mirror: {
      immediately: "Then let us not slow you down.",
      this_week: "Moving early beats scrambling later.",
      this_month: "Smart to line it up before you need it.",
      exploring: "No pressure. Knowing your options now beats finding out the hard way.",
    },
  },
];

export const STRESS_TEASER = {
  eyebrow: "Your cash-flow read",
  meterLabel: "How much a slow week would hurt",
};

export const TIER_REVEAL: Record<ExposureTier, { label: string; headline: string; body: string }> = {
  resilient: {
    label: "Steady",
    headline: "Your cash flow looks steady",
    body: "You hold up most weeks. But most weeks is not every week. The owners who stay ahead fix the small gaps before a bad week shows up.",
  },
  exposed: {
    label: "Running short",
    headline: "A slow week would hurt right now",
    body: "Your business works hard. But the money comes in slower than the bills go out. Close that gap and you grow with less stress.",
  },
  stretched: {
    label: "Tight on cash",
    headline: "Money is tight right now",
    body: "You carry more than you should have to, and you feel it. The good part is that naming the problem is the hard part, and you just did it.",
  },
};

/* The lead gate. A little aggressive, still honest. */
export const STRESS_CONTACT = {
  headline: "Your full read is ready",
  sub: "Add your info to see your best match and your next step. It takes 20 seconds.",
  nudge: "Owners who stop here leave their results on the table. You earned them. Go get them.",
  fields: {
    firstName: { label: "First name", help: "So we know who we are talking to." },
    businessName: { label: "Business name", help: "The name on your sales or deposits." },
    phone: { label: "Best phone number", help: "We use this to share your results and options." },
    email: { label: "Email", help: "We send a copy of your results here." },
  },
  consent:
    "I agree that FundVella and a funding specialist can call and text me at this number, including by autodialer. This is not required to get help. Message and data rates may apply. Reply STOP anytime.",
  consentNote: "This box is optional.",
  button: "See My Full Results",
  reassure: "No credit check. No obligation. You decide what happens next.",
};

export const FIT_COPY: Record<FitKey, { title: string; rationale: string }> = {
  mca: {
    title: "Working Capital Advance",
    rationale:
      "When the problem is timing, you do not need the cheapest money. You need money that fits. The amount is based on your sales. You pay back a small share of what comes in, so on a slow week you pay less. A factor rate, not an APR, sets your total payback up front.",
  },
  equipment: {
    title: "Equipment Financing",
    rationale:
      "The gear pays for itself while you pay it off. You put it to work now, and your cash stays free for payroll and the day to day.",
  },
  line: {
    title: "Business Line of Credit",
    rationale:
      "Stop sweating every slow week. Take what you need, pay it back, and keep money ready for the next gap.",
  },
  factoring: {
    title: "Invoice Factoring",
    rationale:
      "You already did the work. Do not let a slow-paying customer sit on your money. Turn unpaid invoices into cash you can use now.",
  },
};

export const PAYBACK_CLOSE = {
  title: "How owners who get ahead think about it",
  points: [
    "The gap costs you money either way. Late fees. Missed orders. Nights doing math instead of running your shop.",
    "You see the full payback before you start. It is one set price, called a factor rate, not an APR. No surprises.",
    "So ask one question. What is one filled order, one covered payroll, or one fixed machine worth to you?",
  ],
};

export const STRESS_PAYOFF = {
  fixTitle: "Fix this first",
  ctaLabel: "Talk To A Specialist Now",
  ctaSub: "Money does not show up on its own. The sooner you talk to someone, the sooner the gap closes.",
  disclaimer:
    "This is an estimate, not an offer. Approval depends on underwriting, which is a quick review of your business. A factor rate is not an APR. Payments are built to fit your cash flow.",
};
