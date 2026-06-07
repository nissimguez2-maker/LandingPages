/**
 * Cash-Flow Stress Test copy and config. Four questions: a drag-to-rank, a swipe
 * poll (three signals in one screen), and two quick taps. Plain, easy English.
 * No em-dashes. Compliance-locked (no approval/guarantee, factor rate is not an
 * APR, payments fit cash flow, estimate not an offer).
 */

import type { Option, UseOfFundsValue, RevenueValue, TimeInBusinessValue } from "@/lib/types";
import type { SwipeCard } from "@/components/stresstest/SwipePoll";
import type { ExposureTier, FitKey } from "@/lib/stressTest";

export const STRESS_INTRO = {
  eyebrow: "2-minute cash-flow check",
  headline: "How would your business handle a slow week?",
  subhead:
    "Four quick questions. No credit check. You will see where your money runs short, and what can help.",
  startLabel: "Start the check",
};

/* Q1 drag-to-rank: top card sets use of funds. No neutral option in a forced rank. */
export const RANK_OPTIONS = [
  { value: "inventory", label: "Buying stock or supplies" },
  { value: "payroll", label: "Making payroll" },
  { value: "equipment", label: "Fixing or buying equipment" },
  { value: "expansion", label: "Growing or taking a bigger job" },
  { value: "debt_refinance", label: "Paying down what I already owe" },
] as const satisfies readonly Option<UseOfFundsValue>[];

export const RANK_MIRROR: Record<string, string> = {
  inventory: "So growth waits on money you do not have yet. That is timing, not your sales.",
  payroll: "Payroll should never be the thing you sweat. That is a timing problem, not a you problem.",
  equipment: "Every repair you put off ends up costing more than the fix.",
  expansion: "You are turning down work you could win, because the cash is not in yet. That is the costliest no there is.",
  debt_refinance: "Stacked payments pull from every deposit. A better setup beats piling on more.",
};

/* Q2 swipe poll: three signals captured on one screen. */
export const SWIPE_CARDS: SwipeCard[] = [
  {
    id: "nsfs",
    prompt: "In the last 3 months, did your account go negative or bounce a payment?",
    help: "This is normal for many owners. An honest answer helps us help you.",
    yes: "a_few",
    no: "none",
    skip: "not_sure",
  },
  {
    id: "debt",
    prompt: "Are you already paying back a business loan or cash advance?",
    yes: "one",
    no: "none",
    skip: "not_sure",
    followUp: {
      prompt: "Just one, or more than one?",
      left: { label: "Just one", value: "one" },
      right: { label: "Two or more", value: "multiple" },
    },
  },
  {
    id: "urgency",
    prompt: "Do you need this money soon, not someday?",
    yes: "this_week",
    no: "exploring",
    skip: "this_month",
  },
];

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

export const REVENUE_STEP = {
  prompt: "How much money goes into your business account each month?",
  help: "A close guess is fine. We mean total deposits, not profit.",
  options: REV_OPTS,
  mirror: {
    under_10k: "Lean. Every dollar has to work, so timing hits hardest here.",
    "10k_20k": "Good base. You are right where funding starts to really help.",
    "20k_50k": "Real money in. If it still feels tight, the timing is the problem, not the sales.",
    "50k_150k": "Strong deposits. Owners here usually have the most room to move.",
    "150k_plus": "Big volume. Up here, standing still costs the most.",
  } as Record<string, string>,
};

export const TIME_STEP = {
  prompt: "How long has your business been open?",
  help: "Count from the day you started taking sales.",
  options: TIME_OPTS,
  mirror: {
    under_3m: "Early days. Every bit of momentum counts now.",
    "3_12m": "You proved it works. This is where funding helps you grow, not stall.",
    "1_2y": "Past the hard part. Now it is about not leaving money on the table.",
    "2y_plus": "You built something real. That track record opens better options.",
  } as Record<string, string>,
};

export const STRESS_TEASER = {
  eyebrow: "Your cash-flow read",
  meterLabel: "How much a slow week would hurt",
};

export const TIER_REVEAL: Record<ExposureTier, { label: string; headline: string; body: string }> = {
  resilient: {
    label: "Steady",
    headline: "Your cash flow looks steady",
    body: "You hold up most weeks. But most weeks is not every week. The owners who stay steady are the ones who line up funding before the slow week, not during it.",
  },
  exposed: {
    label: "Running short",
    headline: "A slow week would hurt right now",
    body: "Your business works hard. The money just comes in slower than the bills go out. Close that gap and you grow with less stress.",
  },
  stretched: {
    label: "Tight on cash",
    headline: "Money is tight right now",
    body: "You carry more than you should have to, and you feel it. The good part is that naming the problem is the hard part, and you just did it.",
  },
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

/* Shown BEFORE the gate, while the cost of waiting is on screen. */
export const PAYBACK_CLOSE = {
  title: "How owners who get ahead think about it",
  points: [
    "The gap costs you money either way. Late fees. Missed orders. Nights doing math instead of running your shop.",
    "You see the full payback before you start. It is one set price, called a factor rate, not an APR. No surprises.",
    "So ask one question. What is one filled order, one covered payroll, or one fixed machine worth to you?",
  ],
};

/* The gate. Confident, not needy. The component adds a 1-line summary of their own answers. */
export const STRESS_CONTACT = {
  headline: "See your full plan",
  sub: "Tell us where to send it. A specialist reviews the files worth pursuing and reaches out.",
  fields: {
    firstName: { label: "First name", help: "So we know who we are talking to." },
    businessName: { label: "Business name", help: "The name on your sales or deposits." },
    phone: { label: "Best phone number", help: "How a specialist reaches you." },
    email: { label: "Email", help: "We send a copy of your plan here." },
  },
  consent:
    "I agree that FundVella and a funding specialist can call and text me at this number, including by autodialer. This is not required to get help. Message and data rates may apply. Reply STOP anytime.",
  consentNote: "This box is optional.",
  button: "See My Plan",
  reassure: "No credit check. No obligation.",
};

export const STRESS_PAYOFF = {
  fixTitle: "Fix this first",
  bookTitle: "Lock in your call",
  bookSub: "Pick a time and a specialist will have your read in front of them. Booked beats waiting.",
  bookLabel: "Grab a time now",
  callbackTitle: "A specialist will reach out",
  callbackSub: "They review the files worth pursuing and follow up using the details you gave.",
  enrichToggle: "Add a few details to speed up your call",
  disclaimer:
    "This is an estimate, not an offer. Approval depends on underwriting, which is a quick review of your business. A factor rate is not an APR. Payments are built to fit your cash flow.",
};

/* The slim, optional enrichment step (pre-filled, skippable). */
export const STRESS_ENRICH = {
  title: "Speed up your call (optional)",
  sub: "Answer what you can. Skip anything you are not sure about.",
  amount: "How much are you looking for?",
  bank: "Can you share 3 to 4 months of business bank statements?",
  lastName: { label: "Last name (optional)", help: "" },
  state: { label: "What state is your business in?", help: "Helps us check what you can get." },
  saveLabel: "Save and finish",
  skipLabel: "Skip for now",
  doneTitle: "All set. Thank you.",
  doneSub: "A specialist will follow up. Keep your phone close.",
};
