import type { VerticalConfig } from "@/lib/types";

/**
 * One compact, collapsed-by-default block that merges the legal FAQ, the
 * trade-specific questions, and the plain-English glossary. Native <details>
 * so it works without JS and keeps the page short. The FAQ JSON-LD is emitted
 * separately from vertical.faqs, so SEO is unaffected by this merge.
 */
export default function QuestionsSection({ vertical }: { vertical: VerticalConfig }) {
  const faqs = vertical.faqs ?? [];
  const common = vertical.commonQuestions ?? [];
  const glossary = vertical.glossary ?? [];
  const qa = [...common, ...faqs];
  if (!qa.length && !glossary.length) return null;

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="container-content max-w-3xl">
        <p className="eyebrow">Questions and plain-English terms</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900 font-display sm:text-3xl">
          Everything you might ask
        </h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {qa.map((f) => (
            <details key={f.question} className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-900">
                {f.question}
                <svg className="h-5 w-5 flex-none text-slate-400 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
            </details>
          ))}

          {glossary.length > 0 && (
            <details className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-900">
                Words you might hear
                <svg className="h-5 w-5 flex-none text-slate-400 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <dl className="mt-2 space-y-2.5">
                {glossary.map((t) => (
                  <div key={t.term}>
                    <dt className="text-sm font-semibold text-brand-900">{t.term}</dt>
                    <dd className="text-sm leading-relaxed text-slate-600">{t.plain}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
