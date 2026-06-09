import type { VerticalConfig } from "@/lib/types";
import { DEFAULT_TRUST_SIGNALS } from "@/content/landingPagesConfig";
import Icon from "./icons/Icon";

/**
 * Thin trust strip — the lower half of the single Proof band (it sits directly
 * under TrustStats). Compliant, factual signals only, rendered inline (no cards,
 * no fabricated proof). Real stats/logos appear only if the owner supplies them.
 */
export default function SocialProofSection({ vertical }: { vertical: VerticalConfig }) {
  const stats = vertical.stats ?? [];
  const logos = vertical.logos ?? [];

  return (
    <section className="bg-slate-50 pb-14 pt-2 sm:pb-20">
      <div className="container-content">
        {stats.length > 0 && (
          <dl className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-bold text-brand-900">{s.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
          {DEFAULT_TRUST_SIGNALS.map((sig) => (
            <li key={sig.title} className="inline-flex items-center gap-2">
              <Icon name={sig.icon} className="h-4 w-4 flex-none text-accent-700" />
              <span className="font-medium text-brand-900">{sig.title}</span>
            </li>
          ))}
        </ul>

        {logos.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80">
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
