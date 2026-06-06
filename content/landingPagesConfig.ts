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
 */

import type { VerticalConfig, FAQItem, FitRow } from "@/lib/types";

/** Standard "What we look at" section — shared across every vertical. */
export const WHAT_WE_LOOK_AT: { title: string; description: string }[] = [
  {
    title: "Monthly deposits",
    description: "Consistent deposits show the business can support payments that fit cash flow.",
  },
  {
    title: "Time in business",
    description: "A longer operating history generally supports a stronger review.",
  },
  {
    title: "Bank activity",
    description: "Healthy day-to-day banking often matters more than any single number.",
  },
  {
    title: "Existing debt / advances",
    description: "Current advances and how they're stacked affect what's realistic.",
  },
  {
    title: "Recent NSFs / negative days",
    description: "Frequent negative days can make a file harder to place.",
  },
  {
    title: "Use of funds",
    description: "A clear, productive use of funds strengthens the file.",
  },
  {
    title: "Document readiness",
    description: "Clean files with statements ready can move faster.",
  },
];

/** Shared, compliance-safe FAQs. Each vertical prepends 1–2 specific ones. */
const baseFaqs = (): FAQItem[] => [
  {
    question: "How much funding could my business qualify for?",
    answer:
      "It depends on underwriting. Any amount is based on business revenue, bank activity, time in business, and existing obligations. You may qualify for a range once a funding specialist reviews your file. Approval depends on underwriting.",
  },
  {
    question: "What do I need to get started?",
    answer:
      "Just a quick prequalification to begin. If the file looks viable, recent business bank statements (typically 3–4 months) help move it forward. Clean files can move faster.",
  },
  {
    question: "Will checking my readiness affect my credit?",
    answer:
      "Starting a prequalification doesn't require a hard credit check. A review of available options is based primarily on business revenue and bank activity. Approval depends on underwriting and documentation.",
  },
  {
    question: "How fast can funding happen?",
    answer:
      "Timing depends on your file and documentation. Clean files with complete statements can move faster. There is no guarantee of approval or timing.",
  },
  {
    question: "Is there any obligation?",
    answer:
      "No. Submitting your information is no obligation to accept an offer. A funding specialist may contact you to review whether the file is worth pursuing, and any payments must fit your cash flow.",
  },
];

/** Shared good-fit / may-need-review comparison rows. */
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

const defaultCta = { primary: "Check Your Funding Readiness", secondary: "Start Prequalification" };

export const landingPages: VerticalConfig[] = [
  {
    slug: "restaurant-business-funding",
    title: "Restaurant Business Funding",
    seoTitle: "Restaurant Business Funding — Fast Working-Capital Review",
    seoDescription:
      "Working capital for restaurants and food service, reviewed fast based on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for Restaurants, Reviewed Fast",
    heroSubheadline:
      "A fast working-capital review for restaurants and food-service businesses — based on your revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Based on deposits, not just credit", "Built for daily-batch cash flow", "No obligation to accept an offer"],
    useCases: [
      { title: "Kitchen equipment", description: "Repair or replace ovens, refrigeration, and line equipment without stalling service." },
      { title: "Inventory & suppliers", description: "Cover food and supplier orders ahead of busy weekends and events." },
      { title: "Payroll through slow seasons", description: "Keep your team paid during predictable seasonal dips." },
      { title: "New location or patio", description: "Fund a build-out, patio, or second location when the timing is right." },
      { title: "Local marketing", description: "Drive covers with promotions, delivery apps, and local campaigns." },
    ],
    qualificationNotes: ["We factor seasonality and the daily card-batch deposits common to food service."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "Does seasonality hurt my chances?",
        answer:
          "Not on its own. Underwriting expects seasonal swings in food service and looks at your overall deposit pattern and bank activity, not a single slow month.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    campaignTag: "restaurant",
  },
  {
    slug: "trucking-business-funding",
    title: "Trucking Business Funding",
    seoTitle: "Trucking Business Funding — Working Capital for Carriers",
    seoDescription:
      "Working capital for owner-operators and fleets, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Keep Your Trucks Moving with Fast Working Capital",
    heroSubheadline:
      "A fast working-capital review for owner-operators and fleets — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Reviewed on deposits and settlements", "For owner-operators and fleets", "No obligation to accept an offer"],
    useCases: [
      { title: "Fuel & maintenance", description: "Smooth out fuel costs and routine maintenance between settlements." },
      { title: "Truck & trailer repairs", description: "Cover unexpected repairs so a down truck doesn't stop your revenue." },
      { title: "Equipment down payment", description: "Put money down on another truck or trailer to grow capacity." },
      { title: "Bridge slow-paying freight", description: "Cover the gap while brokers and shippers pay invoices." },
      { title: "Driver payroll", description: "Keep drivers paid on time during slower freight weeks." },
    ],
    qualificationNotes: ["We understand fluctuating fuel costs and factor settlement and deposit patterns."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "I'm a single owner-operator — can I still apply?",
        answer:
          "Yes. Owner-operators are reviewed on the same basis: business revenue, bank activity, and time in business. You may qualify; approval depends on underwriting.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    campaignTag: "trucking",
  },
  {
    slug: "construction-business-funding",
    title: "Construction Contractor Funding",
    seoTitle: "Construction Contractor Funding — Bridge Jobs & Payroll",
    seoDescription:
      "Working capital for contractors and subcontractors, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Funding to Bridge Jobs and Payroll for Contractors",
    heroSubheadline:
      "A fast working-capital review for contractors and subcontractors — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built around draw schedules", "For GCs and subs", "No obligation to accept an offer"],
    useCases: [
      { title: "Materials upfront", description: "Buy materials before a draw or final payment comes in." },
      { title: "Payroll between draws", description: "Keep crews working while you wait on progress billing." },
      { title: "Equipment", description: "Purchase or repair equipment to keep projects on schedule." },
      { title: "Mobilization costs", description: "Cover mobilization and upfront costs to start a new job." },
      { title: "Take a larger project", description: "Say yes to a bigger contract with capital ready to go." },
    ],
    qualificationNotes: ["We account for progress billing and draw schedules common in construction."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "My income is lumpy between draws — does that matter?",
        answer:
          "Lumpy cash flow is normal in construction. Underwriting looks at your deposit history over several months, so a gap between draws doesn't automatically work against you.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    campaignTag: "construction",
  },
  {
    slug: "ecommerce-inventory-funding",
    title: "E-commerce Inventory Funding",
    seoTitle: "E-commerce Inventory Funding — Fund Stock & Growth",
    seoDescription:
      "Inventory and growth capital for online sellers, reviewed on processor volume and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Inventory Funding for Growing E-commerce Brands",
    heroSubheadline:
      "A fast working-capital review for online sellers — based on revenue, processor volume, and bank activity. You may qualify.",
    heroHighlights: ["Reviewed on processor volume", "Built for peak-season stocking", "No obligation to accept an offer"],
    useCases: [
      { title: "Bulk inventory", description: "Buy inventory ahead of peak season at better unit costs." },
      { title: "Restock best-sellers", description: "Keep top SKUs in stock so you never miss a sale." },
      { title: "Scale ad spend", description: "Fund proven campaigns to grow while ROAS is strong." },
      { title: "Supplier deposits", description: "Cover supplier deposits and longer production lead times." },
      { title: "Warehousing & 3PL", description: "Fund fulfillment, storage, and 3PL as order volume grows." },
    ],
    qualificationNotes: ["We factor card-processor and marketplace deposit volume alongside bank activity."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "Do you look at my Shopify / Amazon / processor volume?",
        answer:
          "Yes. For online sellers, card-processor and marketplace deposit volume are part of the review, along with your business bank activity.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    industryFocus: "retail",
    campaignTag: "ecommerce",
  },
  {
    slug: "auto-repair-shop-funding",
    title: "Auto Repair Shop Funding",
    seoTitle: "Auto Repair Shop Funding — Working Capital for Shops",
    seoDescription:
      "Working capital for auto repair shops, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for Auto Repair Shops",
    heroSubheadline:
      "A fast working-capital review for auto repair and service shops — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Reviewed on shop deposits", "For independents and chains", "No obligation to accept an offer"],
    useCases: [
      { title: "Diagnostic & lift equipment", description: "Add or repair lifts, scanners, and diagnostic tools." },
      { title: "Parts inventory", description: "Stock common parts to cut turnaround and win more tickets." },
      { title: "Technician payroll", description: "Keep skilled techs paid through slower weeks." },
      { title: "Add a bay", description: "Expand capacity with another bay or location." },
      { title: "Marketing", description: "Bring in cars with local and digital campaigns." },
    ],
    qualificationNotes: ["We factor ticket-based revenue and the parts cash-flow cycle."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    campaignTag: "auto-repair",
  },
  {
    slug: "medical-practice-funding",
    title: "Medical Practice Funding",
    seoTitle: "Medical Practice Funding — Working Capital, Reviewed Fast",
    seoDescription:
      "Working capital for medical practices, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Funding for Medical Practices, Reviewed Quickly",
    heroSubheadline:
      "A fast working-capital review for medical practices — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for reimbursement cycles", "For solo and group practices", "No obligation to accept an offer"],
    useCases: [
      { title: "Equipment", description: "Add or upgrade diagnostic and treatment equipment." },
      { title: "Hire staff", description: "Bring on clinical or front-office staff to grow capacity." },
      { title: "Expand or relocate", description: "Fund a build-out, new suite, or additional location." },
      { title: "Bridge reimbursements", description: "Smooth cash flow while insurance reimbursements process." },
      { title: "New service lines", description: "Launch a new service line or procedure offering." },
    ],
    qualificationNotes: ["We account for insurance reimbursement cycles when reviewing deposits."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "My deposits lag because of insurance — is that a problem?",
        answer:
          "Reimbursement lag is expected for practices. Underwriting reviews your deposit pattern over time, so timing gaps don't automatically count against the file.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    industryFocus: "healthcare",
    campaignTag: "medical",
  },
  {
    slug: "dental-practice-funding",
    title: "Dental Practice Funding",
    seoTitle: "Dental Practice Funding — Working Capital for Dentists",
    seoDescription:
      "Working capital for dental practices, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for Dental Practices",
    heroSubheadline:
      "A fast working-capital review for dental practices — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for production cycles", "For solo and group practices", "No obligation to accept an offer"],
    useCases: [
      { title: "Chairs & imaging", description: "Add operatories, chairs, or imaging technology." },
      { title: "Hire hygienists", description: "Expand your team to see more patients." },
      { title: "Office build-out", description: "Renovate or expand your office footprint." },
      { title: "Practice software & tech", description: "Upgrade practice management and patient tools." },
      { title: "Marketing", description: "Grow new-patient flow with local campaigns." },
    ],
    qualificationNotes: ["We factor production and collection patterns common to dental offices."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    industryFocus: "healthcare",
    campaignTag: "dental",
  },
  {
    slug: "beauty-salon-med-spa-funding",
    title: "Beauty Salon / Med Spa Funding",
    seoTitle: "Beauty Salon & Med Spa Funding — Working Capital",
    seoDescription:
      "Working capital for salons and med spas, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Funding for Beauty Salons and Med Spas",
    heroSubheadline:
      "A fast working-capital review for salons and med spas — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for appointment-driven revenue", "For salons and med spas", "No obligation to accept an offer"],
    useCases: [
      { title: "Equipment", description: "Add chairs, lasers, or treatment devices." },
      { title: "Retail inventory", description: "Stock retail products and treatment supplies." },
      { title: "Renovation", description: "Refresh or expand your space to grow bookings." },
      { title: "Hire & train", description: "Bring on stylists or technicians and train your team." },
      { title: "Marketing", description: "Fill the calendar with promotions and local ads." },
    ],
    qualificationNotes: ["We factor appointment-driven and seasonal revenue patterns."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    industryFocus: "healthcare",
    campaignTag: "beauty-medspa",
  },
  {
    slug: "retail-store-funding",
    title: "Retail Store Funding",
    seoTitle: "Retail Store Funding — Inventory & Working Capital",
    seoDescription:
      "Working capital for retail stores, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Inventory and Working Capital for Retail Stores",
    heroSubheadline:
      "A fast working-capital review for retail businesses — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for seasonal inventory", "For single and multi-location", "No obligation to accept an offer"],
    useCases: [
      { title: "Seasonal inventory", description: "Stock up ahead of your busiest selling season." },
      { title: "Store expansion", description: "Fund a build-out, remodel, or new location." },
      { title: "POS & equipment", description: "Upgrade point-of-sale and store equipment." },
      { title: "Payroll", description: "Cover staffing through seasonal peaks and dips." },
      { title: "Marketing", description: "Drive foot traffic and sales with local campaigns." },
    ],
    qualificationNotes: ["We factor seasonal sales cycles and card-processor volume."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    industryFocus: "retail",
    campaignTag: "retail",
  },
  {
    slug: "hvac-plumbing-business-funding",
    title: "HVAC / Plumbing Business Funding",
    seoTitle: "HVAC & Plumbing Business Funding — Working Capital",
    seoDescription:
      "Working capital for HVAC and plumbing businesses, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for HVAC and Plumbing Businesses",
    heroSubheadline:
      "A fast working-capital review for HVAC and plumbing contractors — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for seasonal demand", "For service and install crews", "No obligation to accept an offer"],
    useCases: [
      { title: "Trucks & equipment", description: "Add or repair service trucks and field equipment." },
      { title: "Parts for peak season", description: "Stock parts and units ahead of summer and winter rushes." },
      { title: "Payroll", description: "Staff up for busy season and keep techs paid." },
      { title: "Expansion", description: "Grow into new territory or add a crew." },
      { title: "Marketing", description: "Generate service calls with local and digital ads." },
    ],
    qualificationNotes: ["We factor the seasonal demand swings common to HVAC and plumbing."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    campaignTag: "hvac-plumbing",
  },
  {
    slug: "cleaning-business-funding",
    title: "Cleaning Business Funding",
    seoTitle: "Cleaning Business Funding — Working Capital for Crews",
    seoDescription:
      "Working capital for cleaning businesses, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for Cleaning Businesses",
    heroSubheadline:
      "A fast working-capital review for residential and commercial cleaning businesses — based on revenue, bank activity, and time in business. You may qualify.",
    heroHighlights: ["Built for contract receivables", "For residential and commercial", "No obligation to accept an offer"],
    useCases: [
      { title: "Equipment & supplies", description: "Buy equipment and supplies to take on more accounts." },
      { title: "Crew payroll", description: "Keep crews paid while invoices are outstanding." },
      { title: "Vehicles", description: "Add a vehicle to expand your service area." },
      { title: "Bridge net-30/60 contracts", description: "Cover the gap on commercial contracts with longer terms." },
      { title: "Expansion", description: "Win and onboard larger recurring contracts." },
    ],
    qualificationNotes: ["We factor recurring-contract revenue and net-term receivables."],
    goodFitCriteria: baseGoodFit(),
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: baseFaqs(),
    cta: defaultCta,
    campaignTag: "cleaning",
  },
  {
    slug: "bad-credit-business-funding",
    title: "Bad Credit Business Funding",
    seoTitle: "Bad Credit Business Funding — Reviewed on Revenue",
    seoDescription:
      "Funding options that focus on business revenue and bank activity, not just credit score. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Business Funding Options When Credit Isn't Perfect",
    heroSubheadline:
      "A working-capital review that looks at business revenue and bank activity — not just your credit score. You may qualify; approval depends on underwriting.",
    heroHighlights: ["Reviewed on revenue, not just credit", "Past issues don't auto-disqualify", "No obligation to accept an offer"],
    useCases: [
      { title: "Working capital", description: "Access working capital even when credit isn't perfect." },
      { title: "Cover a cash crunch", description: "Bridge a short-term gap so operations keep running." },
      { title: "Manage tight payments", description: "Review options when current payments are tight on cash flow." },
      { title: "Payroll", description: "Keep your team paid through a rough stretch." },
      { title: "Fund growth", description: "Invest in inventory, equipment, or marketing to recover and grow." },
    ],
    qualificationNotes: [
      "Underwriting weighs business revenue and bank activity heavily, so past credit issues don't automatically disqualify a file.",
    ],
    goodFitCriteria: [
      "Steady monthly deposits despite credit history",
      "Operating 6+ months",
      "Mostly positive bank balances",
      "Able to share recent bank statements",
    ],
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
    faqs: [
      {
        question: "Can I qualify with bad credit?",
        answer:
          "Possibly. The review focuses on business revenue and bank activity, so past credit issues don't automatically disqualify you. There is no guaranteed approval — approval depends on underwriting.",
      },
      {
        question: "Do you only look at my credit score?",
        answer:
          "No. Business revenue, bank activity, time in business, and existing obligations all matter. Many files are placed primarily on the strength of revenue and banking.",
      },
      ...baseFaqs(),
    ],
    cta: defaultCta,
    campaignTag: "bad-credit",
  },
];

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
