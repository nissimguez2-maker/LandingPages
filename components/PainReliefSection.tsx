import type { VerticalConfig } from "@/lib/types";
import Icon from "./icons/Icon";
import Reveal from "./motion/Reveal";

/**
 * "Sound familiar?", names the merchant's pain (left/top) then the position
 * capital puts them in (right/bottom). Renders only when the vertical defines
 * `painRelief`. The relief describes a POSITION, never a promised outcome.
 */
export default function PainReliefSection({ vertical }: { vertical: VerticalConfig }) {
  const pr = vertical.painRelief;
  if (!pr) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content">
        <p className="eyebrow">{pr.eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-brand-900 font-display">
          {pr.headline}
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">{pr.intro}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pr.items.map((item, i) => (
            <Reveal key={item.pain} delay={i * 100}>
              <div className="hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                {/* Pain */}
                <div className="flex-1 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">{item.pain}</p>
                </div>
                {/* Relief */}
                <div className="border-t border-accent-100 bg-accent-50/50 p-6">
                  <p className="flex items-start gap-2 text-sm font-medium leading-relaxed text-brand-900">
                    <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                    </svg>
                    {item.relief}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-sm text-slate-500">{pr.closer}</p>
      </div>
    </section>
  );
}
