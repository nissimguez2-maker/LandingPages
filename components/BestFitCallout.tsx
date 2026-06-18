import Link from "next/link";

import type { VerticalConfig } from "@/lib/types";
import { getProductById } from "@/content/productsConfig";
import Icon from "./icons/Icon";
import Reveal from "./motion/Reveal";

/**
 * A subtle, compliant "often the best fit for this trade" callout. Names the
 * vertical's primaryProduct (pulled from the §1 product matrix) with its
 * one-line "best when" trigger, and mentions the secondaryProduct as a common
 * alternative. Reuses the OfferingsSection card/Reveal styling.
 *
 * Compliance: this is fit guidance, not an offer or approval. FundVella does not
 * lend; a specialist matches the file. Renders nothing when no primaryProduct is
 * set, so verticals fall back gracefully.
 */
export default function BestFitCallout({ vertical }: { vertical: VerticalConfig }) {
  const primary = vertical.primaryProduct ? getProductById(vertical.primaryProduct) : undefined;
  if (!primary) return null;

  const secondary = vertical.secondaryProduct ? getProductById(vertical.secondaryProduct) : undefined;
  // Short trade label from the title (drop a trailing "Funding").
  const trade = vertical.title.replace(/\s*funding\s*$/i, "").trim();

  return (
    <Reveal className="mt-6">
      <div className="rounded-2xl bg-brand-50 p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[rgb(var(--accent-cta))] text-white">
            <Icon name={primary.icon} className="h-5 w-5" />
          </span>
          <div>
            <span className="eyebrow block">Often the best fit for {trade}</span>
            <h3 className="font-semibold text-brand-900">{primary.name}</h3>
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-accent-700">{primary.bestWhen}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{primary.body}</p>
        {secondary && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-brand-900">A common alternative: {secondary.name}.</span>{" "}
            {secondary.bestWhen}
          </p>
        )}
        {vertical.slug === "bad-credit-business-funding" && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            If you own real estate and your credit is 650+, a HELOC can be a fast way to put your equity to work, even
            while you clear up an old account. And if a file is not fundable yet, a{" "}
            <Link href="/credit-runway" className="font-semibold text-accent-700 underline underline-offset-2">
              not-yet is not a no
            </Link>{" "}
            &mdash; there is a credit-runway path back to fundable.
          </p>
        )}
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          A funding specialist reads your file and matches the option that fits how you get paid. FundVella is not a
          lender; you may qualify, approval depends on underwriting, and there&rsquo;s no obligation to accept an offer.
        </p>
      </div>
    </Reveal>
  );
}
