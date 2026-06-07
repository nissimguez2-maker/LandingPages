import type { VerticalConfig } from "@/lib/types";
import { WHAT_WE_LOOK_AT } from "@/content/landingPagesConfig";

/** "What we look at", sets expectations and pre-frames the form questions. */
export default function QualificationCriteriaSection({ vertical }: { vertical: VerticalConfig }) {
  const items = vertical.qualificationFocus ?? WHAT_WE_LOOK_AT;
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="container-content">
        <p className="eyebrow">What we look at</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">
          How files are reviewed
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Reviews are based on business revenue and bank activity, not a single number. Here&apos;s what
          tends to matter most.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-brand-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        {vertical.qualificationNotes.length > 0 && (
          <div className="mt-6 rounded-lg border-l-4 border-accent-500 bg-accent-50/50 p-4 text-sm text-slate-700">
            {vertical.qualificationNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
