import type { VerticalConfig } from "@/lib/types";
import Collapsible from "./Collapsible";

/** Good fit / may-need-review comparison. Honest framing builds trust (LIFT: Anxiety down). */
export default function FitComparisonTable({ vertical }: { vertical: VerticalConfig }) {
  return (
    <Collapsible eyebrow="Is this a fit?" title="Good fit vs. may need a closer look" wide>
      <p className="max-w-2xl text-slate-600">
        A &ldquo;may need review&rdquo; doesn&apos;t mean no, it just means a specialist will look closer.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-b border-slate-200 bg-accent-50/60 px-6 py-4 sm:border-b-0 sm:border-r">
            <h3 className="flex items-center gap-2 font-semibold text-accent-800">
              <span className="h-2 w-2 rounded-full bg-accent-500" /> Often a good fit
            </h3>
          </div>
          <div className="px-6 py-4">
            <h3 className="flex items-center gap-2 font-semibold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> May need review
            </h3>
          </div>
        </div>

        <dl className="divide-y divide-slate-100">
          {vertical.fitTable.map((row) => (
            <div key={row.label} className="grid grid-cols-1 sm:grid-cols-2">
              <div className="px-6 py-4 sm:border-r sm:border-slate-100">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{row.label}</dt>
                <dd className="mt-1 text-sm text-slate-700">{row.goodFit}</dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:hidden">{row.label}</dt>
                <dd className="mt-1 text-sm text-slate-700 sm:mt-0">{row.mayNeedReview}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </Collapsible>
  );
}
