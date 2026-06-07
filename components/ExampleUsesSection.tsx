import type { VerticalConfig } from "@/lib/types";
import Reveal from "./motion/Reveal";
import Collapsible from "./Collapsible";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** "What owners like you fund" with illustrative funding ranges (never an offer). */
export default function ExampleUsesSection({ vertical }: { vertical: VerticalConfig }) {
  const items = vertical.exampleUses;
  if (!items?.length) return null;

  return (
    <Collapsible eyebrow="What owners like you fund" title="Real funding ranges for your trade" wide>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <p className="mt-6 text-xs text-slate-500">
        Illustrative funding ranges, not an offer or a guarantee. Most files land from $25,000 into the six figures, and larger files reach $5 million, depending on underwriting.
      </p>
    </Collapsible>
  );
}
