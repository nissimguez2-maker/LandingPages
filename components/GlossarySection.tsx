import type { VerticalConfig } from "@/lib/types";

/** "Simple words", a plain-English glossary for this trade. */
export default function GlossarySection({ vertical }: { vertical: VerticalConfig }) {
  const terms = vertical.glossary;
  if (!terms?.length) return null;

  return (
    <section className="bg-brand-50/50 py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <p className="eyebrow">Simple words</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">A few terms, in plain English</h2>

        <dl className="mt-8 space-y-4">
          {terms.map((t) => (
            <div key={t.term} className="rounded-xl border border-slate-200 bg-white p-5">
              <dt className="font-semibold text-brand-900">{t.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{t.plain}</dd>
              {t.example && <dd className="mt-1.5 text-sm italic leading-relaxed text-slate-500">{t.example}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
