/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ALL vertical landing-page content lives here. Nothing is hardcoded in pages.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * To EDIT a page: change its object below.
 * To ADD a vertical: append a new VerticalConfig and add the route slug (the
 *   dynamic route + sitemap pick it up automatically). See README.
 *
 * Copy rules (compliance-safe):
 *   ✅ "You may qualify" · "Review available options" · "Approval depends on
 *      underwriting" · "Based on business revenue and bank activity" · "No
 *      obligation to accept an offer" · "Payments must fit cash flow" · "A
 *      funding specialist may contact you" · "Clean files can move faster"
 *   ❌ guaranteed/instant approval · cheap money · lowest rates · no risk ·
 *      bank loan · everyone qualifies · no documents needed
 *
 *   `cashFlowSignature` describes the merchant's PAIN, never a promised outcome.
 *   Use cases describe what capital is FOR (a use), never a guaranteed OUTCOME.
 *   Social-proof slots (testimonials/stats/logos) stay empty until REAL data
 *   is supplied — never fabricate.
 */

import type {
  VerticalConfig,
  FAQItem,
  FitRow,
  TrustSignal,
  CalculatorConfig,
} from "@/lib/types";

/** Fallback "What we look at" — used when a vertical sets no qualificationFocus. */
export const WHAT_WE_LOOK_AT: { title: string; description: string }[] = [
  { title: "Monthly deposits", description: "Steady deposits show the business can support new payments." },
  { title: "Time in business", description: "More operating history strengthens a review." },
  { title: "Bank activity", description: "Healthy day-to-day banking often matters more than one number." },
  { title: "Existing advances", description: "Current loans or advances — and how many run at once — affect what's realistic." },
  { title: "Recent NSFs", description: "Frequent bounced payments or negative-balance days can make a file harder to place." },
  { title: "Use of funds", description: "A clear, productive use of funds strengthens the file." },
];

/** Compliant, factual trust signals (NOT fabricated stats). Shared across verticals. */
export const DEFAULT_TRUST_SIGNALS: TrustSignal[] = [
  { icon: "lock", title: "Secure submission", description: "Your details are sent over an encrypted connection." },
  { icon: "user-check", title: "Reviewed by a specialist", description: "A real funding specialist reviews your file — not an instant algorithm." },
  { icon: "scale", title: "Revenue-first review", description: "Files are weighed on revenue and bank activity, not credit alone." },
  { icon: "eye", title: "No obligation", description: "Prequalifying doesn't obligate you to accept any offer." },
];

/** Funding-estimate calculator defaults (estimate range, never an offer). */
export const DEFAULT_CALCULATOR: CalculatorConfig = {
  lowFactor: 0.5,
  highFactor: 1.0,
  minMonthly: 5000,
  maxMonthly: 500000,
  advanceMultipleLow: 0.5,
  advanceMultipleHigh: 1.2,
  factorRateLow: 1.2,
  factorRateHigh: 1.45,
  holdbackLow: 0.08,
  holdbackHigh: 0.18,
  termMonthsLow: 4,
  termMonthsHigh: 12,
};

/** Single source for the 3-step process (used by Timeline + any card view). */
export const HOW_IT_WORKS_STEPS = [
  {
    title: "Complete a quick prequalification",
    description: "Answer a few questions about your business. About two minutes, no obligation.",
  },
  {
    title: "Share recent bank statements if the file looks viable",
    description: "If the basics line up, share 3–4 months of business bank statements for a proper review.",
  },
  {
    title: "Review available options if underwriting supports the file",
    description: "A funding specialist may contact you to review options. Approval depends on underwriting.",
  },
];

/**
 * Funding options a specialist can match a merchant to (MCA-led). Shared across
 * the site. FundVella connects merchants with specialists — it does not lend.
 */
export const OFFERINGS = {
  eyebrow: "Funding options",
  headline: "One conversation. The funding option that actually fits.",
  intro:
    "There's no single right way to fund a business — it depends on what the money is for and how you get paid. A funding specialist reviews your file and matches you to the option that fits your cash flow, starting with the one most small businesses reach for first.",
  products: [
    {
      name: "Working Capital Advance",
      icon: "spark",
      hero: true,
      bestWhen: "Best when you need to cover a gap or move on an opportunity fast.",
      body: "Funding based on your revenue and bank activity rather than credit alone, repaid as a small, automatic share of your deposits — so it flexes with a slow week instead of fighting it. A factor rate (not an APR) sets the cost up front; you may qualify, and approval depends on underwriting.",
    },
    {
      name: "Business Line of Credit",
      icon: "scale",
      bestWhen: "Best when the need is recurring and you want to draw and repay as cash flow moves.",
      body: "A revolving limit you draw from when you need it and pay down when you don't, so capital is there for the next gap without reapplying. You only carry what you actually use; access and terms depend on underwriting.",
    },
    {
      name: "Term Loan",
      icon: "clock",
      bestWhen: "Best when you have a defined, one-time use and want a predictable monthly payment.",
      body: "A fixed amount repaid over a set term in predictable payments — straightforward to plan around for a specific project or purchase. Amount and term depend on underwriting and the strength of the file.",
    },
    {
      name: "Equipment Financing",
      icon: "tools",
      bestWhen: "Best when you're buying equipment — new or used — and want to preserve cash.",
      body: "Finance the truck, oven, chair, or machine so you can put it to work now while keeping cash free for payroll and the day-to-day. The equipment itself typically anchors the deal; new and used both qualify, subject to underwriting.",
    },
    {
      name: "Invoice Factoring",
      icon: "inventory",
      bestWhen: "Best when capital is tied up in unpaid invoices and you can't wait on net-30/60.",
      body: "Turn outstanding invoices into cash now instead of waiting weeks for customers to pay, so a slow-paying client doesn't stall payroll or your next job. Availability is based on your receivables and your customers' credit, subject to review.",
    },
  ],
  footnote:
    "FundVella is not a lender. We connect business owners with funding specialists who review your file and match you to available options. A factor rate is not an APR. You may qualify; approval depends on underwriting, payments must fit your cash flow, and there's no obligation to accept an offer.",
} satisfies import("@/lib/types").OfferingsSection;

/** Shared, compliance-safe FAQs. Verticals prepend 2+ vertical-specific ones. */
const baseFaqs = (): FAQItem[] => [
  {
    question: "How much funding could my business qualify for?",
    answer:
      "It depends on underwriting — amounts are based on your revenue, bank activity, time in business, and existing obligations. A specialist reviews your file to find a range.",
    bullets: ["Business revenue & deposits", "Time in business", "Bank activity & existing obligations"],
  },
  {
    question: "What do I need to get started?",
    answer:
      "Just a quick prequalification. If the file looks viable, recent business bank statements (usually 3–4 months) help move it forward.",
  },
  {
    question: "Will checking my readiness affect my credit?",
    answer:
      "Starting a prequalification doesn't trigger a hard credit check. Options are reviewed mainly on business revenue and bank activity; credit is considered, but it isn't the only factor.",
  },
  {
    question: "Is there any obligation?",
    answer:
      "None. Submitting your information doesn't obligate you to accept an offer, and any payments must fit your cash flow. A specialist may contact you to review your inquiry.",
  },
];

/** Generic fit-table fallback (used by the catch-all / general page). */
const baseFitTable = (): FitRow[] => [
  { label: "Time in business", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
  { label: "Monthly revenue", goodFit: "Around $10k+ in monthly deposits", mayNeedReview: "Low or inconsistent deposits" },
  { label: "Bank activity", goodFit: "Regular deposits, few negative days", mayNeedReview: "Frequent NSFs or negative days" },
  { label: "Existing financing", goodFit: "No or manageable current advances", mayNeedReview: "Multiple stacked advances" },
  { label: "Documents", goodFit: "Can share 3–4 months of bank statements", mayNeedReview: "Unable to provide statements" },
];

const baseGoodFit = (): string[] => [
  "Operating 6+ months with steady deposits",
  "Around $10k+ in monthly revenue",
  "Mostly positive bank balances",
  "Able to share recent bank statements",
];

const baseReview = (): string[] => [
  "Under 3 months in business",
  "Frequent NSFs or negative balance days",
  "Multiple existing advances stacked together",
  "Unable to provide bank statements right now",
];

const defaultCta = { primary: "Check Your Funding Readiness" };

export const landingPages: VerticalConfig[] = [
  {
    slug: "restaurant-business-funding",
    title: "Restaurant Business Funding",
    seoTitle: "Restaurant Business Funding — Working Capital on Your Deposits",
    seoDescription:
      "Working capital for restaurants, reviewed on card-batch deposits and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "amber" },
    heroHeadline: "Working capital that keeps the kitchen open",
    heroSubheadline:
      "We read your daily card-batch deposits and bank activity — not just your credit — so a slow week doesn't define your file.",
    cashFlowSignature:
      "The walk-in compressor dies on a Friday, the produce vendor wants COD, and rent clears Monday — all before the weekend's batches settle.",
    heroHighlights: ["We read daily card batches", "Seasonality expected, not penalized", "Tips & vendor COD are normal here"],
    heroImage: { src: "/media/restaurant.jpg", alt: "A busy restaurant kitchen during service" },
    useCaseIcons: ["tools", "inventory", "payroll", "expand", "marketing"],
    useCases: [
      { title: "Kitchen equipment", description: "Repair or replace ovens, refrigeration, and line equipment when capital is in place." },
      { title: "Inventory & vendor COD", description: "Cover food and supplier orders ahead of busy weekends and events." },
      { title: "Payroll through slow weeks", description: "Keep your team paid during predictable seasonal dips." },
      { title: "New location or patio", description: "Fund a build-out, patio, or second location when the timing is right." },
      { title: "Covers & delivery apps", description: "Drive traffic with promotions, delivery platforms, and local campaigns." },
    ],
    calcContext: "Use your average monthly deposits (card batches + cash). Four questions for a live range and a readiness check.",
    qualificationFocus: [
      { title: "Daily card batches", description: "Steady card-batch and cash deposits matter more than one slow week." },
      { title: "Seasonality", description: "Expected swings — holidays, slow months — are read in context, not penalized." },
      { title: "Vendor & rent timing", description: "How deposits line up against food cost, payroll, and rent." },
    ],
    qualificationNotes: ["We factor seasonality and the daily card-batch deposits common to food service."],
    goodFitCriteria: [
      "Open 6+ months with steady card-batch deposits",
      "Roughly $15k+ a month across card and cash",
      "Mostly positive balances between batches",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Open under 3 months",
      "Frequent NSFs or negative days mid-week",
      "Several advances already running together",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time open", goodFit: "6+ months serving", mayNeedReview: "Pre-opening or under 3 months" },
      { label: "Monthly deposits", goodFit: "~$15k+ in card + cash", mayNeedReview: "Thin or erratic batches" },
      { label: "Bank activity", goodFit: "Recovers between slow weeks", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Does a slow season hurt my chances?",
        answer:
          "Not on its own. Underwriting expects seasonal swings in food service and looks at your overall deposit pattern across months, not a single slow week.",
      },
      {
        question: "I run mostly on card sales — does that count?",
        answer:
          "Yes. Daily card-batch settlements are exactly what a revenue-based review looks at, alongside your business bank activity.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.3, holdbackLow: 0.08, holdbackHigh: 0.15 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The kitchen doesn't wait for the weekend to settle",
      intro: "Most owners don't go looking for capital. They just keep absorbing these — out of the register, out of their own pocket, out of next week.",
      items: [
        { icon: "tools", pain: "The walk-in dies mid-prep on a Friday, and the repair tech wants payment before the weekend rush you can't run without it.", relief: "With capital already in place, the unit gets fixed the same day and the weekend's covers still happen — instead of comping tables or closing a section." },
        { icon: "inventory", pain: "Your best produce and protein vendors moved you to COD, so the busier you get, the more cash you front before a single check lands.", relief: "With working capital on hand, you order ahead of a big weekend without draining the account — and stop letting a vendor's terms cap how much you can sell." },
        { icon: "payroll", pain: "January and the slow weeks still cost a full payroll, and you're the one who eats the gap so the line stays staffed for the rebound.", relief: "With a cushion in place, you keep your trained crew through the dip instead of losing cooks you'll have to rehire and retrain in spring." },
      ],
      closer: "You may qualify based on your card-batch deposits and bank activity — no obligation, and any payments are structured to fit your cash flow.",
    },
    campaignTag: "restaurant",
  },
  {
    slug: "trucking-business-funding",
    title: "Trucking Business Funding",
    seoTitle: "Trucking Business Funding — Working Capital for Carriers",
    seoDescription:
      "Working capital for owner-operators and fleets, reviewed on settlements and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "orange" },
    heroHeadline: "Keep the wheels turning between settlements",
    heroSubheadline:
      "Owner-operator or a growing fleet, we review on settlements and deposits — lumpy weeks and factoring included.",
    cashFlowSignature:
      "Factoring's taken its cut, the broker pays in 45, and the truck's down for a turbo — but the next load is already booked.",
    heroHighlights: ["Owner-operators & fleets alike", "Lumpy settlements understood", "A down truck won't sink your file"],
    heroImage: { src: "/media/trucking.jpg", alt: "A semi truck driver beside their rig" },
    useCaseIcons: ["vehicle", "tools", "expand", "scale", "payroll"],
    useCases: [
      { title: "Fuel & maintenance", description: "Smooth out fuel costs and routine maintenance between settlements." },
      { title: "Truck & trailer repairs", description: "Cover unexpected repairs when capital is in place so a down truck gets rolling." },
      { title: "Equipment down payment", description: "Put money down on another truck or trailer to grow capacity." },
      { title: "Bridge slow-paying freight", description: "Cover the gap while brokers and shippers pay invoices." },
      { title: "Driver payroll", description: "Keep drivers paid on time during slower freight weeks." },
    ],
    calcContext: "Use your average monthly settlements/deposits. Four questions for a live range and readiness score.",
    qualificationFocus: [
      { title: "Settlement pattern", description: "Broker and factoring settlements and how consistent deposits are across weeks." },
      { title: "Time & authority", description: "Operating history and time running under your own authority." },
      { title: "Repairs & fuel swings", description: "Big one-off repair or fuel weeks are read in context, not as a red flag." },
    ],
    qualificationNotes: ["We understand fluctuating fuel costs and factor settlement and deposit patterns."],
    goodFitCriteria: [
      "Hauling 6+ months with regular settlements",
      "Steady broker/factoring deposits",
      "Balances recover between checks",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Under 3 months under authority",
      "Frequent NSFs between settlements",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time under authority", goodFit: "6+ months operating", mayNeedReview: "Just got authority / under 3 months" },
      { label: "Monthly settlements", goodFit: "Regular broker/factoring deposits", mayNeedReview: "Sparse or one-off loads" },
      { label: "Bank activity", goodFit: "Recovers between settlements", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "I'm a single owner-operator — can I still apply?",
        answer:
          "Yes. Owner-operators are reviewed on the same basis: business revenue, bank activity, and time in business. You may qualify; approval depends on underwriting.",
      },
      {
        question: "I use a factoring company — does that affect the review?",
        answer:
          "No. Factoring deposits are read as normal carrier revenue. Underwriting looks at the overall deposit pattern, factoring included.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.4, advanceMultipleHigh: 1.0, factorRateLow: 1.25, factorRateHigh: 1.49, holdbackLow: 0.06, holdbackHigh: 0.12, termMonthsHigh: 10 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The load's booked. The money just isn't here yet.",
      intro: "You're not short on work — you're short on the gap between doing the work and getting paid for it. Here's where that gap usually bites.",
      items: [
        { icon: "clock", pain: "Factoring already took its cut, the broker still pays net-45, and fuel and the truck payment don't care that the money's on the way.", relief: "With capital in place, you cover fuel and fixed costs now and let the slow-paying invoices catch up on their timeline instead of yours." },
        { icon: "tools", pain: "A blown turbo or a DOT repair grounds the truck, and every day it sits is a day the only thing that earns is parked in a shop bay.", relief: "With working capital ready, the truck gets back on the road for the load that's already booked — instead of waiting until the cash clears to authorize the fix." },
        { icon: "vehicle", pain: "There's freight you could take with a second truck or a down payment, but committing the cash means you can't cover the lane you're already running.", relief: "With funding behind you, you put money down to add capacity without starving the routes paying the bills today." },
      ],
      closer: "Owner-operator or fleet, you may qualify on your settlements and deposits — factoring included. No obligation, and payments are built to fit how you actually get paid.",
    },
    campaignTag: "trucking",
  },
  {
    slug: "construction-business-funding",
    title: "Construction Contractor Funding",
    seoTitle: "Construction Contractor Funding — Bridge Jobs & Payroll",
    seoDescription:
      "Working capital for contractors and subs, reviewed on deposits across jobs. You may qualify. Approval depends on underwriting.",
    theme: { accent: "yellow" },
    heroHeadline: "Cover materials and payroll before the draw lands",
    heroSubheadline:
      "We expect draw-based, lumpy cash flow and review on your deposit history across months, not a single billing cycle.",
    cashFlowSignature:
      "Materials and payroll are due now; the progress draw lands in three weeks, and the GC still has to sign off.",
    heroHighlights: ["Draw schedules understood", "GCs and subs welcome", "Materials-before-payment is the norm"],
    heroImage: { src: "/media/construction.jpg", alt: "A contractor reviewing plans on a job site" },
    useCaseIcons: ["inventory", "payroll", "tools", "expand", "spark"],
    useCases: [
      { title: "Materials upfront", description: "Buy materials before a draw or final payment comes in." },
      { title: "Payroll between draws", description: "Keep crews working while you wait on progress billing." },
      { title: "Equipment", description: "Purchase or repair equipment to keep projects on schedule." },
      { title: "Mobilization costs", description: "Cover mobilization and upfront costs to start a new job." },
      { title: "Take a larger project", description: "Say yes to a bigger contract with capital ready to go." },
    ],
    calcContext: "Use your average monthly deposits across recent jobs. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Draw-based deposits", description: "Deposit history across draws and jobs, not a single billing cycle." },
      { title: "Work mix", description: "The balance of GC versus subcontractor revenue and signed backlog." },
      { title: "Gaps vs NSFs", description: "Gaps between draws are expected; frequent NSFs get a closer look." },
    ],
    qualificationNotes: ["We account for progress billing and draw schedules common in construction."],
    goodFitCriteria: [
      "Operating 6+ months across jobs",
      "Deposits land with each draw / completion",
      "Balances recover between draws",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Under 3 months in business",
      "Frequent NSFs, not just draw gaps",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time in business", goodFit: "6+ months of jobs", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly deposits", goodFit: "Draws/completions landing steadily", mayNeedReview: "One job, no history" },
      { label: "Bank activity", goodFit: "Recovers between draws", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "My income is lumpy between draws — does that matter?",
        answer:
          "Lumpy cash flow is normal in construction. Underwriting looks at your deposit history over several months, so a gap between draws doesn't automatically work against you.",
      },
      {
        question: "Can I use funds to take on a bigger contract?",
        answer:
          "Yes — mobilization, materials, and payroll for a larger job are common uses. Amounts depend on underwriting and your deposit history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.4, advanceMultipleHigh: 1.0 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The work's done. The draw's still three weeks out.",
      intro: "Most contractors don't go looking for capital — they just float it: out of pocket, out of the next draw, out of the supply house's patience.",
      items: [
        { icon: "clock", pain: "Materials and payroll are due now, but the progress draw is three weeks out and the GC still has to sign off.", relief: "With capital in place, you cover materials and crews now and let the draw catch up on its own schedule instead of yours." },
        { icon: "tools", pain: "A machine goes down mid-job, and renting a replacement eats the margin you bid the work on.", relief: "With working capital ready, you repair or rent immediately and keep the job on schedule instead of watching the timeline slip." },
        { icon: "expand", pain: "A bigger contract is yours if you want it, but mobilization and upfront materials would drain the jobs you're already running.", relief: "With funding behind you, you take the larger job without starving the work already paying the bills." },
      ],
      closer: "You may qualify on your deposit history across jobs, draw gaps included. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "construction",
  },
  {
    slug: "ecommerce-inventory-funding",
    title: "E-commerce Inventory Funding",
    seoTitle: "E-commerce Inventory Funding — Fund Stock & Growth",
    seoDescription:
      "Inventory and growth capital for online sellers, reviewed on processor volume and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "violet" },
    heroHeadline: "Stock up before demand spikes",
    heroSubheadline:
      "We weigh processor and marketplace volume alongside bank activity, so peak-season buys don't stall on cash.",
    cashFlowSignature:
      "Q4 is coming, your supplier wants 50% down with an 8-week lead time, and your cash is tied up in last month's ad spend.",
    heroHighlights: ["Processor & marketplace volume count", "Sized for peak-season buys", "Shopify, Amazon & DTC sellers"],
    heroImage: { src: "/media/ecommerce.jpg", alt: "An e-commerce owner packing orders in a warehouse" },
    useCaseIcons: ["cart", "inventory", "marketing", "scale", "expand"],
    useCases: [
      { title: "Bulk inventory", description: "Buy inventory ahead of peak season at better unit costs." },
      { title: "Restock best-sellers", description: "Keep top SKUs in stock so you never miss a sale." },
      { title: "Scale ad spend", description: "Fund proven campaigns to grow while ROAS is strong." },
      { title: "Supplier deposits", description: "Cover supplier deposits and longer production lead times." },
      { title: "Warehousing & 3PL", description: "Fund fulfillment, storage, and 3PL as order volume grows." },
    ],
    calcContext: "Use your average monthly deposits (processor + bank). Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Processor volume", description: "Card-processor and marketplace settlement volume alongside bank deposits." },
      { title: "Refund & chargeback rate", description: "Healthy refund and chargeback levels for your category." },
      { title: "Seasonality", description: "Peak-season ramps are expected and read in context." },
    ],
    qualificationNotes: ["We factor card-processor and marketplace deposit volume alongside bank activity."],
    goodFitCriteria: [
      "Selling 6+ months with steady settlements",
      "Consistent processor + marketplace volume",
      "Refunds/chargebacks in normal range",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Under 3 months selling",
      "Spiky volume with long gaps",
      "Elevated chargeback rate",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time selling", goodFit: "6+ months live", mayNeedReview: "Just launched / under 3 months" },
      { label: "Monthly volume", goodFit: "Steady processor + bank deposits", mayNeedReview: "Thin or one-off spikes" },
      { label: "Chargebacks", goodFit: "Within normal range", mayNeedReview: "Elevated dispute rate" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Do you look at my Shopify / Amazon / processor volume?",
        answer:
          "Yes. For online sellers, card-processor and marketplace deposit volume are part of the review, along with your business bank activity.",
      },
      {
        question: "Can I fund inventory ahead of a launch or peak season?",
        answer:
          "That's one of the most common uses. Underwriting sizes options on your volume and bank activity; pre-buying for a launch is normal in e-commerce.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.6, advanceMultipleHigh: 1.4, factorRateLow: 1.15, factorRateHigh: 1.4, termMonthsHigh: 9 },
    cta: defaultCta,
    industryFocus: "retail",
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The buy is due now. The sell-through that pays for it isn't.",
      intro: "Online, the cash is always one step behind the growth — tied up in stock, ad spend, and supplier deposits before a single order ships.",
      items: [
        { icon: "inventory", pain: "Your supplier wants 50% down with an eight-week lead time, and last month's ad spend already has your cash committed.", relief: "With capital in place, you place the pre-season buy without starving the campaigns that are still bringing in orders." },
        { icon: "cart", pain: "Your best SKU sells out right as demand peaks, and the reorder won't land until the moment has passed.", relief: "With working capital ready, you restock the winners before the peak instead of handing sold-out sales to a competitor." },
        { icon: "marketing", pain: "ROAS is strong and you could scale tomorrow, but every extra ad dollar is cash you won't see back until the orders clear.", relief: "With funding behind you, you pour fuel on what's already working instead of throttling growth to protect cash flow." },
      ],
      closer: "You may qualify on processor and marketplace volume alongside bank activity. No obligation, and payments are structured to fit your cash flow.",
    },
    campaignTag: "ecommerce",
  },
  {
    slug: "auto-repair-shop-funding",
    title: "Auto Repair Shop Funding",
    seoTitle: "Auto Repair Shop Funding — Working Capital for Shops",
    seoDescription:
      "Working capital for auto repair shops, reviewed on ticket deposits and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "red" },
    heroHeadline: "Keep the bays full and the parts moving",
    heroSubheadline:
      "We review on ticket-based shop deposits and bank activity, with the parts cash-flow cycle in mind.",
    cashFlowSignature:
      "Three cars are on the lifts waiting on parts, the distributor is COD, and techs get paid Friday no matter what.",
    heroHighlights: ["Ticket-based deposits count", "Independents & multi-bay shops", "Parts cash-flow cycle in mind"],
    heroImage: { src: "/media/auto-repair.jpg", alt: "A technician working in an auto repair bay" },
    useCaseIcons: ["tools", "inventory", "payroll", "expand", "marketing"],
    useCases: [
      { title: "Diagnostic & lift equipment", description: "Add or repair lifts, scanners, and diagnostic tools." },
      { title: "Parts inventory", description: "Stock common parts to cut turnaround and win more tickets." },
      { title: "Technician payroll", description: "Keep skilled techs paid through slower weeks." },
      { title: "Add a bay", description: "Expand capacity with another bay or location." },
      { title: "Local marketing", description: "Bring in cars with local and digital campaigns." },
    ],
    calcContext: "Use your average monthly shop deposits. Four questions for a live range and a readiness check.",
    qualificationFocus: [
      { title: "Ticket deposits", description: "Consistency of ticket-based shop deposits week to week." },
      { title: "Parts cycle", description: "How parts spend (often COD) lines up against collections." },
      { title: "Throughput & time", description: "Operating history and steady car count through the bays." },
    ],
    qualificationNotes: ["We factor ticket-based revenue and the parts cash-flow cycle."],
    goodFitCriteria: [
      "Open 6+ months with steady tickets",
      "Consistent shop deposits week to week",
      "Balances hold through parts COD",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Open under 3 months",
      "Frequent NSFs or negative days",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time open", goodFit: "6+ months of tickets", mayNeedReview: "Just opened / under 3 months" },
      { label: "Monthly deposits", goodFit: "Steady ticket revenue", mayNeedReview: "Sparse or erratic tickets" },
      { label: "Bank activity", goodFit: "Holds through parts COD", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Parts are often COD — can funding help with that?",
        answer:
          "Yes. Covering parts inventory and COD distributor orders is a common use. Underwriting sizes options on your ticket deposits and bank activity.",
      },
      {
        question: "Does it matter if I'm a single-bay independent?",
        answer:
          "No. Independents and multi-bay shops are reviewed the same way — on shop deposits, bank activity, and time in business.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.1 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The cars are on the lifts. The parts are COD.",
      intro: "A full shop should mean a full account — but the parts cycle and Friday payroll have a way of getting there first.",
      items: [
        { icon: "inventory", pain: "Three cars are waiting on parts, the distributor is COD, and you're fronting every dollar before a single ticket closes.", relief: "With capital on hand, you order parts the moment a job lands and turn cars faster instead of pacing the account." },
        { icon: "tools", pain: "A lift or a scanner finally gives out, and the fix costs less than the tickets you'll lose while it's down.", relief: "With working capital ready, you repair or replace it now and keep every bay earning." },
        { icon: "payroll", pain: "A slow week still owes your techs a full check, and good techs don't wait around for cash flow to recover.", relief: "With a cushion in place, you keep your crew paid and intact through the dip instead of losing the people who run your shop." },
      ],
      closer: "You may qualify on your ticket-based shop deposits and bank activity. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "auto-repair",
  },
  {
    slug: "medical-practice-funding",
    title: "Medical Practice Funding",
    seoTitle: "Medical Practice Funding — Working Capital With Lag Built In",
    seoDescription:
      "Working capital for medical practices, reviewed on collections with reimbursement lag in mind. You may qualify. Approval depends on underwriting.",
    theme: { accent: "teal" },
    heroHeadline: "Don't let reimbursement lag stall the practice",
    heroSubheadline:
      "We review on collections and bank activity with reimbursement lag built in — solo practice or group.",
    cashFlowSignature:
      "Payroll runs every two weeks; the insurer reimburses in 60. The new chairside unit can't wait for the AR to clear.",
    heroHighlights: ["Reimbursement lag is normal", "Solo & group practices", "Collections, not just credit"],
    heroImage: { src: "/media/medical.jpg", alt: "A physician in a modern medical practice" },
    useCaseIcons: ["tools", "payroll", "expand", "scale", "spark"],
    useCases: [
      { title: "Equipment", description: "Add or upgrade diagnostic and treatment equipment." },
      { title: "Hire staff", description: "Bring on clinical or front-office staff to grow capacity." },
      { title: "Expand or relocate", description: "Fund a build-out, new suite, or additional location." },
      { title: "Bridge reimbursements", description: "Smooth cash flow while insurance reimbursements process." },
      { title: "New service lines", description: "Launch a new service line or procedure offering." },
    ],
    calcContext: "Use your average monthly collections/deposits. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Collections pattern", description: "Deposit and collection history with insurance reimbursement lag built in." },
      { title: "Payer stability", description: "How steady revenue is across payers over time." },
      { title: "Time in practice", description: "Operating history of the practice strengthens the file." },
    ],
    qualificationNotes: ["We account for insurance reimbursement cycles when reviewing deposits."],
    goodFitCriteria: [
      "Practice operating 6+ months",
      "Steady monthly collections over time",
      "Balances hold through reimbursement lag",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Practice under 3 months old",
      "Frequent NSFs beyond normal lag",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time in practice", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly collections", goodFit: "Steady across payers", mayNeedReview: "Thin or highly variable" },
      { label: "Bank activity", goodFit: "Holds through 60-day lag", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "My deposits lag because of insurance — is that a problem?",
        answer:
          "Reimbursement lag is expected for practices. Underwriting reviews your deposit pattern over time, so timing gaps don't automatically count against the file.",
      },
      {
        question: "Can funds bridge the gap while AR clears?",
        answer:
          "Yes — bridging payroll and equipment while reimbursements process is a common use. Amounts depend on underwriting and your collections history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.6, advanceMultipleHigh: 1.3, factorRateLow: 1.15, factorRateHigh: 1.35, termMonthsLow: 6, termMonthsHigh: 15 },
    cta: defaultCta,
    industryFocus: "healthcare",
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "You did the work in March. The payer pays in May.",
      intro: "A profitable practice can still run tight, because production and reimbursement live on two different calendars. This is where that shows up.",
      items: [
        { icon: "clock", pain: "Payroll runs every two weeks like clockwork, but the insurer reimburses in 60 — so the work is done, the AR is real, and the cash still isn't in the account.", relief: "With capital in place, you meet payroll and fixed costs on schedule and let receivables clear on the payer's timeline instead of carrying the gap yourself." },
        { icon: "tools", pain: "The chairside unit or imaging system you need to see more patients can't wait the two or three cycles it takes for the AR to free up the cash.", relief: "With funding behind you, you add the equipment now — and start earning on it months before that capital would have surfaced from collections." },
        { icon: "spark", pain: "You want to add a provider or open a new service line, but every growth move means fronting salary and setup long before the first claim on it gets paid.", relief: "With working capital available, you hire and launch on your timeline rather than waiting for collections to slowly underwrite the expansion." },
      ],
      closer: "You may qualify on your collections and bank activity, with reimbursement lag taken into account. No obligation, and any payments are structured to fit the practice's cash flow.",
    },
    campaignTag: "medical",
  },
  {
    slug: "dental-practice-funding",
    title: "Dental Practice Funding",
    seoTitle: "Dental Practice Funding — Working Capital for Dentists",
    seoDescription:
      "Working capital for dental practices, reviewed on collections and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "cyan" },
    heroHeadline: "Grow the practice before collections catch up",
    heroSubheadline:
      "We review on production and collections, not credit alone, with the gap between chair time and payment in mind.",
    cashFlowSignature:
      "You added an operatory and a hygienist, but production shows up in the chair months before collections catch up.",
    heroHighlights: ["Production cycles understood", "Solo & group practices", "Reviewed on collections"],
    heroImage: { src: "/media/dental.jpg", alt: "A dentist in a modern dental operatory" },
    useCaseIcons: ["tools", "payroll", "expand", "spark", "marketing"],
    useCases: [
      { title: "Chairs & imaging", description: "Add operatories, chairs, or imaging technology." },
      { title: "Hire hygienists", description: "Expand your team to see more patients." },
      { title: "Office build-out", description: "Renovate or expand your office footprint." },
      { title: "Practice software & tech", description: "Upgrade practice management and patient tools." },
      { title: "New-patient marketing", description: "Grow new-patient flow with local campaigns." },
    ],
    calcContext: "Use your average monthly collections. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Production vs collections", description: "The gap between chair time and collections is expected." },
      { title: "Deposit consistency", description: "Steady monthly collections across recent months." },
      { title: "Time in practice", description: "Operating history of the practice strengthens the file." },
    ],
    qualificationNotes: ["We factor production and collection patterns common to dental offices."],
    goodFitCriteria: [
      "Practice operating 6+ months",
      "Steady monthly collections",
      "Balances hold between production and pay",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Practice under 3 months old",
      "Frequent NSFs or negative days",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time in practice", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly collections", goodFit: "Steady month to month", mayNeedReview: "Thin or highly variable" },
      { label: "Bank activity", goodFit: "Holds through the lag", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Production is up but collections lag — does that hurt?",
        answer:
          "No. The gap between production and collections is normal in dental. Underwriting reviews your collection deposits over time, not a single month.",
      },
      {
        question: "Can I fund a new operatory or hygienist?",
        answer:
          "Yes — equipment, build-outs, and hiring are common uses. Amounts depend on underwriting and your collections history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.6, advanceMultipleHigh: 1.3, factorRateLow: 1.15, factorRateHigh: 1.35, termMonthsLow: 6, termMonthsHigh: 15 },
    cta: defaultCta,
    industryFocus: "healthcare",
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "You did the production. Collections are months behind it.",
      intro: "A busy schedule doesn't always mean a full account — production shows up in the chair long before the money shows up in the bank.",
      items: [
        { icon: "clock", pain: "You added a hygienist and an operatory, but the production runs months ahead of the collections that pay for them.", relief: "With capital in place, you staff and equip on your timeline and let collections catch up instead of carrying the gap yourself." },
        { icon: "tools", pain: "The imaging or chairside tech that would grow the practice can't wait the cycles it takes for AR to free up cash.", relief: "With working capital ready, you add the technology now and start earning on it before collections would have surfaced the cash." },
        { icon: "spark", pain: "A new service line could lift revenue, but the setup and training come due long before the first case pays.", relief: "With funding behind you, you launch on your schedule rather than waiting for collections to slowly fund the move." },
      ],
      closer: "You may qualify on your collections and bank activity, with production timing in mind. No obligation, and any payments are structured to fit your cash flow.",
    },
    campaignTag: "dental",
  },
  {
    slug: "beauty-salon-med-spa-funding",
    title: "Beauty Salon / Med Spa Funding",
    seoTitle: "Beauty Salon & Med Spa Funding — Working Capital",
    seoDescription:
      "Working capital for salons and med spas, reviewed on appointment deposits and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "rose" },
    heroHeadline: "Fund the chair before the calendar fills",
    heroSubheadline:
      "We review on appointment-driven deposits and bank activity, with seasonal swings expected.",
    cashFlowSignature:
      "New chairs, fresh inventory, and a stylist to hire — all before the calendar fills back up after a slow stretch.",
    heroHighlights: ["Appointment revenue counts", "Salons & med spas", "Seasonal swings expected"],
    heroImage: { src: "/media/beauty.jpg", alt: "A stylist in a modern salon" },
    useCaseIcons: ["tools", "inventory", "expand", "payroll", "marketing"],
    useCases: [
      { title: "Equipment", description: "Add chairs, lasers, or treatment devices." },
      { title: "Retail inventory", description: "Stock retail products and treatment supplies." },
      { title: "Renovation", description: "Refresh or expand your space to grow bookings." },
      { title: "Hire & train", description: "Bring on stylists or technicians and train your team." },
      { title: "Fill the calendar", description: "Drive bookings with promotions and local ads." },
    ],
    calcContext: "Use your average monthly deposits. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Appointment revenue", description: "Consistency of appointment-driven deposits across the month." },
      { title: "Seasonality", description: "Slow stretches and busy seasons are read in context." },
      { title: "Service + retail mix", description: "Service and product retail deposits reviewed together." },
    ],
    qualificationNotes: ["We factor appointment-driven and seasonal revenue patterns."],
    goodFitCriteria: [
      "Open 6+ months with steady bookings",
      "Consistent appointment deposits",
      "Balances recover after slow weeks",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Open under 3 months",
      "Frequent NSFs or negative days",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time open", goodFit: "6+ months of bookings", mayNeedReview: "Just opened / under 3 months" },
      { label: "Monthly deposits", goodFit: "Steady appointment revenue", mayNeedReview: "Thin or erratic bookings" },
      { label: "Bank activity", goodFit: "Recovers after slow weeks", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Bookings dip in slow seasons — does that hurt?",
        answer:
          "No. Seasonal swings are expected for salons and med spas. Underwriting looks at deposits across months, not one slow stretch.",
      },
      {
        question: "Can I fund new equipment like lasers or chairs?",
        answer:
          "Yes — equipment, inventory, and renovations are common uses. Amounts depend on underwriting and your deposit history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.1 },
    cta: defaultCta,
    industryFocus: "healthcare",
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The chairs are ready. The calendar's still filling back up.",
      intro: "After a slow stretch, the costs to grow show up before the bookings do — and that gap is where owners quietly carry the load.",
      items: [
        { icon: "tools", pain: "New chairs, a laser, or a fresh build-out would lift bookings, but the cash for them is due before the calendar refills.", relief: "With capital in place, you upgrade now and grow into the bookings instead of waiting for a busy season to fund the move." },
        { icon: "inventory", pain: "Retail and treatment supplies have to be stocked ahead of demand, tying up cash right when a slow stretch already has it tight.", relief: "With working capital ready, you keep the shelves and treatment rooms stocked without draining the account." },
        { icon: "payroll", pain: "You want to hire and train a stylist before the rush, but their first months cost you before they're fully booked.", relief: "With a cushion in place, you bring on talent ahead of demand instead of scrambling once you're already slammed." },
      ],
      closer: "You may qualify on your appointment-driven deposits and bank activity, seasonal swings included. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "beauty-medspa",
  },
  {
    slug: "retail-store-funding",
    title: "Retail Store Funding",
    seoTitle: "Retail Store Funding — Inventory & Working Capital",
    seoDescription:
      "Working capital for retail stores, reviewed on sales, processor volume and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "blue" },
    heroHeadline: "Buy the season before it sells",
    heroSubheadline:
      "We review on sales, card-processor volume, and bank activity, with seasonal inventory cycles in mind.",
    cashFlowSignature:
      "The holiday buy is due to the vendor now; the sell-through that pays for it doesn't start until November.",
    heroHighlights: ["Sales & processor volume count", "Single or multi-location", "Seasonal inventory in mind"],
    heroImage: { src: "/media/retail.jpg", alt: "A shop owner at the counter of their retail store" },
    useCaseIcons: ["inventory", "expand", "tools", "payroll", "marketing"],
    useCases: [
      { title: "Seasonal inventory", description: "Stock up ahead of your busiest selling season." },
      { title: "Store expansion", description: "Fund a build-out, remodel, or new location." },
      { title: "POS & equipment", description: "Upgrade point-of-sale and store equipment." },
      { title: "Payroll", description: "Cover staffing through seasonal peaks and dips." },
      { title: "Drive foot traffic", description: "Bring in shoppers with local campaigns." },
    ],
    calcContext: "Use your average monthly sales deposits. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Sales deposits", description: "Card-processor and bank deposit consistency through the month." },
      { title: "Seasonality", description: "Seasonal sell-through cycles are expected, not penalized." },
      { title: "Inventory turn", description: "How inventory spend lines up with sales over time." },
    ],
    qualificationNotes: ["We factor seasonal sales cycles and card-processor volume."],
    goodFitCriteria: [
      "Open 6+ months with steady sales",
      "Consistent processor + bank deposits",
      "Balances recover after restocks",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Open under 3 months",
      "Frequent NSFs or negative days",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time open", goodFit: "6+ months of sales", mayNeedReview: "Just opened / under 3 months" },
      { label: "Monthly deposits", goodFit: "Steady sales + processor volume", mayNeedReview: "Thin or one-season only" },
      { label: "Bank activity", goodFit: "Recovers after restocks", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Most of my sales are in one season — can I still qualify?",
        answer:
          "Possibly. Seasonal concentration is common in retail. Underwriting reviews your deposit history and volume; you may qualify, and approval depends on underwriting.",
      },
      {
        question: "Can I fund inventory ahead of the holidays?",
        answer:
          "Yes — pre-buying seasonal inventory is one of the most common uses. Amounts depend on underwriting and your sales history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.2 },
    cta: defaultCta,
    industryFocus: "retail",
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The holiday buy is due now. The sell-through starts in November.",
      intro: "Retail runs on a calendar that pays in arrears — you buy the season months before the season pays you back.",
      items: [
        { icon: "inventory", pain: "The seasonal buy is due to your vendor now, but the sell-through that pays for it doesn't start for months.", relief: "With capital in place, you stock the season in full and let sell-through pay it back instead of under-buying and selling out early." },
        { icon: "expand", pain: "A second location or a remodel would grow the business, but the build-out drains the cash the current store runs on.", relief: "With working capital ready, you expand without starving the store that's already paying the bills." },
        { icon: "payroll", pain: "The rush needs more staff on the floor, but you're paying them weeks before the holiday receipts land.", relief: "With a cushion in place, you staff up ahead of the rush instead of running short when it matters most." },
      ],
      closer: "You may qualify on your sales, processor volume, and bank activity, seasonal cycles included. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "retail",
  },
  {
    slug: "hvac-plumbing-business-funding",
    title: "HVAC / Plumbing Business Funding",
    seoTitle: "HVAC & Plumbing Business Funding — Working Capital",
    seoDescription:
      "Working capital for HVAC and plumbing businesses, reviewed on deposits and bank activity. You may qualify. Approval depends on underwriting.",
    theme: { accent: "sky" },
    heroHeadline: "Be ready when the first heat wave hits",
    heroSubheadline:
      "We review on service and install deposits with seasonal demand swings expected — no credit-only decisions.",
    cashFlowSignature:
      "The first heat wave hits, calls triple overnight, and you need trucks stocked and crews staffed before you've collected on a single job.",
    heroHighlights: ["Seasonal spikes understood", "Service & install crews", "Deposits over credit score"],
    heroImage: { src: "/media/hvac-plumbing.jpg", alt: "An HVAC technician servicing a unit" },
    useCaseIcons: ["vehicle", "inventory", "payroll", "expand", "marketing"],
    useCases: [
      { title: "Trucks & equipment", description: "Add or repair service trucks and field equipment." },
      { title: "Parts for peak season", description: "Stock parts and units ahead of summer and winter rushes." },
      { title: "Staff up", description: "Add crews for busy season and keep techs paid." },
      { title: "Expand territory", description: "Grow into new territory or add a crew." },
      { title: "Generate service calls", description: "Bring in jobs with local and digital ads." },
    ],
    calcContext: "Use your average monthly deposits. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Seasonal demand", description: "Peak-season spikes are expected, not penalized." },
      { title: "Service vs install", description: "The mix and consistency of service and install deposits." },
      { title: "Time & call volume", description: "Operating history and steady job flow strengthen the file." },
    ],
    qualificationNotes: ["We factor the seasonal demand swings common to HVAC and plumbing."],
    goodFitCriteria: [
      "Operating 6+ months",
      "Steady service + install deposits",
      "Balances hold between peaks",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Under 3 months in business",
      "Frequent NSFs or negative days",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time in business", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly deposits", goodFit: "Service + install revenue", mayNeedReview: "One-season or sparse jobs" },
      { label: "Bank activity", goodFit: "Holds between peaks", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "My revenue spikes seasonally — is that a problem?",
        answer:
          "No. Seasonal demand is expected in HVAC and plumbing. Underwriting reviews your deposits across the year, so peaks and dips are read in context.",
      },
      {
        question: "Can I fund parts and staffing before peak season?",
        answer:
          "Yes — stocking parts and staffing up ahead of a rush are common uses. Amounts depend on underwriting and your deposit history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.2 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The heat wave hits. You collect on the jobs weeks later.",
      intro: "When demand spikes, the costs land first — trucks, parts, and crews all need covering before a single invoice is paid.",
      items: [
        { icon: "inventory", pain: "The first heat wave triples your calls, but you need units and parts stocked before you've collected on a single job.", relief: "With capital in place, you stock for the rush up front and capture the season instead of turning calls away." },
        { icon: "vehicle", pain: "Another truck would let you run a second crew, but the down payment competes with the jobs you're already covering.", relief: "With working capital ready, you add capacity for peak season without starving day-to-day operations." },
        { icon: "payroll", pain: "Busy season means more techs on payroll weeks before the install checks clear.", relief: "With a cushion in place, you staff up for the rush and keep crews paid while the receivables catch up." },
      ],
      closer: "You may qualify on your service and install deposits, seasonal swings included. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "hvac-plumbing",
  },
  {
    slug: "cleaning-business-funding",
    title: "Cleaning Business Funding",
    seoTitle: "Cleaning Business Funding — Working Capital for Crews",
    seoDescription:
      "Working capital for cleaning businesses, reviewed on recurring-contract deposits. You may qualify. Approval depends on underwriting.",
    theme: { accent: "emerald" },
    heroHeadline: "Win the contract, cover the crew",
    heroSubheadline:
      "We review on recurring-contract deposits and bank activity, with net-30/60 receivables in mind.",
    cashFlowSignature:
      "Crews and supplies get paid weekly; the commercial contract pays net-60 — and you just won two more accounts.",
    heroHighlights: ["Recurring contracts count", "Residential & commercial", "Net-30/60 receivables in mind"],
    heroImage: { src: "/media/cleaning.jpg", alt: "A cleaning crew member at work in a commercial space" },
    useCaseIcons: ["tools", "payroll", "vehicle", "scale", "expand"],
    useCases: [
      { title: "Equipment & supplies", description: "Buy equipment and supplies to take on more accounts." },
      { title: "Crew payroll", description: "Keep crews paid while invoices are outstanding." },
      { title: "Vehicles", description: "Add a vehicle to expand your service area." },
      { title: "Bridge net-30/60", description: "Cover the gap on commercial contracts with longer terms." },
      { title: "Onboard new accounts", description: "Win and onboard larger recurring contracts." },
    ],
    calcContext: "Use your average monthly deposits. Four questions for a live range and readiness.",
    qualificationFocus: [
      { title: "Recurring contracts", description: "Consistency of recurring-contract deposits month to month." },
      { title: "Receivable terms", description: "Net-30/60 timing on commercial accounts is expected." },
      { title: "Crew & supply costs", description: "How weekly payroll and supply costs line up against deposits." },
    ],
    qualificationNotes: ["We factor recurring-contract revenue and net-term receivables."],
    goodFitCriteria: [
      "Operating 6+ months",
      "Steady recurring-contract deposits",
      "Balances hold through net-term gaps",
      "Can share 3–4 months of statements",
    ],
    reviewCriteria: [
      "Under 3 months in business",
      "Frequent NSFs beyond net-term gaps",
      "Several advances stacked already",
      "Statements not available yet",
    ],
    fitTable: [
      { label: "Time in business", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly deposits", goodFit: "Recurring-contract revenue", mayNeedReview: "One-off jobs only" },
      { label: "Bank activity", goodFit: "Holds through net-30/60", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "My commercial accounts pay net-30/60 — does that matter?",
        answer:
          "It's expected. Underwriting understands net-term receivables in commercial cleaning and reviews your deposit pattern over time, so the gap doesn't automatically hurt the file.",
      },
      {
        question: "Can I fund payroll while waiting on invoices?",
        answer:
          "Yes — bridging crew payroll and supplies while receivables clear is a common use. Amounts depend on underwriting and your deposit history.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleHigh: 1.1 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "Crews get paid weekly. The contract pays net-60.",
      intro: "Win a big commercial account and the work starts immediately — but the payment terms mean you carry the crew and supplies in the meantime.",
      items: [
        { icon: "payroll", pain: "Crews and supplies get paid weekly, but your commercial contracts pay net-30 or net-60 — and you just won two more accounts.", relief: "With capital in place, you cover payroll and supplies now and let the receivables clear on their own terms instead of yours." },
        { icon: "tools", pain: "Onboarding a new account means equipment and supplies up front, long before that contract's first check arrives.", relief: "With working capital ready, you take on the account and gear up immediately instead of slow-walking the start." },
        { icon: "vehicle", pain: "A new route would grow the business, but a vehicle and crew cost cash the current contracts are already spoken for.", relief: "With funding behind you, you expand the service area without straining the accounts already on the books." },
      ],
      closer: "You may qualify on your recurring-contract deposits and bank activity, net-term gaps included. No obligation, and any payments are built to fit your cash flow.",
    },
    campaignTag: "cleaning",
  },
  {
    slug: "bad-credit-business-funding",
    title: "Bad Credit Business Funding",
    seoTitle: "Bad Credit Business Funding — Reviewed on Revenue",
    seoDescription:
      "Funding options that weigh business revenue and bank activity, not just credit score. You may qualify. Approval depends on underwriting.",
    theme: { accent: "emerald" },
    heroHeadline: "Your revenue tells a story your score doesn't",
    heroSubheadline:
      "We weigh business revenue and bank activity first; credit is one input, not the gatekeeper.",
    cashFlowSignature:
      "A rough credit stretch is behind you, but the deposits never stopped — and the next opportunity won't wait for your score to recover.",
    heroHighlights: ["Revenue weighed first", "Past issues don't auto-disqualify", "A real specialist reviews it"],
    heroImage: { src: "/media/bad-credit.jpg", alt: "A small-business owner reviewing finances" },
    useCaseIcons: ["scale", "clock", "shield", "payroll", "spark"],
    useCases: [
      { title: "Working capital", description: "Access working capital even when credit isn't perfect." },
      { title: "Cover a cash crunch", description: "Bridge a short-term gap so operations keep running." },
      { title: "Manage tight payments", description: "Review options when current payments are tight on cash flow." },
      { title: "Payroll", description: "Keep your team paid through a rough stretch." },
      { title: "Fund a recovery", description: "Invest in inventory, equipment, or marketing to recover and grow." },
    ],
    calcContext: "Use your average monthly deposits — credit isn't part of this estimate. Four questions for a live range.",
    qualificationFocus: [
      { title: "Revenue first", description: "Business revenue and deposits carry the most weight in the review." },
      { title: "Bank health", description: "Recent NSFs and negative days matter more than the score itself." },
      { title: "Time in business", description: "Operating history strengthens the file regardless of credit." },
    ],
    qualificationNotes: [
      "Underwriting weighs business revenue and bank activity heavily, so past credit issues don't automatically disqualify a file. Credit is still considered.",
    ],
    goodFitCriteria: [
      "Steady monthly deposits despite credit history",
      "Operating 6+ months",
      "Mostly positive bank balances",
      "Able to share recent bank statements",
    ],
    reviewCriteria: [
      "Under 3 months in business",
      "Frequent NSFs or negative balance days",
      "Multiple advances stacked together",
      "Unable to provide bank statements right now",
    ],
    fitTable: [
      { label: "Time in business", goodFit: "6+ months operating", mayNeedReview: "Brand new / under 3 months" },
      { label: "Monthly deposits", goodFit: "Steady despite credit history", mayNeedReview: "Low or inconsistent deposits" },
      { label: "Bank activity", goodFit: "Mostly positive balances", mayNeedReview: "Frequent NSFs / negative days" },
      { label: "Existing advances", goodFit: "None or one manageable", mayNeedReview: "Multiple stacked advances" },
      { label: "Statements", goodFit: "3–4 months ready", mayNeedReview: "Can't share statements" },
    ],
    faqs: [
      {
        question: "Can I qualify with bad credit?",
        answer:
          "Possibly. The review weighs business revenue and bank activity, so past credit issues don't automatically disqualify you. Credit is still considered, and there's no guaranteed approval.",
      },
      {
        question: "Do you only look at my credit score?",
        answer:
          "No. Business revenue, bank activity, time in business, and existing obligations all matter — many files are placed largely on the strength of revenue and banking.",
      },
      ...baseFaqs(),
    ],
    calculator: { advanceMultipleLow: 0.4, advanceMultipleHigh: 0.9, factorRateLow: 1.3, factorRateHigh: 1.49 },
    cta: defaultCta,
    painRelief: {
      eyebrow: "Sound familiar?",
      headline: "The deposits kept coming. The 'no' still came anyway.",
      intro: "The score from a rough stretch follows you around long after the business recovered. Here's where owners feel that mismatch most.",
      items: [
        { icon: "scale", pain: "Your statements show steady deposits month after month, but one number on a credit report keeps deciding the conversation before anyone looks at the revenue.", relief: "Here the review weighs business revenue and bank activity first — a real specialist reads the deposits, so credit is one input, not the gatekeeper." },
        { icon: "spark", pain: "An opportunity lands — inventory, a contract, a piece of equipment — and you're watching it pass because you assume your credit already answered for you.", relief: "With options reviewed on revenue, past credit issues don't automatically disqualify the file, so you can find out where you stand before the window closes." },
        { icon: "shield", pain: "Current payments are tight and you're quietly juggling which one slips this week, sure that asking for help just means another hard no.", relief: "A specialist can review your file and walk through options that fit your cash flow — past stumbles don't end the conversation before it starts." },
      ],
      closer: "You may qualify based on revenue and bank activity, not credit alone. Credit is still considered, there's no guaranteed approval, and there's no obligation to accept an offer.",
    },
    campaignTag: "bad-credit",
  },
];

/**
 * Catch-all "any business" config used by the homepage (NOT part of landingPages,
 * so it never enters generateStaticParams / the sitemap / the [vertical] route).
 */
export const generalFunding: VerticalConfig = {
  slug: "business-funding",
  title: "Small Business Funding",
  seoTitle: "Small Business Funding — Working Capital on Revenue",
  seoDescription:
    "Working capital for small businesses, reviewed on revenue and bank activity — not credit alone. You may qualify. Approval depends on underwriting.",
  theme: { accent: "emerald" },
  heroHeadline: "Working capital, reviewed on your revenue",
  heroSubheadline:
    "For real operating businesses of almost any kind — we review on deposits and bank activity, not credit alone.",
  cashFlowSignature:
    "Payroll, inventory, or a sudden repair won't wait for next month's receivables to clear.",
  heroHighlights: ["Most industries welcome", "Reviewed on revenue, not just credit", "A real specialist reviews it"],
  heroImage: { src: "/media/general.jpg", alt: "A small-business owner at work" },
  useCaseIcons: ["payroll", "inventory", "tools", "expand", "spark"],
  useCases: [
    { title: "Working capital", description: "Smooth out cash flow and cover day-to-day operating costs." },
    { title: "Inventory & supplies", description: "Buy stock or supplies ahead of demand." },
    { title: "Equipment", description: "Repair or add equipment to keep things running." },
    { title: "Payroll", description: "Keep your team paid through a slower stretch." },
    { title: "Growth", description: "Invest in marketing, a new location, or expansion." },
  ],
  calcContext: "Use your average monthly deposits. Four questions for a live range and a readiness check.",
  qualificationFocus: WHAT_WE_LOOK_AT.slice(0, 3),
  qualificationNotes: ["We review most operating businesses on revenue and bank activity. Approval depends on underwriting."],
  goodFitCriteria: baseGoodFit(),
  reviewCriteria: baseReview(),
  fitTable: baseFitTable(),
  faqs: baseFaqs(),
  painRelief: {
    eyebrow: "Sound familiar?",
    headline: "The bill is due now. The money lands next month.",
    intro: "Almost every business runs on the same gap — between the work you've done and the cash that pays for it. Here's where it usually pinches.",
    items: [
      { icon: "clock", pain: "Payroll, rent, or a vendor is due this week, but the receivables that cover it don't clear until next month.", relief: "With working capital in place, you cover what's due now and let receivables catch up on their own timeline instead of yours." },
      { icon: "tools", pain: "A key piece of equipment breaks at the worst possible moment, and the repair costs less than the days you'd lose waiting to afford it.", relief: "With capital on hand, you fix or replace it now and keep earning, instead of letting downtime quietly cost you more than the fix." },
      { icon: "spark", pain: "A real opportunity shows up — a bigger order, a new location, a contract — and the only thing missing is the cash to act before the window closes.", relief: "With funding behind you, you say yes on the opportunity's timeline rather than watching it pass while you free up cash." },
    ],
    closer: "Most operating businesses can be reviewed on revenue and bank activity, not credit alone. You may qualify; approval depends on underwriting, and there's no obligation to accept an offer.",
  },
  cta: defaultCta,
  campaignTag: "general",
};

/* ── lookups ────────────────────────────────────────────────────────────── */

export function getVerticalBySlug(slug: string): VerticalConfig | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return landingPages.map((p) => p.slug);
}

/**
 * Verticals to render for THIS deployment. Defaults to all 12. If SITE_VERTICAL
 * is set (Option C upgrade), the same repo serves a single vertical on its own
 * domain. See README "Future: multiple domains".
 */
export function getActiveVerticals(): VerticalConfig[] {
  const only = process.env.SITE_VERTICAL?.trim();
  if (only) {
    const match = landingPages.filter((p) => p.slug === only);
    if (match.length) return match;
  }
  return landingPages;
}

/** Keywords → vertical slug, for the homepage industry picker. */
const INDUSTRY_KEYWORDS: { slug: string; words: string[] }[] = [
  { slug: "restaurant-business-funding", words: ["restaurant", "cafe", "café", "diner", "bar", "food", "bakery", "catering", "coffee", "pizzeria", "kitchen"] },
  { slug: "trucking-business-funding", words: ["truck", "trucking", "carrier", "owner operator", "owner-operator", "fleet", "freight", "logistics", "hauling", "transport", "dispatch"] },
  { slug: "construction-business-funding", words: ["construction", "contractor", "builder", "general contractor", "subcontractor", "sub", "concrete", "framing", "roofing", "remodel", "excavation"] },
  { slug: "ecommerce-inventory-funding", words: ["ecommerce", "e-commerce", "online", "shopify", "amazon", "etsy", "dtc", "store online", "seller", "dropship"] },
  { slug: "auto-repair-shop-funding", words: ["auto", "mechanic", "repair shop", "garage", "body shop", "tire", "automotive", "collision", "transmission"] },
  { slug: "medical-practice-funding", words: ["medical", "doctor", "physician", "clinic", "practice", "healthcare", "urgent care", "chiropractor", "physical therapy"] },
  { slug: "dental-practice-funding", words: ["dental", "dentist", "orthodont", "ortho", "hygien"] },
  { slug: "beauty-salon-med-spa-funding", words: ["salon", "spa", "med spa", "medspa", "beauty", "barber", "hair", "nail", "lash", "aesthetic", "wax"] },
  { slug: "retail-store-funding", words: ["retail", "store", "shop", "boutique", "merchant", "storefront"] },
  { slug: "hvac-plumbing-business-funding", words: ["hvac", "plumbing", "plumber", "heating", "cooling", "ac", "air conditioning", "electrician", "electrical", "mechanical"] },
  { slug: "cleaning-business-funding", words: ["cleaning", "janitorial", "maid", "housekeeping", "custodial", "carpet", "sanitation"] },
  { slug: "bad-credit-business-funding", words: ["bad credit", "poor credit", "low credit", "credit issues", "no credit"] },
];

/** Best-effort match of a free-text industry to a vertical slug. */
export function matchIndustry(query: string): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const { slug, words } of INDUSTRY_KEYWORDS) {
    if (words.some((w) => q.includes(w))) return slug;
  }
  return null;
}
