import Link from "next/link";

/**
 * End-of-article bridge: routes a (cold) reader into the existing funnel by LINK
 * only. The calculator / stress test itself is untouched. Primary path is the
 * funding check on the relevant money page; the deep apply link shows only for a
 * specific vertical.
 */
export default function ArticleBridge({ moneyPagePath }: { moneyPagePath: string }) {
  const isVertical = moneyPagePath !== "/";
  const checkHref = isVertical ? `${moneyPagePath}#estimate` : "/#estimate";
  const applyHref = isVertical ? `/apply${moneyPagePath}` : null;

  return (
    <section className="mt-12 overflow-hidden rounded-2xl bg-brand-900 px-6 py-8 text-white shadow-lift sm:px-8">
      <p className="eyebrow text-accent-300">Ready to check?</p>
      <p className="mt-2 text-xl font-semibold leading-snug font-display">See what your business may qualify for.</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-100">
        Still researching? Keep reading the guides below. If you would rather see specifics, the 2 minute check
        gives you a rough working-capital range based on your revenue and bank activity. It is an estimate, not an
        offer. You may qualify; approval depends on underwriting.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={checkHref} className="btn-primary !min-h-0 !px-5 !py-3 text-sm">
          See what you may qualify for
        </Link>
        {applyHref && (
          <Link
            href={applyHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
          >
            Ready now? Apply →
          </Link>
        )}
      </div>
      <p className="mt-4 text-xs text-brand-200">
        FundVella is not a lender. A factor rate is not an APR. No obligation to accept an offer.
      </p>
    </section>
  );
}
