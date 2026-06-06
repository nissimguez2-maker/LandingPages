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

/** Standard "What we look at" section — shared across every vertical. */
export const WHAT_WE_LOOK_AT: { title: string; description: string }[] = [
  { title: "Monthly deposits", description: "Steady deposits show the business can support new payments." },
  { title: "Time in business", description: "More operating history strengthens a review." },
  { title: "Bank activity", description: "Healthy day-to-day banking often matters more than one number." },
  {
    title: "Existing debt / advances",
    description: "Current loans or advances — and how many run at once (“stacked”) — affect what's realistic.",
  },
  {
    title: "Recent NSFs / negative days",
    description: "Frequent NSFs (bounced payments) or negative-balance days can make a file harder to place.",
  },
  { title: "Use of funds", description: "A clear, productive use of funds strengthens the file." },
  { title: "Document readiness", description: "Files with statements ready can be reviewed sooner." },
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

/** Shared, compliance-safe FAQs (shortened + scannable). Verticals prepend 1–2 specific ones. */
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
    question: "How fast can funding happen?",
    answer:
      "Timing depends on your file and documentation. Complete statements help a review move along. There's no guaranteed approval or timing.",
  },
  {
    question: "Is there any obligation?",
    answer:
      "None. Submitting your information doesn't obligate you to accept an offer, and any payments must fit your cash flow. A specialist may contact you to review your inquiry.",
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
      "Working capital for restaurants, reviewed on revenue and bank activity. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Working Capital for Restaurants, Reviewed Fast",
    heroSubheadline:
      "Working capital for restaurants — reviewed on your deposits and bank activity, not credit alone.",
    heroHighlights: ["Reviewed on revenue & bank activity", "Built for daily card-batch cash flow", "Seasonality is expected, not penalized"],
    painPoint: "Equipment fails, suppliers want paying, and a slow month can hit — sometimes all at once.",
    heroImage: { alt: "A busy restaurant kitchen during service" },
    useCaseIcons: ["tools", "inventory", "payroll", "expand", "marketing"],
    useCases: [
      { title: "Kitchen equipment", description: "Repair or replace ovens, refrigeration, and line equipment when capital is in place." },
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
          "Not on its own. Underwriting expects seasonal swings in food service and looks at your overall deposit pattern, not a single slow month.",
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
      "Working capital for owner-operators and fleets — reviewed on deposits and settlements, not credit alone.",
    heroHighlights: ["Reviewed on deposits & settlements", "For owner-operators and fleets", "Fuel & repair gaps in mind"],
    painPoint: "Fuel, repairs, and slow-paying brokers can squeeze cash before the next settlement clears.",
    heroImage: { alt: "A semi truck driver beside their rig" },
    useCaseIcons: ["vehicle", "tools", "expand", "scale", "payroll"],
    useCases: [
      { title: "Fuel & maintenance", description: "Smooth out fuel costs and routine maintenance between settlements." },
      { title: "Truck & trailer repairs", description: "Cover unexpected repairs and maintenance when capital is in place." },
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
      "Working capital for contractors and subs — reviewed on deposits and bank activity, not credit alone.",
    heroHighlights: ["Built around draw schedules", "For GCs and subcontractors", "Lumpy cash flow is expected"],
    painPoint: "Materials and payroll come due long before the draw or final check arrives.",
    heroImage: { alt: "A contractor reviewing plans on a job site" },
    useCaseIcons: ["inventory", "payroll", "tools", "expand", "spark"],
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
      "Working capital for online sellers — reviewed on revenue, processor volume, and bank activity.",
    heroHighlights: ["Reviewed on processor & deposit volume", "Built for peak-season stocking", "Marketplace sellers welcome"],
    painPoint: "Peak season rewards the sellers who can stock up before demand spikes.",
    heroImage: { alt: "An e-commerce owner packing orders in a warehouse" },
    useCaseIcons: ["cart", "inventory", "marketing", "scale", "expand"],
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
      "Working capital for auto repair and service shops — reviewed on deposits and bank activity.",
    heroHighlights: ["Reviewed on shop deposits", "For independents and chains", "Parts & equipment cash flow in mind"],
    painPoint: "Parts, equipment, and technician payroll don't wait for a slow week to end.",
    heroImage: { alt: "A technician working in an auto repair bay" },
    useCaseIcons: ["tools", "inventory", "payroll", "expand", "marketing"],
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
      "Working capital for medical practices — reviewed on deposits and bank activity, with reimbursement timing in mind.",
    heroHighlights: ["Built for reimbursement cycles", "For solo & group practices", "Insurance lag is expected"],
    painPoint: "Payroll and equipment costs don't pause while insurance reimbursements catch up.",
    heroImage: { alt: "A physician in a modern medical practice" },
    useCaseIcons: ["tools", "payroll", "expand", "scale", "spark"],
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
      "Working capital for dental practices — reviewed on collections and bank activity, not credit alone.",
    heroHighlights: ["Built for production cycles", "For solo & group practices", "Reviewed on collections, not credit alone"],
    painPoint: "Growing a practice often means paying for chairs and staff before collections rise.",
    heroImage: { alt: "A dentist in a modern dental operatory" },
    useCaseIcons: ["tools", "payroll", "expand", "spark", "marketing"],
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
      "Working capital for salons and med spas — reviewed on deposits and bank activity, not credit alone.",
    heroHighlights: ["Built for appointment-driven revenue", "For salons and med spas", "Seasonal swings are expected"],
    painPoint: "Equipment, inventory, and staffing costs rise before the calendar fills up.",
    heroImage: { alt: "A stylist in a modern salon" },
    useCaseIcons: ["tools", "inventory", "expand", "payroll", "marketing"],
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
      "Working capital for retail businesses — reviewed on sales, deposits, and bank activity.",
    heroHighlights: ["Built for seasonal inventory", "Single or multi-location", "Reviewed on sales & deposits"],
    painPoint: "The busy season rewards stores that can stock and staff up beforehand.",
    heroImage: { alt: "A shop owner at the counter of their retail store" },
    useCaseIcons: ["inventory", "expand", "tools", "payroll", "marketing"],
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
      "Working capital for HVAC and plumbing contractors — reviewed on deposits and bank activity.",
    heroHighlights: ["Built for seasonal demand", "For service & install crews", "Reviewed on deposits, not credit alone"],
    painPoint: "Peak-season demand can spike faster than cash flow keeps up.",
    heroImage: { alt: "An HVAC technician servicing a unit" },
    useCaseIcons: ["vehicle", "inventory", "payroll", "expand", "marketing"],
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
      "Working capital for residential and commercial cleaning businesses — reviewed on deposits and bank activity.",
    heroHighlights: ["Built for recurring contracts", "Residential & commercial", "Net-30/60 receivables in mind"],
    painPoint: "Crews and supplies get paid weekly while commercial contracts pay on net-30/60.",
    heroImage: { alt: "A cleaning crew member at work in a commercial space" },
    useCaseIcons: ["tools", "payroll", "vehicle", "scale", "expand"],
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
      "Funding options that weigh business revenue and bank activity, not just credit score. You may qualify. Approval depends on underwriting.",
    heroHeadline: "Business Funding Options When Credit Isn't Perfect",
    heroSubheadline:
      "A review that weighs your business revenue and bank activity — credit is considered, but it isn't the whole story.",
    heroHighlights: ["Reviewed on revenue, not just credit", "Past issues don't auto-disqualify", "Reviewed by a real specialist"],
    painPoint: "A rough credit stretch shouldn't freeze a business that's still bringing in revenue.",
    heroImage: { alt: "A small-business owner reviewing finances" },
    useCaseIcons: ["scale", "clock", "shield", "payroll", "spark"],
    useCases: [
      { title: "Working capital", description: "Access working capital even when credit isn't perfect." },
      { title: "Cover a cash crunch", description: "Bridge a short-term gap so operations keep running." },
      { title: "Manage tight payments", description: "Review options when current payments are tight on cash flow." },
      { title: "Payroll", description: "Keep your team paid through a rough stretch." },
      { title: "Fund growth", description: "Invest in inventory, equipment, or marketing to recover and grow." },
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
    reviewCriteria: baseReview(),
    fitTable: baseFitTable(),
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
