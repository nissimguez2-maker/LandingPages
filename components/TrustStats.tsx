/**
 * Industry context strip — the headed top of the single Proof band (the thin
 * SocialProof trust strip sits directly beneath it). Every figure is a REAL,
 * third-party statistic with an attributed source link — never a fabricated
 * FundVella stat. Shows the cash-flow gap is common and that revenue-based
 * funding addresses a mainstream, documented need (trust / "this isn't a scam").
 */

type Stat = { value: string; label: string; source: string; href: string };

const JPMC =
  "https://www.jpmorganchase.com/institute/all-topics/business-growth-and-entrepreneurship/insight-cash-is-king";
const FED_SBCS = "https://www.fedsmallbusiness.org/reports/survey";

const STATS: Stat[] = [
  {
    value: "27 days",
    label: "Median cash buffer the typical small business keeps in reserve, the cushion a slow stretch can swallow fast.",
    source: "JPMorgan Chase Institute",
    href: JPMC,
  },
  {
    value: "1 in 4",
    label: "Small businesses hold fewer than 13 days of cash on hand.",
    source: "JPMorgan Chase Institute",
    href: JPMC,
  },
  {
    value: "56%",
    label: "Of firms that sought financing needed it just to cover operating expenses, not to expand.",
    source: "Federal Reserve, 2024 Small Business Credit Survey",
    href: FED_SBCS,
  },
  {
    value: "Only 41%",
    label: "Of businesses that applied for financing received the full amount they asked for.",
    source: "Federal Reserve, 2024 Small Business Credit Survey",
    href: FED_SBCS,
  },
];

export default function TrustStats() {
  return (
    <section className="bg-slate-50 py-14 sm:py-20">
      <div className="container-content">
        <p className="eyebrow">You are not the only one</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-brand-900 sm:text-4xl">
          The cash-flow gap is normal. It is not a verdict on your business.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          The squeeze between money out and money in is one of the most common pressures in small business, and
          research from the Federal Reserve and the JPMorgan Chase Institute shows how widespread it is.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value}>
              <dt className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">{s.value}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.label}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-1.5 block text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                >
                  Source: {s.source}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
