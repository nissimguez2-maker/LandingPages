import type { VerticalConfig } from "@/lib/types";
import { OFFERINGS } from "@/content/landingPagesConfig";
import Icon from "./icons/Icon";
import Reveal from "./motion/Reveal";
import Collapsible from "./Collapsible";
import BestFitCallout from "./BestFitCallout";

/**
 * "Options a specialist matches you to", MCA-led, others available. Compliance:
 * FundVella connects merchants with specialists; it does not lend or approve.
 * Cards carry no border/ring (shadow only); the hero option is marked by a badge
 * and a slightly stronger shadow, not a colored ring.
 *
 * When a `vertical` is supplied with a primaryProduct, a subtle "often the best
 * fit for this trade" callout renders below the grid (falls back to nothing).
 */
export default function OfferingsSection({ vertical, defaultOpen = false }: { vertical?: VerticalConfig; defaultOpen?: boolean } = {}) {
  const o = OFFERINGS;
  return (
    <Collapsible eyebrow={o.eyebrow} title={o.headline} wide defaultOpen={defaultOpen}>
      <p className="max-w-2xl text-slate-600">{o.intro}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {o.products.map((p, i) => (
          <Reveal key={p.name} delay={i * 80}>
            <div className={`hover-lift flex h-full flex-col rounded-2xl bg-white p-6 ${p.hero ? "shadow-lift" : "shadow-card"}`}>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
                    p.hero ? "bg-[rgb(var(--accent-cta))] text-white" : "bg-brand-50 text-brand-700"
                  }`}
                >
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-brand-900">{p.name}</h3>
                {p.hero && (
                  <span className="ml-auto rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-accent-700">{p.bestWhen}</p>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      {vertical && <BestFitCallout vertical={vertical} />}
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">{o.footnote}</p>
    </Collapsible>
  );
}
