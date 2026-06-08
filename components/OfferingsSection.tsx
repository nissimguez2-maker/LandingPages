import { OFFERINGS } from "@/content/landingPagesConfig";
import Icon from "./icons/Icon";
import Reveal from "./motion/Reveal";
import Collapsible from "./Collapsible";

/**
 * "Options a specialist matches you to", MCA-led, others available. Compliance:
 * FundVella connects merchants with specialists; it does not lend or approve.
 */
export default function OfferingsSection() {
  const o = OFFERINGS;
  return (
    <Collapsible eyebrow={o.eyebrow} title={o.headline} bg="bg-brand-50/50" wide>
      <p className="max-w-2xl text-slate-600">{o.intro}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {o.products.map((p, i) => (
          <Reveal key={p.name} delay={i * 80}>
            <div
              className={`hover-lift flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
                p.hero ? "border-accent-300 ring-1 ring-accent-200" : "border-slate-200"
              }`}
            >
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
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">{o.footnote}</p>
    </Collapsible>
  );
}
