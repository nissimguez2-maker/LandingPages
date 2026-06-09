import type { ResourceArticle } from "@/lib/types";

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Resource-hub articles. Top-of-funnel education that funnels to money pages.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Same compliance rules as landingPagesConfig.ts:
 *   - FundVella is NOT a lender; it connects owners with funding specialists.
 *   - "You may qualify; approval depends on underwriting." Never guaranteed,
 *     instant, pre-approved, or same-day.
 *   - A factor rate is NOT an APR. Say so wherever cost is discussed.
 *   - No specific APR, no "lowest/cheapest rate," no unqualified "no credit
 *     check," no earnings claims, no manufactured urgency.
 *   - General education only, not financial, legal, or tax advice.
 *   - Any dollar figure is illustrative, not an offer. No invented stats or
 *     testimonials.
 *   - Most modern MCAs repay via a FIXED daily or weekly ACH. Only true
 *     card-split deals flex with a slow week. Do not blur the two.
 *
 * Body strings are double-quoted ASCII. No unescaped double quotes inside text.
 * No em-dashes. Inline links use [anchor](/path) and stay same-origin.
 */
export const guidesContent: ResourceArticle[] = [
  {
    slug: "working-capital-guide",
    kind: "pillar",
    title: "Small-Business Working Capital: The Plain-English Guide",
    seoTitle: "Working Capital for Small Business: Plain Guide",
    seoDescription:
      "What working capital is, why timing creates the gap, and the funding options owners use to cover it. Plain English, honest, no hype.",
    excerpt:
      "Working capital is the cash you have to run the business today. Here is what it is, why the gap happens, and how owners cover it.",
    category: "Working Capital",
    primaryKeyword: "working capital for small business",
    moneyPagePath: "/",
    related: [
      "factor-rate-vs-apr",
      "merchant-cash-advance-explained",
      "business-funding-by-industry",
      "business-funding-bad-credit-guide",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        text: "Most owners do not run short on profit. They run short on timing. The work gets done, the bills come due, and the money that pays for it all shows up a week or a month after you needed it. That gap, between when cash goes out and when it comes back in, is what working capital is really about.",
      },
      {
        type: "p",
        text: "This guide walks through what working capital is, why the gap opens up even in a healthy business, and the funding options owners reach for to cover it. It is general education, not financial, legal, or tax advice, and every dollar figure here is illustrative.",
      },
      { type: "h2", text: "What working capital actually means" },
      {
        type: "p",
        text: "In accounting terms, working capital is your current assets minus your current liabilities. Strip out the jargon and it is simpler than that. It is the cash you can put to work right now to keep the doors open: payroll, rent, inventory, materials, repairs, the parts order the distributor wants paid on delivery.",
      },
      {
        type: "p",
        text: "When people say a business is tight on working capital, they rarely mean it is failing. They usually mean the money is real but it is not in the account yet. It is sitting in an unpaid invoice, a card batch that settles Monday, or a progress draw the general contractor still has to sign off on.",
      },
      { type: "h2", text: "Why the gap happens to good businesses" },
      {
        type: "p",
        text: "The gap is built into how most small businesses get paid. You spend money to do the work before the work pays you back. A restaurant fronts the produce order and payroll before the weekend batches land. A carrier fuels the truck before the broker pays net-45. A contractor buys materials before the draw clears.",
      },
      {
        type: "p",
        text: "Growth makes the gap wider, not narrower. The busier you get, the more cash you front before any of it comes back. That is the quiet trap: a great month can leave you shorter than a slow one, because you spent ahead of the deposits.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "A working-capital gap is a timing problem, not a sales problem. The fix is having cash on hand to bridge the days or weeks between paying for the work and getting paid for it.",
      },
      { type: "h2", text: "Signs you have a working-capital gap" },
      {
        type: "ul",
        items: [
          "You are profitable on paper but the bank balance does not show it.",
          "You delay buying inventory or parts because cash is tied up elsewhere.",
          "Payroll week makes you nervous even in a busy stretch.",
          "You have turned down a bigger job or order because committing the cash would starve the work you already have.",
          "A single slow-paying customer can stall everything else.",
        ],
      },
      { type: "h2", text: "How owners cover the gap" },
      {
        type: "p",
        text: "There is no single right way to fund a business. It depends on what the money is for and how you get paid. A specialist reviews your file and matches you to the option that fits your cash flow. Here are the ones owners reach for most.",
      },
      { type: "h3", text: "Working capital advance" },
      {
        type: "p",
        text: "Funding based on your revenue and bank activity rather than credit alone. A factor rate, not an APR, sets the cost up front, so you know the full payback before you say yes. This is what a [merchant cash advance, explained without the hype](/resources/merchant-cash-advance-explained) covers in detail, including how repayment actually works.",
      },
      { type: "h3", text: "Business line of credit" },
      {
        type: "p",
        text: "A revolving limit you draw from when you need it and pay down when you do not. Good when the need is recurring and you want capital ready for the next gap without reapplying. You carry only what you actually use.",
      },
      { type: "h3", text: "Term loan" },
      {
        type: "p",
        text: "A fixed amount repaid over a set term in predictable payments. A clean fit for a defined, one-time use like a build-out or a single large purchase.",
      },
      { type: "h3", text: "Equipment financing and invoice factoring" },
      {
        type: "p",
        text: "Equipment financing puts the truck, oven, chair, or machine to work now while keeping your cash free. Invoice factoring turns unpaid invoices into cash so a slow-paying client does not stall payroll. Both are matched to the situation, subject to review.",
      },
      { type: "h2", text: "What underwriting tends to look at" },
      {
        type: "p",
        text: "A revenue-first review weighs how your business actually runs, not one credit number. The things that move a file most are usually these.",
      },
      {
        type: "ul",
        items: [
          "Monthly deposits, which show the business can support new payments.",
          "Time in business, since more operating history strengthens a review.",
          "Day-to-day bank activity, which often matters more than any single score.",
          "Existing advances or loans, and how many run at once.",
          "Recent NSFs or negative-balance days, which can make a file harder to place.",
          "A clear, productive use of funds.",
        ],
      },
      {
        type: "p",
        text: "Credit is part of the picture, but it is not the only factor. If your credit has taken a hit, the [revenue-first guide to getting funded with bad credit](/resources/business-funding-bad-credit-guide) walks through what still matters and what you can do about the rest.",
      },
      { type: "h2", text: "How much working capital to ask for" },
      {
        type: "p",
        text: "More is not automatically better. The amount that helps is the amount that closes your specific gap without piling on a payment your slow weeks cannot carry. Start from the problem, not from the biggest number you might be offered.",
      },
      {
        type: "p",
        text: "A simple way to size it: add up what you have to pay before the matching money lands, then add a modest cushion for the unexpected. A restaurant might size it around a few weeks of payroll plus a vendor order. A carrier might size it around fuel and a repair while a net-45 invoice clears. The figure is illustrative, but the method is the point.",
      },
      {
        type: "ol",
        items: [
          "Name the gap: what bill or opportunity is the cash actually for?",
          "Add the costs you front before the related deposits come in.",
          "Add a cushion for a slow week or a surprise repair, not a wish list.",
          "Check the resulting payment against your leanest recent month, not your best one.",
        ],
      },
      { type: "h2", text: "Cost, in plain terms" },
      {
        type: "p",
        text: "On a working capital advance, the cost is usually quoted as a factor rate, like 1.25, rather than an interest rate. You multiply the amount advanced by the factor rate to see the full payback up front. A factor rate is not an APR, and the two are not interchangeable. If you want the worked math, read [factor rates vs APR and what an MCA actually costs](/resources/factor-rate-vs-apr) before you compare offers.",
      },
      {
        type: "p",
        text: "The right cost is the one your cash flow can carry. A cheaper-looking number with a payment your slow weeks cannot absorb is not actually cheaper. Any payment should fit how you get paid, not fight it.",
      },
      { type: "h2", text: "Common working-capital mistakes" },
      {
        type: "p",
        text: "The owners who run into trouble usually do so for predictable reasons, not bad luck. A few are worth naming.",
      },
      {
        type: "ul",
        items: [
          "Stacking advances: taking a second or third advance on top of the first, so every deposit is split before it can do any work.",
          "Funding a leak instead of a gap: capital bridges timing, it does not fix a business that loses money on every sale.",
          "Sizing to the offer instead of the need: borrowing the maximum because it is available, then carrying a payment the use never justified.",
          "Comparing a factor rate to an APR as if they are the same number, and misjudging the real cost.",
          "Ignoring the repayment rhythm: a daily debit lands very differently on cash flow than a monthly one.",
        ],
      },
      { type: "h2", text: "Funding by industry" },
      {
        type: "p",
        text: "How the gap shows up depends on your trade. Card batches, settlements, draws, and reimbursement lag all behave differently. The [business funding by industry directory](/resources/business-funding-by-industry) points you to the page built for how your business actually gets paid.",
      },
      {
        type: "callout",
        title: "Ready to see where you stand?",
        text: "When you are ready, a specialist can review your file and match you to options that fit your cash flow. You may qualify; approval depends on underwriting, and there is no obligation to accept an offer.",
      },
    ],
    faqs: [
      {
        question: "How much working capital does a small business need?",
        answer:
          "There is no single number. A common rule of thumb is enough cash to cover the gap between paying for work and getting paid for it, plus a cushion for slow weeks. The right amount depends on your revenue, your costs, and how long your customers take to pay.",
      },
      {
        question: "Is a working-capital gap the same as losing money?",
        answer:
          "No. A gap is a timing problem, not a sales problem. A profitable business can still run tight because money goes out before the deposits that cover it come in. Funding bridges that timing.",
      },
      {
        question: "Does applying require good credit?",
        answer:
          "A revenue-first review weighs your business revenue and bank activity, not credit alone. Credit is considered but it is not the only factor. You may qualify; approval depends on underwriting.",
      },
      {
        question: "Is FundVella a lender?",
        answer:
          "No. FundVella connects business owners with funding specialists who review your file and match you to available options. It does not make loans itself.",
      },
    ],
  },
  {
    slug: "merchant-cash-advance-explained",
    kind: "pillar",
    title: "Merchant Cash Advance, Explained Without the Hype",
    seoTitle: "What Is a Merchant Cash Advance? Plain Guide",
    seoDescription:
      "A merchant cash advance explained plainly: factor rate vs APR, holdback, fixed ACH vs card-split, and who it fits and who it does not.",
    excerpt:
      "What a merchant cash advance is, how repayment really works, what it costs, and the kind of business it actually fits.",
    category: "MCA Basics",
    primaryKeyword: "what is a merchant cash advance",
    moneyPagePath: "/",
    related: [
      "factor-rate-vs-apr",
      "mca-vs-business-loan",
      "working-capital-guide",
      "minimum-revenue-to-qualify",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        text: "A merchant cash advance gets talked about in two unhelpful ways. One side sells it as fast, easy money with no downside. The other side calls it a trap. Neither tells you what it actually is. This guide does, in plain terms, so you can decide whether it fits your business.",
      },
      {
        type: "p",
        text: "It is general education, not financial, legal, or tax advice. Any dollar figure is illustrative, not an offer.",
      },
      { type: "h2", text: "What a merchant cash advance is" },
      {
        type: "p",
        text: "A merchant cash advance, or MCA, is not a loan. It is the purchase of a slice of your future revenue at a discount. A funder advances you a lump sum today and, in return, collects a fixed total amount back out of your deposits over time. Because it is a purchase of receivables rather than a loan, the cost is quoted differently and the review leans on your revenue rather than your credit alone.",
      },
      {
        type: "p",
        text: "That structure is why a revenue-first review fits it. Underwriting looks at your monthly deposits and bank activity to decide what your revenue can realistically support. Time in business and existing obligations matter too. You may qualify; approval depends on underwriting.",
      },
      { type: "h2", text: "Factor rate vs APR" },
      {
        type: "p",
        text: "The cost of an MCA is usually quoted as a factor rate, a single number like 1.25, not an interest rate. You multiply the amount advanced by the factor rate to get the total you pay back. A factor rate is not an APR, and treating it like one will mislead you.",
      },
      {
        type: "p",
        text: "Here is the difference that trips owners up. With an interest-rate loan, paying early usually saves you money. With most MCAs, the payback total is fixed the moment you accept, so paying it off faster does not normally shrink what you owe. For the worked math on this, read [factor rates vs APR and what an MCA actually costs](/resources/factor-rate-vs-apr).",
      },
      {
        type: "callout",
        title: "Remember",
        text: "A factor rate is not an APR. The total payback on most advances is set up front and does not usually drop if you pay early. Ask any funder to confirm both before you sign.",
      },
      { type: "h2", text: "Holdback: how much comes out" },
      {
        type: "p",
        text: "Holdback is the share of your deposits that goes toward paying the advance back. If the holdback is, say, 10 percent, then roughly a tenth of qualifying deposits is remitted toward the balance until the fixed total is paid. The holdback sets the pace of repayment, while the factor rate sets the total cost. They are two separate numbers and you should understand both.",
      },
      { type: "h2", text: "Fixed ACH vs card-split: the part most articles get wrong" },
      {
        type: "p",
        text: "This is the detail that matters most, and a lot of explanations blur it. There are two common ways an advance is collected, and they behave very differently on a slow week.",
      },
      { type: "h3", text: "Fixed daily or weekly ACH" },
      {
        type: "p",
        text: "Most modern advances are repaid this way. The funder debits a set dollar amount from your business bank account every business day or every week. That amount does not shrink on a slow week. If your revenue dips, a fixed daily or weekly payment can feel heavier, because it stays the same while your deposits fall. This is the most common structure today, so assume it unless a funder tells you otherwise in writing.",
      },
      { type: "h3", text: "True card-split" },
      {
        type: "p",
        text: "In a true card-split, the funder takes its percentage straight off your card sales as they settle. When card sales are slow, the dollar amount collected that day is smaller, and when they are strong it is larger. Only this structure genuinely flexes with a slow week. It is less common now than fixed ACH, so do not assume an advance behaves this way just because someone calls it revenue-based.",
      },
      {
        type: "callout",
        title: "Ask one question",
        text: "Before you accept, ask: is repayment a fixed daily or weekly ACH, or a true card-split? The answer tells you exactly how the payment behaves the next time business is slow.",
      },
      { type: "h2", text: "Who it fits" },
      {
        type: "ul",
        items: [
          "Businesses with steady daily or weekly deposits that can absorb a regular remittance.",
          "Owners who need to move on a time-sensitive gap or opportunity and value speed and a revenue-first review.",
          "Trades where credit alone does not tell the real story, like restaurants, trucking, auto repair, and e-commerce.",
          "Owners who understand the full payback up front and have run it against their slow weeks.",
        ],
      },
      { type: "h2", text: "Who it does not fit" },
      {
        type: "ul",
        items: [
          "Businesses with thin or highly erratic deposits that a fixed daily payment could push into the negative.",
          "Owners already carrying several stacked advances, where another remittance would strain every deposit.",
          "A long, slow, low-margin project where a longer-term, lower-payment product is a better match.",
          "Anyone who has not seen the factor rate, the holdback, and the repayment method in writing.",
        ],
      },
      {
        type: "p",
        text: "An advance is one tool, not the only one. If a predictable monthly payment suits your use better, compare the two honestly in [merchant cash advance vs business loan](/resources/mca-vs-business-loan) before you decide.",
      },
      { type: "h2", text: "A worked example, so the numbers are real" },
      {
        type: "p",
        text: "Say a business is advanced $50,000 at a factor rate of 1.25. Multiply the two: 50,000 times 1.25 is 62,500. The business receives $50,000 and remits $62,500 in total, so the cost of the capital is the $12,500 difference. If the holdback collects a fixed weekly amount, that pace is set up front too. These figures are illustrative, not an offer.",
      },
      {
        type: "p",
        text: "Notice what the example does not say. It does not promise a payment that shrinks on a slow week, because most advances do not do that. And it does not assume early payoff cuts the cost, because on most advances the $62,500 is owed in full whether it takes four months or eight. Confirm both points in writing with any funder.",
      },
      { type: "h2", text: "Three myths worth clearing up" },
      {
        type: "p",
        text: "A lot of confusion around advances comes from a handful of half-truths that get repeated until they sound like rules.",
      },
      {
        type: "p",
        text: "First, that an advance always flexes with a slow week. It does not. Only a true card-split does that, and most modern advances use a fixed daily or weekly ACH instead. Second, that the factor rate is just an APR in disguise, so you can compare it head to head with a loan rate. You cannot, because a factor rate is not an APR and the real annualized cost depends on how fast it is repaid. Third, that paying early always saves you money. On most advances it does not, because the total is fixed up front.",
      },
      {
        type: "p",
        text: "None of these make an advance good or bad on its own. They just mean you should read the actual terms rather than the reputation.",
      },
      { type: "h2", text: "What stacking does to your file" },
      {
        type: "p",
        text: "Stacking is taking a new advance while one or more are still being repaid. Each one carries its own daily or weekly remittance, so two or three together can split a deposit before it covers payroll or rent. It is one of the most common reasons a file becomes hard to place, because underwriting can see those competing remittances in the bank statements.",
      },
      {
        type: "p",
        text: "If you already have an advance running, that does not end the conversation, but be honest about it in the review. A specialist can see whether the timing works or whether refinancing the existing balance makes more sense than adding to it.",
      },
      { type: "h2", text: "What you need to get reviewed" },
      {
        type: "p",
        text: "Getting started is light. A short prequalification comes first, and if the basics line up, recent business bank statements, usually three to four months, help move the file forward. A specialist reviews the file rather than an instant algorithm.",
      },
      {
        type: "callout",
        title: "When you are ready",
        text: "A specialist can review your file and tell you whether an advance, or a different option, fits your cash flow. You may qualify; approval depends on underwriting, and there is no obligation to accept an offer.",
      },
    ],
    faqs: [
      {
        question: "Is a merchant cash advance a loan?",
        answer:
          "No. It is the purchase of a portion of your future revenue at a discount. Because it is a purchase rather than a loan, the cost is quoted as a factor rate instead of an interest rate, and a factor rate is not an APR.",
      },
      {
        question: "Will my payment go down on a slow week?",
        answer:
          "It depends on the structure. Most modern advances repay through a fixed daily or weekly ACH that does not change on a slow week. Only a true card-split, where the funder takes a percentage of card sales, collects less when sales are slow.",
      },
      {
        question: "If I pay it off early, do I save money?",
        answer:
          "Usually not. With most advances the total payback is fixed when you accept, so paying faster does not normally reduce what you owe. Confirm this with the funder in writing before you sign.",
      },
      {
        question: "Do I need great credit to qualify?",
        answer:
          "A revenue-first review weighs your deposits and bank activity, not credit alone. Credit is considered but it is one factor among several. You may qualify; approval depends on underwriting.",
      },
      {
        question: "How do I know what it really costs?",
        answer:
          "Multiply the amount advanced by the factor rate to get the full payback, then weigh that against your revenue and the repayment pace set by the holdback. Our guide on factor rates vs APR shows the math with a worked example.",
      },
    ],
  },
  {
    slug: "business-funding-by-industry",
    kind: "pillar",
    title: "Business Funding by Industry",
    seoTitle: "Business Funding by Industry: Find Your Trade",
    seoDescription:
      "Funding reviewed on how your trade actually gets paid. Find the page built for restaurants, trucking, construction, retail, and more.",
    excerpt:
      "Every trade gets paid differently. Find the funding page built for how your business actually moves money.",
    category: "By Industry",
    primaryKeyword: "business funding by industry",
    moneyPagePath: "/",
    related: [
      "working-capital-guide",
      "merchant-cash-advance-explained",
      "minimum-revenue-to-qualify",
      "documents-needed-for-funding",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "A diner, a freight carrier, and a dental practice all hit cash-flow gaps, but they hit them in completely different ways. Card batches settle Monday. Brokers pay net-45. Insurers reimburse in 60 days. A review that understands your trade reads the right signals instead of penalizing the way your industry normally moves money.",
      },
      {
        type: "p",
        text: "Each page below is built for how that trade actually gets paid. Find yours, or start from the [plain-English working capital guide](/resources/working-capital-guide) if you want the big picture first.",
      },
      { type: "h2", text: "Find your trade" },
      { type: "h3", text: "Restaurants and food service" },
      {
        type: "p",
        text: "Daily card batches, vendor COD, and seasonal swings are normal here, not red flags. See [restaurant business funding](/restaurant-business-funding).",
      },
      { type: "h3", text: "Trucking and freight" },
      {
        type: "p",
        text: "Owner-operators and fleets reviewed on settlements and deposits, with factoring read as normal revenue. See [trucking business funding](/trucking-business-funding).",
      },
      { type: "h3", text: "Construction and contractors" },
      {
        type: "p",
        text: "Draw-based, lumpy cash flow is expected; the review reads deposits across jobs, not one billing cycle. See [construction contractor funding](/construction-business-funding).",
      },
      { type: "h3", text: "E-commerce and online sellers" },
      {
        type: "p",
        text: "Processor and marketplace volume counts, and peak-season inventory buys are normal. See [e-commerce inventory funding](/ecommerce-inventory-funding).",
      },
      { type: "h3", text: "Auto repair shops" },
      {
        type: "p",
        text: "Ticket-based deposits and the parts COD cycle are read in context, for one bay or six. See [auto repair shop funding](/auto-repair-shop-funding).",
      },
      { type: "h3", text: "Medical practices" },
      {
        type: "p",
        text: "Reviewed on collections with insurance reimbursement lag built in, solo practice or group. See [medical practice funding](/medical-practice-funding).",
      },
      { type: "h3", text: "Dental practices" },
      {
        type: "p",
        text: "Production fills the chair months before collections land, and the review accounts for that. See [dental practice funding](/dental-practice-funding).",
      },
      { type: "h3", text: "Beauty salons and med spas" },
      {
        type: "p",
        text: "Chair, booth, and service-based revenue reviewed on deposits and bank activity. See [beauty salon and med spa funding](/beauty-salon-med-spa-funding).",
      },
      { type: "h3", text: "Retail stores" },
      {
        type: "p",
        text: "Storefront and seasonal sales read in context, with inventory buys treated as normal. See [retail store funding](/retail-store-funding).",
      },
      { type: "h3", text: "HVAC, plumbing, and the trades" },
      {
        type: "p",
        text: "Seasonal demand and materials-before-payment are expected for service trades. See [HVAC and plumbing business funding](/hvac-plumbing-business-funding).",
      },
      { type: "h3", text: "Cleaning and janitorial" },
      {
        type: "p",
        text: "Recurring contracts and payroll-heavy cash flow reviewed on deposits across clients. See [cleaning business funding](/cleaning-business-funding).",
      },
      { type: "h3", text: "Funding with bad credit" },
      {
        type: "p",
        text: "If credit is the worry, a revenue-first review weighs deposits and bank activity first. See [bad credit business funding](/bad-credit-business-funding).",
      },
      {
        type: "callout",
        title: "Do not see your exact trade?",
        text: "The review is built on revenue and bank activity, so plenty of businesses outside this list still fit. A specialist can review your file when you are ready. You may qualify; approval depends on underwriting.",
      },
    ],
    faqs: [
      {
        question: "Why does the industry matter for funding?",
        answer:
          "Because each trade gets paid on a different clock. A review that understands card batches, settlements, draws, or reimbursement lag reads your deposits the right way instead of mistaking a normal pattern for a problem.",
      },
      {
        question: "My business is not on the list. Can I still get reviewed?",
        answer:
          "Yes. The review is based on your revenue and bank activity rather than your category, so many businesses outside the listed trades still fit. A specialist can review your file. Approval depends on underwriting.",
      },
      {
        question: "Does seasonality count against me?",
        answer:
          "Not on its own. Seasonal swings are expected in many trades, and underwriting looks at your deposit pattern across months rather than a single slow week.",
      },
    ],
  },
  {
    slug: "business-funding-bad-credit-guide",
    kind: "pillar",
    title: "Getting Funded With Bad Credit: A Revenue-First Guide",
    seoTitle: "Business Funding With Bad Credit: Honest Guide",
    seoDescription:
      "How a revenue-first review weighs deposits and bank activity over your score, what still matters with bad credit, and how to strengthen a file.",
    excerpt:
      "Bad credit does not end the conversation. Here is how a revenue-first review works and what you can do to strengthen your file.",
    category: "Credit & Qualifying",
    primaryKeyword: "business funding bad credit",
    moneyPagePath: "/bad-credit-business-funding",
    related: [
      "what-lenders-read-bank-statements",
      "minimum-revenue-to-qualify",
      "will-applying-hurt-credit-score",
      "merchant-cash-advance-explained",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "A rough credit score feels like a closed door. For a lot of small-business funding, it is not. A revenue-first review starts with how your business actually performs, your deposits and your bank activity, and treats credit as one factor rather than the whole decision.",
      },
      {
        type: "p",
        text: "That does not mean credit is ignored, and it does not mean approval is guaranteed. It means the conversation is different. This guide is general education, not financial, legal, or tax advice, and any figure here is illustrative.",
      },
      { type: "h2", text: "Why revenue can outweigh your score" },
      {
        type: "p",
        text: "A credit score looks backward at how you have handled debt. Your bank statements show something more current: whether the business is bringing in money right now and whether it can support a new payment. For an advance built on future revenue, that present-tense picture often tells underwriting more than a number from your past.",
      },
      {
        type: "p",
        text: "So a business with a bruised score but steady deposits and few negative days can still be reviewable, while a clean score on top of thin, erratic deposits can be harder to place. The [bad credit business funding page](/bad-credit-business-funding) is built around exactly this revenue-first read.",
      },
      { type: "h2", text: "What underwriting still looks at" },
      {
        type: "p",
        text: "Credit being one factor does not make the rest disappear. A revenue-first file is usually strongest when these line up.",
      },
      {
        type: "ul",
        items: [
          "Steady monthly deposits that show the business can carry a new payment.",
          "Mostly positive balances, without frequent NSFs or negative-balance days.",
          "Some operating history, since more time in business strengthens the review.",
          "Few or manageable existing advances, rather than several stacked together.",
          "A clear, productive use of funds.",
        ],
      },
      {
        type: "p",
        text: "Want to know what a reviewer actually reads in your account? See [what lenders read in your bank statements](/resources/what-lenders-read-bank-statements).",
      },
      { type: "h2", text: "How to strengthen your file" },
      {
        type: "p",
        text: "You cannot rewrite your score overnight, but you can make the rest of the file easier to say yes to.",
      },
      {
        type: "ol",
        items: [
          "Keep deposits in your business account so your real revenue shows up, instead of running sales through personal accounts.",
          "Cut down NSFs and negative days in the weeks before you apply; a clean recent run helps.",
          "Avoid stacking another advance on top of existing ones right before a review.",
          "Have three to four months of business bank statements ready so the file can move without delay.",
          "Be clear about what the money is for, since a productive use of funds strengthens the picture.",
        ],
      },
      {
        type: "callout",
        title: "An honest note",
        text: "A revenue-first review widens the door; it does not guarantee a yes. Approval depends on underwriting, and any payment has to fit your cash flow. Anyone promising a guaranteed or instant approval regardless of your file is not being straight with you.",
      },
      { type: "h2", text: "Will checking hurt my credit?" },
      {
        type: "p",
        text: "Starting a prequalification does not trigger a hard credit check. A revenue-first review leans on business revenue and bank activity, and credit is considered without being the only factor. For the details, see [will applying hurt your credit score](/resources/will-applying-hurt-credit-score).",
      },
      { type: "h2", text: "How much revenue you usually need" },
      {
        type: "p",
        text: "Steady deposits matter more than any single threshold, but there are general patterns worth knowing before you apply. The guide on [the minimum revenue to qualify](/resources/minimum-revenue-to-qualify) walks through what reviewers typically want to see.",
      },
      {
        type: "callout",
        title: "When you are ready",
        text: "A specialist can review your file on a revenue-first basis and tell you what is realistic. You may qualify; approval depends on underwriting, and there is no obligation to accept an offer.",
      },
    ],
    faqs: [
      {
        question: "Can I get business funding with bad credit?",
        answer:
          "Often, yes. A revenue-first review weighs your deposits and bank activity first and treats credit as one factor. A bruised score with steady revenue can still be reviewable. You may qualify; approval depends on underwriting.",
      },
      {
        question: "Is there a minimum credit score?",
        answer:
          "There is no single cutoff for a revenue-first review, because the decision leans on business revenue and bank activity rather than the score alone. Credit is still considered as part of the overall file.",
      },
      {
        question: "Will applying lower my score?",
        answer:
          "Starting a prequalification does not trigger a hard credit check. A later step in a full underwriting process might, and a specialist will tell you before anything like that happens.",
      },
      {
        question: "What helps most when my credit is weak?",
        answer:
          "Strong, steady deposits, few NSFs or negative days, some operating history, and not stacking new advances right before a review. Having recent bank statements ready also helps the file move.",
      },
    ],
  },
  {
    slug: "factor-rate-vs-apr",
    kind: "article",
    title: "Factor Rates vs APR: What an MCA Actually Costs",
    seoTitle: "Factor Rate vs APR: What an MCA Costs",
    seoDescription:
      "A worked example of factor rate vs APR. A 1.25 factor on $50,000 means $62,500 back. Why it is not an APR and early payoff rarely helps.",
    excerpt:
      "A factor rate is not an APR. Here is the worked math on what an advance actually costs, with a clear example.",
    category: "Costs & Terms",
    primaryKeyword: "factor rate vs apr",
    moneyPagePath: "/",
    related: [
      "merchant-cash-advance-explained",
      "mca-vs-business-loan",
      "working-capital-guide",
      "documents-needed-for-funding",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "If you are comparing a merchant cash advance to a loan, the single most important thing to understand is the price tag. They are quoted in different languages. A loan uses an APR. An advance uses a factor rate. Read one as if it were the other and you will misjudge the cost. This is general education, not financial, legal, or tax advice.",
      },
      { type: "h2", text: "What a factor rate is" },
      {
        type: "p",
        text: "A factor rate is a single multiplier, usually somewhere around 1.1 to 1.5, that sets the total you pay back. You take the amount advanced and multiply it by the factor rate. That product is your full payback. There is no separate running interest calculation; the total is fixed when you accept.",
      },
      { type: "h2", text: "The worked example" },
      {
        type: "p",
        text: "Say a business is advanced $50,000 at a factor rate of 1.25. The math is simple: 50,000 multiplied by 1.25 equals 62,500. So the business receives $50,000 and pays back $62,500 in total. The cost of the capital is the $12,500 difference. These figures are illustrative, not an offer.",
      },
      {
        type: "callout",
        title: "The core math",
        text: "Amount advanced times factor rate equals total payback. $50,000 times 1.25 equals $62,500 back. The $12,500 difference is the cost of the capital.",
      },
      { type: "h2", text: "Why this is not an APR" },
      {
        type: "p",
        text: "An APR expresses cost as an annualized percentage rate over time, and it assumes interest accrues across a term. A factor rate does neither. It is a flat multiplier with no time dimension built into the number itself. A factor rate is not an APR, and converting between them is not as simple as it looks, because the real annualized cost of an advance depends heavily on how fast it is repaid.",
      },
      {
        type: "p",
        text: "That last point matters. Because the dollar cost is fixed but the repayment speed can vary, the same factor rate can imply very different effective annualized costs. This is one reason an advance and a loan are genuinely hard to compare on a single number. The honest comparison lives in [merchant cash advance vs business loan](/resources/mca-vs-business-loan).",
      },
      { type: "h2", text: "Early payoff usually does not save you" },
      {
        type: "p",
        text: "Here is the trap that surprises owners. With a typical interest-rate loan, paying early reduces the interest you owe. With most advances, the payback total is fixed when you sign. In the example above, that $62,500 is generally owed in full whether it takes you eight months or four to remit it. Paying faster frees up your cash flow sooner, but it does not normally reduce the total.",
      },
      {
        type: "p",
        text: "Some funders offer a prepayment discount, and some do not. Do not assume one exists. Ask, in writing, whether early payoff reduces the total before you accept. If it does, get the exact terms.",
      },
      { type: "h2", text: "Two numbers to weigh, not one" },
      {
        type: "p",
        text: "The factor rate sets the total cost. The holdback, the share of deposits remitted toward the balance, sets the pace and therefore the size of each payment. A reasonable total cost with a payment your slow weeks cannot carry is still a problem. Weigh both against how your business actually gets paid. For how repayment behaves day to day, see [the merchant cash advance explained](/resources/merchant-cash-advance-explained).",
      },
      { type: "h2", text: "Questions to ask before you sign" },
      {
        type: "ul",
        items: [
          "What is the factor rate, and what is the total dollar payback in plain numbers?",
          "Is repayment a fixed daily or weekly ACH, or a true card-split?",
          "What is the holdback or daily/weekly payment amount?",
          "Does paying early reduce the total, and if so, exactly how much?",
          "Are there any fees on top of the factor rate?",
        ],
      },
      {
        type: "callout",
        title: "When you are ready",
        text: "A specialist can walk you through the numbers on your own file in plain terms. You may qualify; approval depends on underwriting, and there is no obligation to accept an offer.",
      },
    ],
    faqs: [
      {
        question: "How do I calculate the cost of an MCA?",
        answer:
          "Multiply the amount advanced by the factor rate to get the total payback. For example, $50,000 at a 1.25 factor rate is $62,500 back, so the cost of the capital is the $12,500 difference. These figures are illustrative.",
      },
      {
        question: "Is a factor rate the same as an APR?",
        answer:
          "No. A factor rate is a flat multiplier that sets a fixed total payback. An APR is an annualized percentage that assumes interest accrues over time. A factor rate is not an APR, and the two are not directly interchangeable.",
      },
      {
        question: "If I pay off the advance early, do I pay less?",
        answer:
          "Usually not. With most advances the total payback is fixed when you sign, so early payoff frees your cash flow sooner but does not normally reduce the total. Ask the funder in writing whether a prepayment discount applies.",
      },
      {
        question: "Why is the effective annualized cost hard to pin down?",
        answer:
          "Because the dollar cost is fixed while repayment speed can vary, the same factor rate can translate into very different annualized costs depending on how fast it is repaid. That is part of why advances and loans are hard to compare on one number.",
      },
    ],
  },
  {
    slug: "mca-vs-business-loan",
    kind: "article",
    title: "Merchant Cash Advance vs Business Loan: An Honest Comparison",
    seoTitle: "MCA vs Business Loan: An Honest Comparison",
    seoDescription:
      "How a merchant cash advance and a business loan really differ on cost, repayment, speed, and qualifying, and which fits which situation.",
    excerpt:
      "Advance or loan? An honest side-by-side on cost, repayment, speed, and qualifying, and how to tell which fits your situation.",
    category: "Costs & Terms",
    primaryKeyword: "merchant cash advance vs business loan",
    moneyPagePath: "/",
    related: [
      "merchant-cash-advance-explained",
      "factor-rate-vs-apr",
      "working-capital-guide",
      "minimum-revenue-to-qualify",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "An advance and a loan can both put cash in your account, but they are built differently, priced differently, and repaid differently. The right one depends on what the money is for and how your business gets paid. Here is the honest comparison, without picking a winner for you. This is general education, not financial, legal, or tax advice.",
      },
      { type: "h2", text: "How each one is structured" },
      {
        type: "p",
        text: "A business loan is a loan: a fixed amount you borrow and repay over a set term, usually in predictable monthly payments, with the cost expressed as an interest rate or APR. A merchant cash advance is not a loan. It is the purchase of a slice of your future revenue at a discount, with the cost expressed as a factor rate. For the full breakdown of the advance side, see [the merchant cash advance explained](/resources/merchant-cash-advance-explained).",
      },
      { type: "h2", text: "Cost: APR vs factor rate" },
      {
        type: "p",
        text: "A loan quotes an APR, an annualized rate where paying early typically saves you interest. An advance quotes a factor rate, a flat multiplier that fixes the total payback up front. A factor rate is not an APR, so you cannot compare the two by eyeballing the numbers. The worked math lives in [factor rates vs APR and what an MCA actually costs](/resources/factor-rate-vs-apr).",
      },
      { type: "h2", text: "Repayment: monthly vs daily or weekly" },
      {
        type: "p",
        text: "A term loan is usually repaid in fixed monthly installments. Most modern advances are repaid through a fixed daily or weekly ACH that does not shrink on a slow week. Only a true card-split, where the funder takes a percentage of card sales, collects less when sales dip. That difference in rhythm matters as much as the cost: a daily payment lands very differently on cash flow than a once-a-month one.",
      },
      { type: "h2", text: "Speed and paperwork" },
      {
        type: "p",
        text: "Loans, especially from a bank, tend to ask for more documentation and take longer to underwrite. A revenue-first advance review is typically lighter, often a prequalification plus a few months of business bank statements. Speed should not be the only reason to choose, but it is a real difference, particularly for a time-sensitive gap.",
      },
      { type: "h2", text: "Qualifying" },
      {
        type: "p",
        text: "Bank loans often lean hard on credit, time in business, and financial statements. A revenue-first advance review weighs your deposits and bank activity first, with credit as one factor among several. If credit is your sticking point, the [revenue-first guide to funding with bad credit](/resources/business-funding-bad-credit-guide) explains what still matters most.",
      },
      { type: "h2", text: "A quick side-by-side" },
      {
        type: "ul",
        items: [
          "Cost basis: loan uses an APR; advance uses a factor rate, which is not an APR.",
          "Early payoff: a loan usually rewards it; most advances fix the total up front, so it usually does not reduce what you owe.",
          "Repayment: loan is typically monthly; most advances debit a fixed daily or weekly ACH, with only true card-split flexing on slow sales.",
          "Speed: loans often slower and document-heavy; advance reviews are typically lighter and faster.",
          "Qualifying: loans lean on credit and statements; advances lead with revenue and bank activity.",
        ],
      },
      { type: "h2", text: "Which fits which situation" },
      {
        type: "p",
        text: "A loan tends to fit a defined, one-time use with a longer horizon, where a predictable monthly payment and a lower cost of capital matter more than speed, and where your credit and paperwork are strong. An advance tends to fit a time-sensitive working-capital gap, a business reviewed better on revenue than on credit, or an owner who needs a lighter, faster process and can carry the repayment pace.",
      },
      {
        type: "callout",
        title: "There is no universal best",
        text: "The better option is the one your cash flow can actually carry for the use you have in mind. A cheaper-looking number with a payment your slow weeks cannot absorb is not cheaper in practice.",
      },
      {
        type: "p",
        text: "If you are still mapping out the bigger picture, the [plain-English working capital guide](/resources/working-capital-guide) lays out every option side by side.",
      },
      {
        type: "callout",
        title: "When you are ready",
        text: "A specialist can review your file and walk through which option fits your situation in plain terms. You may qualify; approval depends on underwriting, and there is no obligation to accept an offer.",
      },
    ],
    faqs: [
      {
        question: "What is the main difference between an MCA and a business loan?",
        answer:
          "A loan is borrowed money repaid over a term with an interest rate or APR. A merchant cash advance is the purchase of future revenue at a discount, priced with a factor rate. A factor rate is not an APR, so the two are not directly comparable on the number alone.",
      },
      {
        question: "Which is cheaper, a loan or an advance?",
        answer:
          "It depends on the terms, your use, and how fast the advance is repaid. A loan often carries a lower cost of capital, but the better choice is the one your cash flow can carry for the use you have in mind, not just the lower-looking number.",
      },
      {
        question: "Which is faster to get?",
        answer:
          "A revenue-first advance review is typically lighter and faster than a traditional loan, often a prequalification plus a few months of bank statements. Approval still depends on underwriting in either case.",
      },
      {
        question: "I have bad credit. Which is more realistic?",
        answer:
          "A revenue-first advance review leads with your deposits and bank activity rather than credit alone, so it can be more reachable when credit is weak. Approval still depends on underwriting, and any payment must fit your cash flow.",
      },
    ],
  },
];
