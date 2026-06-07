import type { VerticalConfig } from "@/lib/types";
import Reveal from "./motion/Reveal";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** "What owners like you use it for" with illustrative dollar ranges (never an offer). */
export default function ExampleUsesSection({ vertical }: { vertical: VerticalConfig }) {
  const items = vertical.exampleUses;
  if (!items?.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content">
        <p className="eyebrow">What owners like you use it for</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">Real ways the money helps</h2>
        <p className="mt-3 max-w-2xl text-slate-600">These are example costs for your trade. They are not an offer or the amount you may receive.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u, i) => (
            <Reveal key={u.label} delay={i * 70}>
              <div className="hover-lift flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                <p className="text-lg font-bold text-brand-900 font-display">
                  {usd(u.rangeLow)} to {usd(u.rangeHigh)}
                </p>
                <p className="mt-1 font-semibold text-brand-900">{u.label}</p>
                {u.when && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-accent-700">{u.when}</p>}
                {u.note && <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{u.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-500">Illustrative costs for this trade. Not an offer, an estimate, or the amount you may receive. Approval depends on underwriting.</p>
      </div>
    </section>
  );
}
