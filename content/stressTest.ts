/**
 * Cash-Flow Stress Test copy and config. Five quick questions: tap buttons plus
 * one swipe (the debt question). The read measures FUNDING STRENGTH, so a strong
 * business sees a high number and a reason to act, never "you are fine." Plain,
 * easy English. No em-dashes. Compliance-locked (no approval/guarantee, factor
 * rate is not an APR, payments fit cash flow, estimate not an offer).
 */

import type { Option, UseOfFundsValue, RevenueValue, TimeInBusinessValue, UrgencyValue } from "@/lib/types";
import type { SwipeCard } from "@/components/stresstest/SwipePoll";
import type { ExposureTier, FitKey } from "@/lib/stressTest";

export const STRESS_INTRO = {
  eyebrow: "60-second funding check",
  headline: "See how much capital your business could put to work.",
  subhead:
    "A few quick questions. No credit check. You get a quick read on your funding strength, plus the smartest next move.",
  startLabel: "Start the check",
};

/* Q1 tap: what they would put money toward (sets use of funds). */
export const USE_OPTIONS = [
  { value: "expansion", label: "Take on a bigger job or order" },
  { value: "inventory", label: "Buy stock or supplies" },
  { value: "equipment", label: "Fix or buy equipment" },
  { value: "payroll", label: "Cover payroll or a slow stretch" },
  { value: "debt_refinance", label: "Clean up what I already owe" },
] as const satisfies readonly Option<UseOfFundsValue>[];

export const USE_MIRROR: Record<string, string> = {
  expansion: "That is the costliest no there is. The work is there, the cash just is not in yet.",
  inventory: "Buy right and you sell more. That is timing, not your sales.",
  equipment: "Every repair you put off ends up costing more than the fix.",
  payroll: "Payroll should never be the thing you sweat. That is a timing problem, not a you problem.",
  debt_refinance: "Stacked payments pull from every deposit. A better setup beats piling on more.",
};

/* The one swipe question: existing debt, with a one vs more follow-up. */
export const SWIPE_CARDS: SwipeCard[] = [
  {
    id: "debt",
    prompt: "Are you already paying back a business loan or cash advance?",
    help: "A straight answer helps us find the smartest setup for you.",
    yes: "one",
    no: "none",
    skip: "not_sure",
    followUp: {
      prompt: "Just one, or more than one?",
      left: { label: "Just one", value: "one" },
      right: { label: "Two or more", value: "multiple" },
    },
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

const URGENCY_OPTS = [
  { value: "immediately", label: "Right now, it is urgent" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "exploring", label: "Just looking for now" },
] as const satisfies readonly Option<UrgencyValue>[];

export const URGENCY_STEP = {
  prompt: "How soon would you put the money to work?",
  help: "There is no wrong answer. It just helps us line up the right next step.",
  options: URGENCY_OPTS,
  mirror: {
    immediately: "Then every day counts. The fastest path is a quick call.",
    this_week: "Soon. Good. Owners who line it up early usually have more options to explore.",
    this_month: "A clear window. Lining it up now beats scrambling later.",
    exploring: "Smart. The best time to set up funding is before you need it.",
  } as Record<string, string>,
};

export const STRESS_TEASER = {
  eyebrow: "Your funding read",
  meterLabel: "Your funding strength",
};

export const TIER_REVEAL: Record<ExposureTier, { label: string; headline: string; body: string }> = {
  resilient: {
    label: "Strong",
    headline: "Owners with numbers like yours usually have the most options to explore. That is exactly when to move.",
    body: "Numbers like yours are the kind funders like to see, so this is often when owners have the most options on the table to explore, not because you are desperate, but because you are not. Approval still depends on underwriting. The idea is simple. Money sitting still does not grow, so the time to explore your options is before you need them, while you have room to choose.",
  },
  exposed: {
    label: "Room to grow",
    headline: "You are strong enough to grow faster than you are.",
    body: "Your sales can carry more than your cash flow is letting you take on. That gap is the bigger job you pass on, or the stock you buy at full price later instead of at a discount now. Lined up the right way, that growth pays for itself.",
  },
  stretched: {
    label: "Tight on cash",
    headline: "Money is tight, and there is a clean way out of the squeeze.",
    body: "Too much is pulling from the same deposits, and you feel it every week. Here is the good part. The squeeze is the most fixable thing there is, and you just took the first step by naming it. A specialist can show you how to ease the pressure fast.",
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
    "Standing still is not free. Every week you wait is stock you did not buy, a job you did not take, or a customer a faster shop got first.",
    "The best time to line up capital is before you are desperate for it. That is when owners tend to have the most options to explore, with approval still depending on underwriting.",
    "You see the full payback up front. It is one set price, called a factor rate, not an APR. No surprises.",
  ],
};

/* The gate. Confident, not needy. The component adds a 1-line summary of their own answers. */
export const STRESS_CONTACT = {
  headline: "See your full plan",
  sub: "Tell us where to send it. A specialist pulls the options worth pursuing for a business like yours and reaches out.",
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
  bank: "Can you share 3 months of business bank statements?",
  creditBand: "Roughly, where's your personal credit?",
  ownsRealEstate: "Do you own your home or commercial property?",
  unpaidInvoices: "Is a good chunk of your cash stuck in unpaid invoices?",
  lastName: { label: "Last name (optional)", help: "" },
  state: { label: "What state is your business in?", help: "Helps us check what you can get." },
  saveLabel: "Save and finish",
  skipLabel: "Skip for now",
  doneTitle: "All set. Thank you.",
  doneSub: "A specialist will follow up. Keep your phone close.",
};
