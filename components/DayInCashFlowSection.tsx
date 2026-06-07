import type { VerticalConfig } from "@/lib/types";
import Reveal from "./motion/Reveal";
import Collapsible from "./Collapsible";

/** "A day in your cash flow", a short, real story where money goes out before it comes in. */
export default function DayInCashFlowSection({ vertical }: { vertical: VerticalConfig }) {
  const d = vertical.dayInCashFlow;
  if (!d) return null;

  return (
    <Collapsible eyebrow={d.eyebrow} title={d.headline} defaultOpen bg="bg-brand-50/50">
      {d.intro && <p className="text-slate-600">{d.intro}</p>}
      <ol className="relative mt-6 space-y-5 border-l-2 border-brand-200 pl-6">
        {d.steps.map((s, i) => (
          <Reveal key={s.time + i} delay={i * 90}>
            <li className="relative">
              <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 ring-4 ring-brand-50" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{s.time}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{s.event}</p>
            </li>
          </Reveal>
        ))}
      </ol>
      {d.closer && <p className="mt-6 rounded-xl border-l-4 border-accent-500 bg-white p-4 text-sm font-medium text-brand-900">{d.closer}</p>}
    </Collapsible>
  );
}
