import type { FAQItem } from "@/lib/types";

/** Accessible accordion using native <details> (works without JS). */
export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <p className="eyebrow">Questions</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">Frequently asked</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-900">
                {faq.question}
                <svg
                  className="h-5 w-5 flex-none text-slate-400 transition group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              {faq.bullets && faq.bullets.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {faq.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
