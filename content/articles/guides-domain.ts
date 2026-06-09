import type { ResourceArticle } from "@/lib/types";

/**
 * Domain-accuracy guides for the /resources hub.
 *
 * Voice + compliance (mirrors content/landingPagesConfig.ts):
 *   - Second person, plain English, concrete. No em-dashes.
 *   - FundVella is NOT a lender; it connects owners with funding specialists.
 *   - "You may qualify; approval depends on underwriting." Never guaranteed,
 *     instant, or same-day. No specific APR/rate. A factor rate is NOT an APR.
 *   - Dollar figures are illustrative, not an offer. General education only,
 *     not financial, legal, or tax advice. No fabricated stats or testimonials.
 *
 * Domain note carried through every relevant piece: most modern MCAs repay via
 * a FIXED daily or weekly ACH. Only a true card-split deal automatically flexes
 * with a slow week; a fixed-ACH deal can be adjusted through reconciliation, but
 * it does not move on its own.
 */
export const guidesDomain: ResourceArticle[] = [
  {
    slug: "what-lenders-read-bank-statements",
    kind: "article",
    title: "What Lenders Actually Read in Your Bank Statements",
    seoTitle: "What Lenders Read in Your Bank Statements",
    seoDescription:
      "What underwriting actually looks for in your business bank statements: deposits, average daily balance, NSF days, and existing advance debits.",
    excerpt:
      "Underwriting reads your last few months of bank statements line by line. Here is what they are actually looking at, and why a clean file moves faster.",
    category: "Qualifying",
    primaryKeyword: "what lenders look for in bank statements",
    moneyPagePath: "/",
    related: [
      "minimum-revenue-to-qualify",
      "documents-needed-for-funding",
      "working-capital-guide",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "When you apply for working capital, the single most important document is rarely your credit report. It is your business bank statements. Revenue-based funding is underwritten primarily on how money actually moves through your account, so an underwriter reads those statements the way a mechanic listens to an engine. They are not looking for one number. They are looking at a pattern across months. Knowing what they read lets you put your strongest file forward and avoid surprises.",
      },
      {
        type: "p",
        text: "The standard ask is three to four months of business bank statements, all pages. That window is long enough to show a real pattern and short enough to reflect how your business is running right now. If you want to see how this fits the whole process, the [working capital guide](/) walks through what happens after you share statements.",
      },
      { type: "h2", text: "Average monthly deposits" },
      {
        type: "p",
        text: "This is the headline figure. An underwriter totals the deposits that look like real revenue, card batches, ACH from customers, checks, and cash, and averages them across the months you provided. Transfers between your own accounts, refunds, and one-off loan deposits are usually stripped out, because they are not sales. The cleaner the line between revenue and noise, the easier your deposits are to read.",
      },
      {
        type: "callout",
        title: "Why averages, not your best month",
        text: "Underwriting works off the average so one strong month does not overstate what your business can support, and one slow month does not sink it. A steady pattern almost always reads better than a spiky one at the same total.",
      },
      { type: "h2", text: "Number of deposits per month" },
      {
        type: "p",
        text: "Two businesses can deposit the same dollars and read very differently. A shop with many smaller deposits spread across the month, daily card batches, for example, looks like steady, diversified revenue. A business with the same total arriving in one or two large lumps looks more concentrated and more dependent on a single customer or event. More frequent deposits generally signal more reliable day-to-day cash flow, which is what supports a daily or weekly payment.",
      },
      { type: "h3", text: "Lumpy is not automatically bad" },
      {
        type: "p",
        text: "Some industries are lumpy by nature. Contractors get paid on draws, carriers get paid on settlements, and practices wait on reimbursement. Underwriting that knows your industry reads that timing as normal, not as a red flag. The pattern matters more than the rhythm.",
      },
      { type: "h2", text: "Average daily balance" },
      {
        type: "p",
        text: "Average daily balance is what your account actually held, on average, across the period, not just on statement-close day. It answers a simple question: does this business keep a cushion, or does it run to zero between deposits? A healthy average daily balance tells an underwriter there is room for a payment to clear without pushing the account negative. A balance that lives near zero is a sign the file may need a smaller advance or a gentler payment.",
      },
      { type: "h2", text: "Negative days and NSFs" },
      {
        type: "p",
        text: "An NSF (non-sufficient funds) item or a negative-balance day is when the account did not have enough to cover something that hit it. A few across several months, especially explainable ones, are usually fine. Frequent NSFs or many negative days are one of the biggest things that make a file harder to place, because they suggest a new fixed payment could bounce too. If you have had a rough stretch, a short explanation often helps an underwriter put it in context.",
      },
      {
        type: "ul",
        items: [
          "A few NSFs across three to four months: usually manageable.",
          "Frequent NSFs or many negative days: a closer look, and possibly a smaller offer.",
          "An explainable one-off (a single missed transfer): worth a sentence of context.",
        ],
      },
      { type: "h2", text: "Existing advance and loan debits" },
      {
        type: "p",
        text: "Underwriters are very good at spotting other funding in your statements. Regular fixed daily or weekly ACH debits to a funder are a tell that you already have an advance, and how many show up tells them how many positions you are carrying. This matters for two reasons. First, stacking several advances at once is a common reason a file gets declined. Second, your existing payments reduce how much new payment your deposits can realistically support. Being upfront about current balances helps a specialist size something that actually fits.",
      },
      {
        type: "callout",
        title: "How payments usually come out",
        text: "Most modern advances repay through a fixed daily or weekly ACH, a set amount on a set schedule. Only a true card-split deal automatically takes a smaller cut on a slow week. A fixed-ACH deal can sometimes be adjusted through reconciliation if sales drop, but it does not flex on its own. Knowing which one you have tells you exactly what to expect on a slow week.",
      },
      { type: "h2", text: "How to put your best file forward" },
      {
        type: "ol",
        items: [
          "Send complete statements, all pages, for three to four recent months.",
          "Use your real business account, not a personal one, so deposits read as revenue.",
          "Keep owner transfers and loan proceeds out of the same account where you can, so they do not look like sales.",
          "Be ready to explain any negative days or existing advances in a sentence or two.",
        ],
      },
      {
        type: "p",
        text: "None of this is a scorecard you can game, and none of it guarantees an outcome. It is simply what underwriting reads. When you understand it, you can tell at a glance whether your file is likely to be an easy yes or one that needs a conversation. Next, see how those deposits translate into [minimum revenue to qualify](/) and the full [list of documents you will need](/).",
      },
      {
        type: "p",
        text: "Want a real read on your own statements? A funding specialist can review your file and tell you what your numbers actually support. You may qualify; approval depends on underwriting.",
      },
    ],
    faqs: [
      {
        question: "How many months of bank statements do I need?",
        answer:
          "Three to four months of business bank statements, all pages, is the standard ask. That window is long enough to show a real deposit pattern and recent enough to reflect how the business is running now.",
      },
      {
        question: "What matters more, my total deposits or my balance?",
        answer:
          "Both, and they answer different questions. Average monthly deposits show how much revenue the business brings in, while average daily balance shows whether it keeps a cushion. A strong file usually shows steady deposits and a balance that does not live at zero.",
      },
      {
        question: "Do a few NSFs mean I will be declined?",
        answer:
          "Not on their own. A few non-sufficient-funds items across several months are usually manageable. Frequent NSFs or many negative-balance days are harder to place, because they suggest a new payment could bounce. Approval depends on underwriting.",
      },
      {
        question: "Can underwriting see my other advances?",
        answer:
          "Yes. Regular fixed ACH debits to a funder show up clearly in your statements, and they signal how many positions you carry. Being upfront about current balances helps a specialist size something that fits your cash flow.",
      },
      {
        question: "Does checking my statements affect my credit?",
        answer:
          "Sharing bank statements does not affect your credit. Starting a prequalification does not trigger a hard credit check. Credit is considered, but revenue-based funding is weighed mainly on deposits and bank activity.",
      },
    ],
  },
  {
    slug: "minimum-revenue-to-qualify",
    kind: "article",
    title: "Minimum Revenue to Qualify: How Your Deposits Are Weighed",
    seoTitle: "Minimum Revenue to Qualify for Business Funding",
    seoDescription:
      "How much revenue you need for working capital, why time in business matters, and how deposits are weighed. Thresholds vary; approval is underwriting based.",
    excerpt:
      "There is no single magic number, but there are general thresholds. Here is how time in business and monthly deposits are actually weighed.",
    category: "Qualifying",
    primaryKeyword: "minimum revenue business funding",
    moneyPagePath: "/",
    related: [
      "what-lenders-read-bank-statements",
      "documents-needed-for-funding",
      "business-funding-bad-credit-guide",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "Almost every owner asks the same first question: how much do I need to make to qualify? It is a fair question, and the honest answer is that there is no single threshold that works everywhere. Different funders set different floors, and the same business can be an easy yes in one place and a maybe in another. What does stay consistent is how your numbers are weighed. Once you understand that, you can tell roughly where you stand.",
      },
      { type: "h2", text: "The two basics almost everyone looks at" },
      {
        type: "p",
        text: "Two factors come up again and again in a revenue-based review: how long you have been operating, and how much your business deposits each month. They are not the only inputs, but they are the gate most files have to pass before anything else gets weighed.",
      },
      {
        type: "ul",
        items: [
          "Time in business: roughly six months of operating history is a common starting point. More history generally strengthens a file.",
          "Monthly deposits: somewhere around $10,000 to $15,000 a month in deposits is a typical floor, though this varies by funder and industry.",
        ],
      },
      {
        type: "callout",
        title: "Thresholds vary, and they are not promises",
        text: "These figures are general and illustrative, not an offer or a guarantee. Some funders go lower, some want more, and the same numbers can read differently depending on your industry and bank activity. You may qualify; approval depends on underwriting.",
      },
      { type: "h2", text: "Why time in business matters" },
      {
        type: "p",
        text: "Operating history does two things for a file. It shows the business has survived past its riskiest early months, and it gives underwriting enough statements to read a real pattern. A business open three months has barely produced a trend. A business open a year or two has shown how it handles a slow season, a big month, and the ordinary ups and downs in between. That track record is worth a lot, which is why brand-new businesses, under three months, are usually the hardest to place.",
      },
      { type: "h2", text: "Why deposits matter more than the number alone" },
      {
        type: "p",
        text: "A monthly deposit figure is a starting point, not the whole story. Two businesses depositing the same amount can be weighed very differently depending on the quality of that revenue. Underwriting reads the deposit total alongside the texture around it.",
      },
      {
        type: "ul",
        items: [
          "Consistency: steady months read better than one huge month and three thin ones.",
          "Frequency: many smaller deposits across the month often signal more reliable cash flow than one large lump.",
          "Balance: an [average daily balance](/) that holds above zero shows there is room for a payment.",
          "NSFs: frequent negative days work against a file even when deposits look fine.",
        ],
      },
      {
        type: "p",
        text: "For the full breakdown of how those statements are read, see [what lenders actually read in your bank statements](/).",
      },
      { type: "h2", text: "How deposits translate into an amount" },
      {
        type: "p",
        text: "Once a file clears the basics, the size of an advance is generally tied to your monthly deposits, often a portion of one month or a small multiple of it, depending on the funder and the strength of the file. The point of the cap is to keep the payment inside what your deposits can absorb without choking the account. If you already carry advances, those existing payments reduce how much new payment is realistic, which is why stacking can shrink an offer or stop it.",
      },
      {
        type: "callout",
        title: "Below the threshold today?",
        text: "If your deposits or time in business sit under the typical floor, it does not always mean no. A specialist may still review the file, suggest a smaller amount, or point to a different option. It is worth a conversation rather than an assumption.",
      },
      { type: "h2", text: "What this means for you" },
      {
        type: "p",
        text: "If you have been operating around six months or longer and your business deposits in the rough neighborhood of $10,000 to $15,000 a month or more, with steady banking and few negative days, you are in the range where many files get a serious look. If you are under those marks, you are not automatically out, you simply have a file that needs a closer read. Either way, the only way to know what your specific numbers support is to have them reviewed.",
      },
      {
        type: "p",
        text: "A funding specialist can look at your actual deposits and time in business and tell you where you realistically stand. You may qualify; approval depends on underwriting, and there is no obligation to accept anything.",
      },
    ],
    faqs: [
      {
        question: "What is the minimum revenue to qualify for business funding?",
        answer:
          "There is no single universal floor. A common starting point is roughly $10,000 to $15,000 a month in business deposits, but thresholds vary by funder and industry. These figures are illustrative, not an offer, and approval depends on underwriting.",
      },
      {
        question: "How long do I need to be in business?",
        answer:
          "Around six months of operating history is a common starting point, and more history generally strengthens a file. Businesses under three months old are the hardest to place because there is not enough statement history to read a pattern.",
      },
      {
        question: "Do I qualify if my revenue is below the typical threshold?",
        answer:
          "Not necessarily out. A specialist may still review the file, suggest a smaller amount, or point to a different option. Being below the typical floor means the file needs a closer read, not an automatic no.",
      },
      {
        question: "Does higher revenue guarantee a larger advance?",
        answer:
          "No. Deposits are weighed alongside consistency, average balance, NSFs, and any existing advances. The amount is sized to fit your cash flow, and nothing is guaranteed. Approval depends on underwriting.",
      },
      {
        question: "Is revenue the only thing that matters?",
        answer:
          "No. Time in business, bank activity, existing obligations, and use of funds all factor in. Revenue-based funding leans on deposits and bank activity rather than credit alone, but they work together.",
      },
    ],
  },
  {
    slug: "documents-needed-for-funding",
    kind: "article",
    title: "Documents You Need to Get Funded (and Why Each One)",
    seoTitle: "Documents Needed for Business Funding",
    seoDescription:
      "The documents you need for working capital and why each one matters: application, bank statements, ID, voided check, EIN, and what may come up later.",
    excerpt:
      "A short, well-prepared file moves faster. Here is the standard document list, what each item proves, and what underwriting sometimes asks for next.",
    category: "Qualifying",
    primaryKeyword: "documents needed business funding",
    moneyPagePath: "/",
    related: [
      "what-lenders-read-bank-statements",
      "minimum-revenue-to-qualify",
      "working-capital-guide",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "Getting funded is mostly an exercise in proving a few simple things: that the business is real, that you own it, that money flows through it, and where to send the funds. A clean, complete file moves faster because nobody has to chase missing pages. Here is the standard document list, with the reason behind each item so you know why you are sending it.",
      },
      { type: "h2", text: "The core documents almost every file needs" },
      {
        type: "ol",
        items: [
          "A short application: basic facts about the business and owner so a specialist can match you to the right option.",
          "Three to four months of business bank statements, all pages: the heart of the review, where deposits, balance, and activity are read.",
          "Government-issued photo ID and proof of ownership: confirms you are who you say and that you can sign for the business.",
          "A voided business check or bank letter: confirms the account where funds would land and payments would come from.",
          "Your EIN (employer identification number): the business tax ID that ties the file to the legal entity.",
        ],
      },
      {
        type: "p",
        text: "That is the backbone of most working-capital files. Each piece answers a question an underwriter has to answer anyway, so sending them upfront simply saves a round trip.",
      },
      { type: "h2", text: "Why each one matters" },
      { type: "h3", text: "The application" },
      {
        type: "p",
        text: "The application is not red tape. It is how a specialist learns what the money is for, how much you are after, and how you get paid, so they can point you at an option that fits instead of a one-size-fits-all product. A clear use of funds, inventory, payroll, equipment, actually strengthens a file.",
      },
      { type: "h3", text: "Bank statements" },
      {
        type: "p",
        text: "Statements are where revenue-based underwriting lives. They show average monthly deposits, how often money lands, the average daily balance, and any negative or NSF days. Send all pages, even the blank summary page, because a missing page reads as an incomplete file. For the full picture of what gets read, see [what lenders actually read in your bank statements](/).",
      },
      { type: "h3", text: "ID and proof of ownership" },
      {
        type: "p",
        text: "A photo ID confirms your identity, and proof of ownership, often through the entity paperwork, confirms you have the authority to enter into the agreement. Most working-capital agreements also include a personal guarantee from the owner, which is part of why your identity has to be verified.",
      },
      { type: "h3", text: "Voided check" },
      {
        type: "p",
        text: "A voided check (or a bank verification letter) does two jobs. It confirms the account that would receive the funds, and it confirms the account the agreed payments would be drawn from. Since most advances repay through a fixed daily or weekly ACH, the funder needs the exact account details to set that up correctly.",
      },
      { type: "h3", text: "EIN" },
      {
        type: "p",
        text: "Your EIN links the file to the actual legal business. It helps confirm the entity, its age, and that the deposits and the application all belong to the same business rather than a personal side account.",
      },
      { type: "h2", text: "What underwriting may ask for next" },
      {
        type: "p",
        text: "If the file is larger, the industry is specific, or something needs a second look, you may be asked for a few more items. These are normal follow-ups, not warning signs.",
      },
      {
        type: "ul",
        items: [
          "Card-processing statements: for businesses with heavy card volume, to confirm settlement deposits.",
          "Business or personal tax returns: more common on larger amounts or longer terms.",
          "Accounts receivable aging: if invoices or factoring are part of the picture.",
          "A short explanation: for negative days, a slow stretch, or an existing advance.",
        ],
      },
      {
        type: "callout",
        title: "A clean file moves faster",
        text: "Send complete statements, use your real business account, and be ready to explain anything unusual in a sentence. None of it guarantees an outcome, but it removes the friction that slows a file down. You may qualify; approval depends on underwriting.",
      },
      {
        type: "p",
        text: "Once your documents are together, the next questions are usually how much your revenue supports, covered in [minimum revenue to qualify](/), and how the cost is quoted, covered in the [working capital guide](/). A funding specialist can review your file and tell you whether anything is missing before it goes to underwriting.",
      },
    ],
    faqs: [
      {
        question: "What documents do I need to apply for business funding?",
        answer:
          "The core list is a short application, three to four months of business bank statements (all pages), a government-issued photo ID with proof of ownership, a voided business check, and your EIN. Some files also need processing statements, tax returns, or AR aging.",
      },
      {
        question: "Why do you need a voided check?",
        answer:
          "A voided check or bank letter confirms the account funds would land in and the account payments would be drawn from. Since most advances repay via a fixed daily or weekly ACH, the funder needs the exact account details to set it up.",
      },
      {
        question: "Will I need to provide tax returns?",
        answer:
          "Not always. Many working-capital files are reviewed on bank statements alone. Tax returns come up more often on larger amounts or longer terms, and are one of several items underwriting may request.",
      },
      {
        question: "Do I need to send all pages of my bank statements?",
        answer:
          "Yes. Send every page, including summary or blank pages. A missing page reads as an incomplete file and slows the review. Complete statements help a clean file move faster.",
      },
      {
        question: "Does submitting these documents commit me to anything?",
        answer:
          "No. Submitting your information does not obligate you to accept an offer, and any payments would have to fit your cash flow. A specialist may contact you to review your file.",
      },
    ],
  },
  {
    slug: "construction-funding-before-draw",
    kind: "article",
    title: "How Contractors Fund Materials and Payroll Before the Draw",
    seoTitle: "Construction Funding Before the Draw Lands",
    seoDescription:
      "How contractors cover materials and payroll before a progress draw lands. Draw-based cash flow, what underwriting reads, and options that fit jobs.",
    excerpt:
      "Materials and payroll are due now; the draw is weeks out. Here is how contractors bridge that gap and what underwriting looks at for draw-based work.",
    category: "By Industry",
    primaryKeyword: "construction funding before draw",
    moneyPagePath: "/construction-business-funding",
    related: [
      "business-funding-by-industry",
      "working-capital-guide",
      "what-lenders-read-bank-statements",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "Every contractor knows the squeeze. The work is moving, materials and payroll are due now, and the progress draw is three weeks out, assuming the general contractor signs off on schedule. You are not short on work. You are short on the gap between doing the work and getting paid for it. This guide is about how that gap gets bridged, and what underwriting actually looks at when the cash flow is draw-based.",
      },
      { type: "h2", text: "Why the draw gap exists" },
      {
        type: "p",
        text: "On most jobs, money goes out long before it comes in. You buy materials at the start, you run payroll weekly regardless of where the billing cycle sits, and you submit a draw only after you hit a milestone. Then the draw has to be reviewed and approved before it lands. The bigger the job, the bigger the float you are carrying out of your own pocket. That is the whole problem in one sentence: you finance the work, then the draw catches up.",
      },
      {
        type: "callout",
        title: "A day in the gap",
        text: "Monday you buy materials, thousands out the door before you bill anything. Midweek payroll is due. Thursday you submit the draw, and now the GC has to review it. Three weeks later the draw lands. Your money was tied up the entire time.",
      },
      { type: "h2", text: "How working capital bridges it" },
      {
        type: "p",
        text: "Working capital fills the space between spending and getting paid. With capital in place, you cover materials and crews now and let the draw arrive on its own schedule instead of yours. The most common uses contractors reach for are straightforward.",
      },
      {
        type: "ul",
        items: [
          "Materials upfront, so a supply house COD or a big order does not stall the start of a job.",
          "Payroll between draws, so your crew stays working while progress billing catches up.",
          "Mobilization, the upfront cost of getting a crew and gear on site for a new job.",
          "Equipment repair or rental, so a machine going down mid-job does not blow the schedule you bid on.",
          "Taking a bigger contract, so saying yes does not drain the jobs you are already running.",
        ],
      },
      {
        type: "p",
        text: "These are uses, not promised outcomes. What capital buys you is a position: the ability to move when the job needs it, rather than waiting on the draw. To see the full set of options a specialist can match you to, start with the [construction funding page](/construction-business-funding).",
      },
      { type: "h2", text: "What underwriting reads on a draw-based file" },
      {
        type: "p",
        text: "Lumpy cash flow is normal in construction, and underwriting that knows the trade reads it that way. The key is that the review looks at your deposit history across several months and across jobs, not a single billing cycle. A gap between draws is expected. What gets a closer look is a pattern of frequent NSFs that go beyond the ordinary timing of draws.",
      },
      {
        type: "ul",
        items: [
          "Draw-based deposits: do completions and draws land steadily over time, even if they are uneven week to week?",
          "Work mix: the balance of general contractor versus subcontractor revenue, and signed backlog.",
          "Gaps versus NSFs: gaps between draws are normal; frequent bounced payments are the flag.",
          "Time in business: roughly six months of operating across jobs is a common starting point.",
        ],
      },
      {
        type: "p",
        text: "For the full breakdown of what an underwriter reads line by line, see [what lenders actually read in your bank statements](/).",
      },
      { type: "h2", text: "How payments are structured around lumpy cash flow" },
      {
        type: "p",
        text: "This is where being precise matters. Most modern advances repay through a fixed daily or weekly ACH, a set amount on a set schedule, no matter where you sit in the draw cycle. That is worth planning for, because the payment does not automatically shrink in a slow week. Only a true card-split arrangement, where payback is a cut of each day's card sales, flexes on its own when sales dip, and most contractors do not run on card volume. A fixed-ACH deal can sometimes be adjusted through reconciliation if revenue genuinely drops, but that is a conversation with the funder, not an automatic feature.",
      },
      {
        type: "callout",
        title: "Match the payment to your draw rhythm",
        text: "Because the payment is usually fixed, the size of the advance should be set so the daily or weekly debit fits even during the stretch between draws. A specialist sizing the file to your real deposit pattern is what keeps the payment livable. Any payments must fit your cash flow, and there is no obligation to accept an offer.",
      },
      { type: "h2", text: "Putting your strongest file forward" },
      {
        type: "ol",
        items: [
          "Gather three to four months of business bank statements, all pages, showing draws and completions across jobs.",
          "Be ready to explain the draw timing so gaps read as normal, not as missed revenue.",
          "Know your existing advances; stacked positions reduce what a new payment can realistically support.",
          "Have a clear use of funds tied to a specific job or backlog.",
        ],
      },
      {
        type: "p",
        text: "Draw-based work does not have to mean financing every job out of your own pocket. A funding specialist can review your deposits across jobs and tell you what your file realistically supports. You may qualify; approval depends on underwriting.",
      },
    ],
    faqs: [
      {
        question: "Can I get funding before my progress draw lands?",
        answer:
          "That is exactly what working capital is often used for. With capital in place, contractors cover materials and payroll now and let the draw arrive on its own schedule. Amounts depend on underwriting and your deposit history.",
      },
      {
        question: "Does lumpy cash flow between draws hurt my file?",
        answer:
          "Not on its own. Lumpy cash flow is normal in construction, and underwriting looks at your deposit history across several months and jobs. A gap between draws is expected; frequent NSFs beyond normal draw timing get a closer look.",
      },
      {
        question: "Will my payment shrink during the gap between draws?",
        answer:
          "Usually not automatically. Most advances repay through a fixed daily or weekly ACH that stays the same regardless of the draw cycle. Only a true card-split deal flexes on its own. A fixed-ACH deal can sometimes be adjusted through reconciliation, but that is a conversation with the funder.",
      },
      {
        question: "Can I use funds to take on a bigger contract?",
        answer:
          "Yes. Mobilization, materials, and payroll for a larger job are common uses. Amounts depend on underwriting and your deposit history. See the construction funding page for the options a specialist can match you to.",
      },
      {
        question: "Are general contractors and subcontractors reviewed differently?",
        answer:
          "Both are welcome and are reviewed on the same basis: deposits across jobs, bank activity, and time in business. The work mix between GC and sub revenue is one of the things underwriting reads, not a barrier on its own.",
      },
    ],
  },
  {
    slug: "glossary",
    kind: "glossary",
    title: "The Small-Business Funding Glossary",
    seoTitle: "Small-Business Funding Glossary of Terms",
    seoDescription:
      "Plain-English definitions of the working-capital and MCA terms you will hear: factor rate, holdback, ACH, reconciliation, UCC, COJ, stacking, and more.",
    excerpt:
      "Funding has its own vocabulary. Here is a plain-English glossary of the terms you will hear, from factor rate and holdback to UCC filings and stacking.",
    category: "Reference",
    primaryKeyword: "business funding terms glossary",
    moneyPagePath: "/",
    related: [
      "working-capital-guide",
      "merchant-cash-advance-explained",
      "factor-rate-vs-apr",
    ],
    publishedAt: "2026-06-09",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        text: "Business funding comes with its own vocabulary, and a lot of it gets used loosely. A factor rate is not an interest rate. A holdback is not the same as a payment. Stacking, reconciliation, and a COJ all mean specific things that affect what you sign and what you pay back. This glossary keeps the definitions plain so you can read an offer and a contract with your eyes open.",
      },
      {
        type: "h2",
        text: "How to use this glossary",
      },
      {
        type: "p",
        text: "Each term below is defined in one or two plain sentences, with an example where it helps. The goal is not legal precision, it is so you recognize what a specialist or a contract means when they use the word. For a fuller walkthrough of how the cost works, see the [working capital guide](/) and [factor rate vs APR](/). This is general education, not financial, legal, or tax advice.",
      },
      {
        type: "callout",
        title: "The one to get right first",
        text: "A factor rate is not an APR. It is a set multiplier on the amount funded, and it tells you the total payback up front. A 1.2 factor on $50,000 means you repay $60,000, regardless of how fast you pay it off.",
      },
    ],
    faqs: [
      {
        question: "Is a factor rate the same as an interest rate or APR?",
        answer:
          "No. A factor rate is a flat multiplier on the amount funded that sets your total payback up front. It does not compound like interest, and paying it off faster does not reduce the total. It is not an APR. See factor rate vs APR for the full comparison.",
      },
      {
        question: "What is the difference between a card-split deal and a fixed-ACH advance?",
        answer:
          "A card-split deal takes a set percentage of each day's card sales, so the payment automatically shrinks on a slow day. A fixed-ACH advance debits a set amount on a set schedule regardless of sales, though it can sometimes be adjusted through reconciliation. Most modern advances are fixed-ACH.",
      },
      {
        question: "Why does stacking matter?",
        answer:
          "Stacking means taking a new advance while an existing one is still being repaid, so multiple fixed debits hit the same account. It strains cash flow and is a common reason a file is declined or an offer is reduced. Being upfront about current balances helps a specialist size something that fits.",
      },
    ],
    terms: [
      {
        term: "Factor rate",
        plain:
          "A flat multiplier on the amount funded that sets your total payback up front. It is not an APR and it does not compound; paying it off faster does not lower the total.",
        example:
          "A 1.2 factor rate on a $50,000 advance means you repay $60,000 in total ($50,000 x 1.2).",
      },
      {
        term: "Holdback",
        plain:
          "The share of your deposits or card sales that goes toward repayment. On a card-split deal it rises and falls with sales; people sometimes use the word loosely for the fixed payment too.",
        example:
          "A 12% holdback on a day with $2,000 in card sales sends about $240 toward payback that day.",
      },
      {
        term: "Daily or weekly ACH",
        plain:
          "An automatic debit pulled from your business account on a set schedule, daily or weekly, to repay an advance. Most modern advances use a fixed ACH amount that does not change with sales.",
        example:
          "A fixed $300 weekday ACH is pulled whether you had a busy day or a slow one.",
      },
      {
        term: "Reconciliation",
        plain:
          "A process to adjust a fixed-ACH payment when your actual revenue drops, so the debit better matches sales. It is not automatic; you usually have to request it and provide proof.",
        example:
          "After a slow month, you send statements and ask the funder to reconcile the fixed payment down to your true sales.",
      },
      {
        term: "Working capital",
        plain:
          "The cash a business has available to cover day-to-day operating costs like payroll, inventory, and rent, rather than long-term assets.",
      },
      {
        term: "Receivables",
        plain:
          "Money customers owe you for work or goods already delivered but not yet paid for. Also called accounts receivable, or AR.",
        example:
          "An unpaid net-30 invoice sits in your receivables until the customer pays.",
      },
      {
        term: "Merchant cash advance (MCA)",
        plain:
          "An advance of capital repaid as a share of future sales or a fixed daily or weekly ACH, priced with a factor rate rather than an interest rate. It is a purchase of future receivables, not a loan.",
      },
      {
        term: "Term loan",
        plain:
          "A fixed amount of money repaid over a set period in regular payments, typically with interest. Straightforward to plan around for a one-time use.",
      },
      {
        term: "Line of credit",
        plain:
          "A revolving limit you can draw from when you need it and pay down when you do not. You only carry, and pay on, what you actually use.",
      },
      {
        term: "Invoice factoring",
        plain:
          "Selling your unpaid invoices to a factor for cash now, instead of waiting on net-30 or net-60 terms. Recourse means you cover invoices the customer never pays; non-recourse means the factor takes that risk. Notified factoring means your customer is told to pay the factor directly.",
        example:
          "You factor a $20,000 invoice to get most of the cash today rather than waiting 45 days.",
      },
      {
        term: "Equipment financing",
        plain:
          "Funding tied to a specific piece of equipment, new or used. A loan means you own the equipment and repay over time; a lease means you pay to use it and may have an option to buy at the end.",
        example:
          "Financing a $40,000 truck so you can put it to work now while keeping cash free for payroll.",
      },
      {
        term: "Stacking",
        plain:
          "Taking on a new advance while an existing one is still being repaid, so several fixed debits hit the same account at once. It strains cash flow and is a common reason a file is declined.",
      },
      {
        term: "Renewal / refinance",
        plain:
          "Replacing or topping up an existing advance, often once a portion is paid down. A renewal usually pays off the old balance and advances new funds, which can roll unpaid cost into the new deal.",
      },
      {
        term: "Double-dipping",
        plain:
          "When a renewal pays off the remaining balance of an old advance but the unpaid portion of its factor cost gets charged again inside the new advance, so you effectively pay cost on cost.",
      },
      {
        term: "Prepayment",
        plain:
          "Paying off an advance early. Because the cost is a fixed factor rate rather than accruing interest, paying early usually does not lower the total payback unless the contract offers a specific discount.",
      },
      {
        term: "Personal guarantee",
        plain:
          "A promise by the business owner to be personally responsible for the balance if the business does not repay. Most working-capital agreements include one.",
      },
      {
        term: "Confession of judgment (COJ)",
        plain:
          "A clause where you agree in advance that a court can enter judgment against you without a trial if you default. It is restricted or banned in some places and is worth reading carefully before you sign.",
      },
      {
        term: "UCC filing",
        plain:
          "A public notice a funder files to claim an interest in business assets as security. A UCC-1 on your business is normal in this space, and existing filings can affect new offers.",
      },
      {
        term: "NSF (non-sufficient funds)",
        plain:
          "When your account does not have enough money to cover a payment that hits it. Frequent NSFs or negative-balance days make a file harder to place.",
        example:
          "A fixed ACH bounces because the balance dipped below the payment that morning.",
      },
      {
        term: "Time in business",
        plain:
          "How long your business has been operating. Around six months is a common starting point, and more history generally strengthens a file.",
      },
      {
        term: "Bank-statement underwriting",
        plain:
          "Reviewing a file mainly on business bank statements, deposits, balances, and activity, rather than tax returns or credit alone. It is the heart of revenue-based funding.",
      },
      {
        term: "Advance",
        plain:
          "The lump sum of capital provided to the business up front, before repayment begins. In an MCA it is the purchase price for a portion of your future sales.",
      },
      {
        term: "Remittance",
        plain:
          "Each repayment sent back to the funder, whether a fixed ACH debit or a share of card sales. The schedule of remittances repays the total payback.",
      },
      {
        term: "Secured vs unsecured",
        plain:
          "Secured funding is backed by specific collateral the funder can claim if you default; unsecured funding is not tied to a particular asset, though it often still includes a personal guarantee and a UCC filing.",
      },
    ],
  },
];
