import type { VerticalConfig } from "@/lib/types";
import CTAButton from "./CTAButton";
import MediaFigure from "./MediaFigure";

const DEFAULT_CARD_POINTS = [
  "Reviewed on revenue & bank activity",
  "Share 3 to 4 months of statements if it looks viable",
  "A specialist follows up, no obligation",
];

/**
 * Above-the-fold hero. One clear action (→ the readiness calculator), a vertical
 * pain hook, an accent-tinted navy backdrop, and a "what happens next" card.
 */
export default function HeroSection({ vertical }: { vertical: VerticalConfig }) {
  const hook = vertical.cashFlowSignature || vertical.painPoint;
  const cardPoints = vertical.heroCardPoints ?? DEFAULT_CARD_POINTS;

  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-800" aria-hidden="true" />
      {/* Accent glow, the per-vertical color, kept subtle over the navy base. */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-500 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-content relative grid gap-6 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <p className="eyebrow text-accent-300">Working capital, built for {vertical.title.replace(" Funding", "").toLowerCase()}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight font-display sm:text-5xl">
            {vertical.heroHeadline}
          </h1>
          {hook && <p className="mt-4 text-base leading-relaxed text-brand-200">{hook}</p>}
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-brand-100">{vertical.heroSubheadline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <CTAButton label={vertical.cta.primary} target="#estimate" location="hero" vertical={vertical.slug} />
            {/* Express lane: a ready buyer skips the check and applies directly. */}
            <a
              href={`/apply/${vertical.slug}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
            >
              Ready now? Apply directly →
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
            {vertical.heroHighlights.map((h) => (
              <li key={h} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-brand-200">
            You may qualify. Approval depends on underwriting. No obligation to accept an offer.
          </p>
        </div>

        {/* Image slot + "what happens" card (no duplicate CTA). */}
        <div className="space-y-5 lg:col-span-6">
          <MediaFigure asset={vertical.heroImage} aspect="hero" className="hidden sm:block" />
          <div className="rounded-2xl bg-white p-6 text-slate-800 shadow-lift sm:p-7">
            <p className="text-lg font-semibold text-brand-900 font-display">What happens after you check</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {cardPoints.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
