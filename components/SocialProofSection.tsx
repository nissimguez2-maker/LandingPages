import type { VerticalConfig } from "@/lib/types";
import { DEFAULT_TRUST_SIGNALS } from "@/content/landingPagesConfig";
import Icon from "./icons/Icon";

/**
 * Compliant trust signals (always) + real stats/logos (only when populated).
 * No fabricated proof: stats/logos render only if the owner supplies real data.
 */
export default function SocialProofSection({ vertical }: { vertical: VerticalConfig }) {
  const stats = vertical.stats ?? [];
  const logos = vertical.logos ?? [];

  return (
    <section className="border-y border-slate-100 bg-white py-12 sm:py-14">
      <div className="container-content">
        {stats.length > 0 && (
          <dl className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-bold text-brand-900">{s.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_TRUST_SIGNALS.map((sig) => (
            <div key={sig.title} className="hover-lift flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name={sig.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-900">{sig.title}</p>
                <p className="mt-0.5 text-sm leading-snug text-slate-600">{sig.description}</p>
              </div>
            </div>
          ))}
        </div>

        {logos.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80">
            {logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-8 w-auto" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
