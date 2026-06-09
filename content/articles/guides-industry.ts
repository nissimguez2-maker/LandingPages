import type { ResourceArticle } from "@/lib/types";

/**
 * Educational guides for FundVella's /resources hub.
 *
 * These are reader-first articles, not product docs. They explain how working
 * capital fits real cash-flow problems in plain English, link to the relevant
 * money page, and keep to FundVella's compliance voice: FundVella is not a
 * lender, you may qualify (approval depends on underwriting), a factor rate is
 * not an APR, and any dollar figures are illustrative, not an offer. Nothing
 * here is financial, legal, or tax advice.
 */
export const guidesIndustry: ResourceArticle[] = [
  {
    slug: "will-applying-hurt-credit-score",
    kind: "article",
    title: "Will Applying for Funding Hurt Your Credit Score?",
    seoTitle: "Does Applying for Business Funding Hurt Credit?",
    seoDescription:
      "Starting a prequalification does not trigger a hard pull. Learn when a soft or hard credit check happens in business funding and how to protect your score.",
    excerpt:
      "Starting a prequalification does not ding your credit. Here is when a soft pull happens, when a hard pull can happen, and how to keep control of the timing.",
    category: "Credit & Qualifying",
    primaryKeyword: "does applying for business funding hurt credit",
    moneyPagePath: "/",
    related: [
      "business-funding-bad-credit-guide",
      "what-lenders-read-bank-statements",
      "documents-needed-for-funding",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "It is the question almost every owner asks before they fill out anything: will checking this hurt my credit score? The honest answer is that it depends on what stage you are at. Starting a prequalification is not the same as a full application, and a full application is not the same as accepting an offer. Each step is treated differently.",
      },
      {
        type: "p",
        text: "Here is what actually happens, in plain English, so you can decide how far to go and when.",
      },
      { type: "h2", text: "Soft pull vs hard pull: the difference that matters" },
      {
        type: "p",
        text: "There are two kinds of credit check, and only one of them moves your score.",
      },
      {
        type: "ul",
        items: [
          "A soft pull (sometimes called a soft inquiry) lets a funder take a light look at your credit. It does not affect your score, and other lenders do not see it as an inquiry. You also see soft pulls when you check your own credit or get a preapproved card offer in the mail.",
          "A hard pull (a hard inquiry) is a fuller look that a funder runs when you are seriously moving forward. A hard inquiry can lower your score by a small amount and stays on your report for about two years, though its effect fades quickly.",
        ],
      },
      {
        type: "p",
        text: "The whole point of understanding the difference is timing. A single soft pull early on costs you nothing. A hard pull is something you should know is coming before it happens.",
      },
      { type: "h2", text: "What happens at each stage" },
      {
        type: "p",
        text: "Walking through the steps is the clearest way to see where your credit is and is not touched.",
      },
      { type: "h3", text: "Stage 1: Prequalification" },
      {
        type: "p",
        text: "When you start a prequalification with FundVella, you answer a few questions about your business: roughly how much you deposit each month, how long you have been operating, and what you need the capital for. Starting a prequalification does not trigger a hard credit pull. It is a low-friction way to see whether your file looks viable before anyone runs anything.",
      },
      { type: "h3", text: "Stage 2: Application and review" },
      {
        type: "p",
        text: "If the file looks viable and you decide to move forward, a funder reviews it more closely. At this point a funder may run a soft pull to get a fuller picture alongside your bank activity. Because revenue-based funding leans heavily on your deposits and bank statements, your credit score is usually one input among several, not the deciding factor. You can read more about that in [what lenders read on your bank statements](/what-lenders-read-bank-statements).",
      },
      { type: "h3", text: "Stage 3: Offer and funding" },
      {
        type: "p",
        text: "A hard pull can happen later, typically at the offer or funding stage, when a funder is finalizing terms and you are close to accepting. This is the step where your authorization is required, so it should never be a surprise. If timing matters to you, ask the specialist when a hard inquiry would occur so you can plan around it.",
      },
      {
        type: "callout",
        title: "Be careful with absolutes",
        text: "Avoid any source that promises no credit check at all, or guarantees your credit will never be touched. Funders differ, and a hard pull is a normal part of finalizing many funding offers. What you can count on is that starting a prequalification does not trigger one.",
      },
      { type: "h2", text: "How to keep control of your credit" },
      {
        type: "ol",
        items: [
          "Prequalify first. It does not trigger a hard pull, and it tells you whether moving forward is even worth it.",
          "Ask each funder, before you authorize anything, when a soft pull and a hard pull would happen.",
          "If you are comparing options, try to keep any hard inquiries inside a short window. Scoring models often treat multiple similar inquiries in a tight period as a single shopping event.",
          "Have your recent business bank statements ready. Strong, steady deposits give a funder more to work with and put less weight on your score. See [the documents you may need](/documents-needed-for-funding).",
        ],
      },
      {
        type: "p",
        text: "If your credit is not where you want it to be, that is not the end of the conversation. Revenue-based funding is often reviewed on your business deposits and bank activity first. There is more on that in our [business funding with bad credit guide](/business-funding-bad-credit-guide).",
      },
      {
        type: "p",
        text: "You may qualify based on your revenue and bank activity, and approval depends on underwriting. Starting is free and does not obligate you to accept anything.",
      },
    ],
    faqs: [
      {
        question: "Does starting a prequalification hurt my credit score?",
        answer:
          "No. Starting a prequalification does not trigger a hard credit pull. It is a low-friction check to see whether your file looks viable before anyone reviews it further.",
      },
      {
        question: "When would a funder run a hard credit check?",
        answer:
          "A hard pull can happen later, usually at the offer or funding stage when terms are being finalized and you are close to accepting. Your authorization is required, so it should not be a surprise.",
      },
      {
        question: "Will a soft pull show up to other lenders?",
        answer:
          "No. A soft pull does not affect your score and is not visible as an inquiry to other lenders. Only hard inquiries appear on the report other lenders can see.",
      },
      {
        question: "Can I get funding if my credit is not great?",
        answer:
          "You may qualify. Revenue-based funding is often reviewed mainly on business revenue and bank activity, with credit considered but not the only factor. Approval depends on underwriting.",
      },
      {
        question: "Does comparing several funders mean several hits to my credit?",
        answer:
          "Not necessarily. Scoring models often treat multiple similar inquiries within a short window as a single shopping event. Keeping any hard pulls inside a tight period can limit the impact.",
      },
    ],
  },
  {
    slug: "restaurant-slow-season-funding",
    kind: "article",
    title: "How Restaurants Cover a Slow Season Without a Bank Loan",
    seoTitle: "Restaurant Working Capital for a Slow Season",
    seoDescription:
      "January is slow but payroll is not. See how restaurants use working capital reviewed on card-batch deposits to cover a slow season without a bank loan.",
    excerpt:
      "January is slow, but payroll, rent, and COD produce are not. Here is how restaurants bridge a predictable slow season using their card-batch deposits.",
    category: "By Industry",
    primaryKeyword: "restaurant working capital slow season",
    moneyPagePath: "/restaurant-business-funding",
    related: [
      "working-capital-guide",
      "business-funding-by-industry",
      "what-lenders-read-bank-statements",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "Every restaurant owner knows the rhythm. The summer patio is packed, the holidays bring big parties, and then January arrives. The dining room is quiet, but payroll lands on the same day it always does, rent clears Monday morning, and your best produce vendor still wants cash on delivery. The work slows down. The bills do not.",
      },
      {
        type: "p",
        text: "A traditional bank loan is built for a different kind of business. It rewards years of tax returns, strong personal credit, and collateral, and it can take weeks to hear back, which is not much help when the slow season is already here. This guide walks through how restaurants bridge a predictable slow stretch using working capital that is reviewed on the way they actually get paid.",
      },
      { type: "h2", text: "Why a slow season squeezes restaurants so hard" },
      {
        type: "p",
        text: "Picture a typical Friday. At 7 in the morning the produce truck arrives and your best vendor wants about $1,400 in cash on the spot. By 11 the walk-in cooler quits, and the repair tech can come now but wants roughly $1,800 before the weekend rush. At 2 your line cooks need their checks, busy weekend or not. Then on Monday, the card sales from Friday and Saturday finally hit your bank, the same morning rent clears.",
      },
      {
        type: "p",
        text: "You earned the money over the weekend. It shows up Monday. The bills did not wait that long. Now stretch that gap across a whole slow month, when the weekend covers are thinner, and you can see why owners end up covering the difference out of the register or out of their own pocket.",
      },
      { type: "h2", text: "What working capital actually does here" },
      {
        type: "p",
        text: "Working capital is short-term funding meant to smooth the gap between money going out and money coming in. It is not for buying a building or financing a ten-year project. It is for the COD order, the payroll run, the cooler repair, and the slow stretch you can see coming. If you want the broader picture, start with our [working capital guide](/working-capital-guide).",
      },
      {
        type: "p",
        text: "A common option for food service is a merchant cash advance, which is a purchase of a slice of your future sales rather than a loan. Restaurants tend to fit because their revenue is steady and easy to read: daily card batches plus cash. A funder can size an option on those deposits without needing years of tax returns.",
      },
      {
        type: "callout",
        title: "How repayment really works",
        text: "Most modern advances repay through a fixed daily or weekly ACH, a set amount pulled on a schedule. Only a card-split deal, where remittance is taken as a percentage of each day's card sales, actually flexes down on a slow week. If a slow-season cushion matters, ask the specialist which structure you are looking at so there are no surprises.",
      },
      { type: "h2", text: "How a slow-season bridge tends to play out" },
      {
        type: "p",
        text: "Say a neighborhood taco spot wants to get through January without cutting its trained crew. Here is the kind of path an owner walks.",
      },
      {
        type: "ol",
        items: [
          "Start a quick prequalification. Starting is free and does not trigger a hard credit pull.",
          "Share three to four months of business bank statements so a funder can read the card-batch and cash deposit pattern, including the busy season that came before the slow one.",
          "A specialist reviews the file. Seasonality is expected in food service and read in context, not penalized, so a slow January does not count against you on its own.",
          "If the file is viable, review the available options, including the amount, the structure, and the full payback, before you decide anything.",
        ],
      },
      {
        type: "p",
        text: "As an illustration, an owner might use $30,000 to $100,000 to stock up and cover payroll through the slow months before the busy season returns. Those figures are illustrative, not an offer, and any actual amount depends on underwriting.",
      },
      { type: "h2", text: "Understanding the cost before you say yes" },
      {
        type: "p",
        text: "Funding like this is usually priced as a factor rate, one set price such as 1.2, rather than an interest rate. A factor rate is not an APR. The upside is you know the full payback before you say yes, with no compounding interest to track. The thing to watch is the daily or weekly remittance and whether your slow-season cash flow can carry it comfortably. A clear, productive use of funds, like getting through a known dip, strengthens the file.",
      },
      {
        type: "p",
        text: "Curious how this fits your numbers? You may qualify based on your card-batch deposits and bank activity, and approval depends on underwriting. See [restaurant business funding](/restaurant-business-funding) to start a no-obligation prequalification.",
      },
    ],
    faqs: [
      {
        question: "Does a slow season hurt my chances of qualifying?",
        answer:
          "Not on its own. Underwriting expects seasonal swings in food service and looks at your deposit pattern across months, not a single slow week. A busy summer and a slow January are normal.",
      },
      {
        question: "I run mostly on card sales and tips. Does that count?",
        answer:
          "Yes. Daily card-batch settlements are exactly what a revenue-based review looks at, alongside your business bank activity. Cards and tips are normal in food service.",
      },
      {
        question: "Will the payment flex down on a slow week?",
        answer:
          "Only a card-split structure, where remittance is a share of daily card sales, flexes with volume. Most advances repay through a fixed daily or weekly ACH, so ask the specialist which structure you are reviewing.",
      },
      {
        question: "How is the cost different from a bank loan?",
        answer:
          "Funding like this is usually priced as a factor rate, one set price such as 1.2, not an APR. A factor rate is not an APR. You know the full payback up front, with no compounding interest to track.",
      },
      {
        question: "I only have one small location. Am I too small?",
        answer:
          "No. One small spot is welcome. The review looks at your deposits and bank activity rather than how many locations you run. You may qualify; approval depends on underwriting.",
      },
    ],
  },
  {
    slug: "ecommerce-inventory-funding-q4",
    kind: "article",
    title: "How E-commerce Sellers Fund Inventory Before Q4",
    seoTitle: "E-commerce Inventory Financing Before Q4",
    seoDescription:
      "The Q4 buy is due before the sell-through that pays for it. See how online sellers fund inventory using processor and marketplace volume, not just credit.",
    excerpt:
      "The supplier wants 50% down on an eight-week lead time while your cash is tied up in ad spend. Here is how sellers fund the Q4 buy before the sales catch up.",
    category: "By Industry",
    primaryKeyword: "ecommerce inventory financing",
    moneyPagePath: "/ecommerce-inventory-funding",
    related: [
      "working-capital-guide",
      "merchant-cash-advance-explained",
      "minimum-revenue-to-qualify",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "If you sell online, you know the timing never lines up. Q4 is coming, your supplier wants 50% down on an eight-week lead time, and your cash is tied up in last month's ad spend. The buy that fuels your biggest quarter is due now. The sell-through that pays for it is months away.",
      },
      {
        type: "p",
        text: "That gap is the whole problem for e-commerce. The business can be healthy and growing and still be cash-tight, because the money is always one step behind the growth. This guide explains how online sellers fund inventory ahead of peak season and what a funder actually looks at.",
      },
      { type: "h2", text: "Why online sellers run cash-tight before peak" },
      {
        type: "p",
        text: "Map out the calendar of a single inventory cycle. In week one, the supplier wants 50% down to start production. From weeks two through nine, the goods are made and shipped while your cash sits committed the entire time. On launch day the orders come in, but the cash from them lands a few days later as the processor settles. And all month, ad spend climbs before the orders catch up.",
      },
      {
        type: "p",
        text: "Now layer Q4 on top, when you want to buy more, spend more on proven campaigns, and carry deeper stock on your best SKUs. The buy is bigger, the lead time is the same, and the cash crunch arrives right when the opportunity is largest. Stock out at the wrong moment and you hand sold-out sales to a competitor.",
      },
      { type: "h2", text: "What lenders look at for an online store" },
      {
        type: "p",
        text: "A bank tends to anchor on tax returns and personal credit. A revenue-based review is built differently and reads how an online store actually earns. For e-commerce, that usually means a few things together.",
      },
      {
        type: "ul",
        items: [
          "Processor and marketplace volume. Your Shopify, Amazon, and card-processor settlements are read as real revenue, alongside your business bank deposits.",
          "Refund and chargeback rate. A healthy dispute rate for your category strengthens the file; an elevated one gets a closer look.",
          "Seasonality. Peak-season ramps are expected and read in context, so a spike before Q4 is a feature of your model, not a red flag.",
          "Time selling and existing obligations. More operating history helps, and how many advances you already run at once affects what is realistic.",
        ],
      },
      {
        type: "p",
        text: "Wondering whether your volume is enough to be reviewed? Our guide on the [minimum revenue to qualify](/minimum-revenue-to-qualify) walks through where most files start.",
      },
      { type: "h2", text: "The funding options sellers use for inventory" },
      {
        type: "p",
        text: "The most common fit is a merchant cash advance, a purchase of a portion of your future sales rather than a loan. It tends to suit online sellers because the deposits are steady and easy to verify, and an option can be sized on your volume without waiting on tax returns. If the term is new to you, our [merchant cash advance explained](/merchant-cash-advance-explained) breaks it down.",
      },
      {
        type: "callout",
        title: "Know how you will repay",
        text: "Most modern advances repay through a fixed daily or weekly ACH, a set amount on a schedule, which means the payment does not shrink just because a single day was slow. Only a card-split deal flexes with volume. Plan the buy around the fixed remittance, not around your best sales day.",
      },
      { type: "h2", text: "A realistic path to a Q4 buy" },
      {
        type: "ol",
        items: [
          "Prequalify early, before the supplier deadline forces a rushed decision. Starting is free and does not trigger a hard credit pull.",
          "Share three to four months of statements so a funder can see processor, marketplace, and bank deposits together.",
          "A specialist reviews the file and sizes options on your volume and bank activity, with peak-season ramps read in context.",
          "If viable, review the amount, the factor rate, and the full payback, then decide whether the math works for your margins.",
        ],
      },
      {
        type: "p",
        text: "As an illustration, a seller might use $30,000 to $150,000 for a peak-season inventory buy before Q4, or scale ad spend while the return on ad spend still works. Those figures are illustrative, not an offer, and any amount depends on underwriting.",
      },
      {
        type: "p",
        text: "On cost, this funding is usually priced as a factor rate, one set price such as 1.2, not an interest rate. A factor rate is not an APR. You know the full payback before you commit, which makes it easier to check the buy against your unit economics. You may qualify based on your processor and bank deposits; see [e-commerce inventory funding](/ecommerce-inventory-funding) to start.",
      },
    ],
    faqs: [
      {
        question: "Do you look at my Shopify, Amazon, or processor volume?",
        answer:
          "Yes. For online sellers, card-processor and marketplace deposit volume are part of the review, along with your business bank activity. Your settlements are read as real revenue.",
      },
      {
        question: "Can I fund inventory ahead of a launch or peak season?",
        answer:
          "That is one of the most common uses. Underwriting sizes options on your volume and bank activity, and pre-buying for a launch or Q4 is normal in e-commerce. Amounts depend on underwriting.",
      },
      {
        question: "My sales spike then dip. Is that a problem?",
        answer:
          "No. Spiky, seasonal volume is normal online, and peak-season ramps are expected. The review looks at your deposits over time rather than at a single spike or dip.",
      },
      {
        question: "Will the payment go down when sales slow after the peak?",
        answer:
          "Only a card-split structure flexes with daily volume. Most advances repay through a fixed daily or weekly ACH, so plan the buy around the fixed remittance and ask the specialist which structure applies.",
      },
      {
        question: "How is the cost expressed?",
        answer:
          "Usually as a factor rate, one set price such as 1.2, rather than an interest rate. A factor rate is not an APR. You know the full payback up front, which helps you check the buy against your margins.",
      },
    ],
  },
  {
    slug: "trucking-cash-flow-between-settlements",
    kind: "article",
    title: "How Owner-Operators Cover Fuel and Repairs Between Settlements",
    seoTitle: "Owner-Operator Truck Repair Funding Guide",
    seoDescription:
      "Factoring took its cut and the broker pays net-45, but a down truck cannot wait. See how owner-operators cover fuel and repairs between settlements.",
    excerpt:
      "Factoring took its cut, the broker pays net-45, and the truck is down for a turbo. Here is how owner-operators cover fuel and repairs between settlements.",
    category: "By Industry",
    primaryKeyword: "owner operator truck repair funding",
    moneyPagePath: "/trucking-business-funding",
    related: [
      "working-capital-guide",
      "factor-rate-vs-apr",
      "business-funding-bad-credit-guide",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "As an owner-operator, you are rarely short on work. You are short on the gap between doing the work and getting paid for it. The load is booked, but factoring already took its cut, the broker pays net-45, and the diesel pump and the truck payment do not care that the money is on the way.",
      },
      {
        type: "p",
        text: "Then a warning light comes on. A blown turbo or a DOT repair grounds the truck, and every day it sits in a shop bay is a day your only earning asset is parked. This guide walks through how owner-operators bridge that gap and keep rolling between settlements.",
      },
      { type: "h2", text: "The gap between the load and the money" },
      {
        type: "p",
        text: "Walk through a single day. At 5 in the morning you fuel up before the run, and that is roughly $600 to $1,000 gone before the wheels turn. Mid-morning the broker confirms the load, which is good news, except they pay in 45 days. At noon factoring sends last week's money, already minus their cut, so it is less than the load paid. At 2 the turbo warning lights up and the shop quotes about $4,000 to $8,000, with the part days out. By night the truck sits, earning nothing, while the next load is already booked.",
      },
      {
        type: "p",
        text: "None of that means the business is unhealthy. It means the timing of fixed costs does not match the timing of settlements. That mismatch is exactly what short-term working capital is built to smooth. For the broader picture, see our [working capital guide](/working-capital-guide).",
      },
      { type: "h2", text: "Why a bank loan is the wrong tool here" },
      {
        type: "p",
        text: "A bank wants tax returns, strong personal credit, and time, and the truck needs to be back on the road this week. Revenue-based funding is reviewed differently and is built around how carriers actually get paid.",
      },
      {
        type: "ul",
        items: [
          "Settlement pattern. Broker and factoring settlements and how consistent your deposits are across weeks are the core of the review.",
          "Time and authority. Operating history and time running under your own authority strengthen the file.",
          "Repairs and fuel swings. A big one-off repair week or a heavy fuel week is read in context, not treated as a red flag.",
        ],
      },
      {
        type: "p",
        text: "Two things owners worry about turn out to be non-issues. Factoring deposits are read as normal carrier revenue, not held against you. And files are reviewed mainly on revenue and bank activity, so credit is not the only factor. If credit is your concern, our [bad credit funding guide](/business-funding-bad-credit-guide) goes deeper.",
      },
      { type: "h2", text: "What funding looks like for a carrier" },
      {
        type: "p",
        text: "A common option is a merchant cash advance, a purchase of a portion of your future deposits rather than a loan. It fits owner-operators because settlements are steady enough to read, and an option can be sized on those deposits, factoring included, without waiting on tax returns.",
      },
      {
        type: "callout",
        title: "Match the payment to how you get paid",
        text: "Most modern advances repay through a fixed daily or weekly ACH, a set amount pulled on a schedule. Only a card-split deal flexes with volume, and that structure is uncommon in trucking. Because your settlements are lumpy, ask the specialist to size a remittance that your slower weeks can carry, not just your best ones.",
      },
      { type: "h2", text: "A realistic path back on the road" },
      {
        type: "ol",
        items: [
          "Prequalify the day the truck goes down. Starting is free and does not trigger a hard credit pull.",
          "Share three to four months of statements so a funder can see your settlement and deposit pattern, factoring included.",
          "A specialist reviews the file, reading lumpy weeks and a one-off repair in context rather than as a problem.",
          "If viable, review the amount, the factor rate, and the full payback before you authorize the fix or the fuel.",
        ],
      },
      {
        type: "p",
        text: "As an illustration, an owner might use $25,000 to $60,000 for a major engine or truck repair the day the truck goes down, or $30,000 to $100,000 for fuel, payroll, and a cash cushion across slow-paying weeks. Those figures are illustrative, not an offer, and any amount depends on underwriting.",
      },
      {
        type: "p",
        text: "On cost, this funding is usually priced as a factor rate, one set price such as 1.25, not an interest rate. A factor rate is not an APR, and our [factor rate vs APR](/factor-rate-vs-apr) guide explains why the two are not interchangeable. You may qualify on your settlements and deposits, factoring included; see [trucking business funding](/trucking-business-funding) to start a no-obligation prequalification.",
      },
    ],
    faqs: [
      {
        question: "I am a single owner-operator. Can I still apply?",
        answer:
          "Yes. Owner-operators are reviewed on the same basis as fleets: business revenue, bank activity, and time in business. You may qualify, and approval depends on underwriting.",
      },
      {
        question: "I use a factoring company. Does that count against me?",
        answer:
          "No. Factoring deposits are read as normal carrier revenue. Underwriting looks at your overall deposit pattern, factoring included, rather than treating it as a negative.",
      },
      {
        question: "My settlements are lumpy from week to week. Is that a problem?",
        answer:
          "No. Lumpy weeks are normal for carriers. The review looks at your deposits across months, not a single slow week, and big one-off fuel or repair weeks are read in context.",
      },
      {
        question: "Will the payment shrink during a slow freight week?",
        answer:
          "Most advances repay through a fixed daily or weekly ACH, so the amount stays the same regardless of the week. Card-split structures that flex with volume are uncommon in trucking. Ask the specialist to size a payment your slow weeks can carry.",
      },
      {
        question: "My credit is not great. Can I still be looked at?",
        answer:
          "Yes. Files are reviewed mainly on revenue and bank activity, not credit alone. You may qualify, and approval depends on underwriting.",
      },
    ],
  },
];
