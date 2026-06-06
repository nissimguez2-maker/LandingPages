import type { VerticalConfig } from "@/lib/types";
import CTAButton from "./CTAButton";
import MediaFigure from "./MediaFigure";

/**
 * Above-the-fold hero. Passes the 5-second test: what this is, who it's for,
 * and the next action — all visible without scrolling. Now includes a vertical
 * image slot + a light pain-point line before the reassuring value prop.
 */
export default function HeroSection({ vertical }: { vertical: VerticalConfig }) {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-800" aria-hidden="true" />
      <div className="container-content relative grid gap-10 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <p className="eyebrow text-accent-300">Fast working-capital review</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {vertical.heroHeadline}
          </h1>
          {vertical.painPoint && (
            <p className="mt-4 text-base text-brand-200">{vertical.painPoint}</p>
          )}
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-brand-100">{vertical.heroSubheadline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton label={vertical.cta.primary} location="hero" vertical={vertical.slug} />
            <CTAButton
              label={vertical.cta.secondary}
              location="hero"
              vertical={vertical.slug}
              variant="secondary"
              className="!border-white/50 !bg-white/10 !text-white hover:!bg-white/20"
            />
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

        {/* Image slot + readiness card (commitment device). */}
        <div className="space-y-5 lg:col-span-6">
          <MediaFigure asset={vertical.heroImage} aspect="hero" className="hidden sm:block" />
          <div className="rounded-2xl bg-white p-6 text-slate-800 shadow-lift sm:p-7">
            <p className="text-lg font-semibold text-brand-900">Check your funding readiness</p>
            <p className="mt-1 text-sm text-slate-500">About 2 minutes. No obligation.</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                "Reviewed on revenue & bank activity",
                "Share 3–4 months of statements if the file looks viable",
                "A specialist may follow up — clean files move faster",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">{line}</span>
                </li>
              ))}
            </ul>
            <CTAButton label={vertical.cta.primary} location="hero_card" vertical={vertical.slug} className="mt-6 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
