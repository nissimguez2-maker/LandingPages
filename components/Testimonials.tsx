import type { VerticalConfig } from "@/lib/types";

/**
 * Testimonials, renders ONLY when real, owner-provided testimonials exist.
 * Never shows fabricated quotes. Today all verticals have none → renders null.
 */
export default function Testimonials({ vertical }: { vertical: VerticalConfig }) {
  const items = vertical.testimonials ?? [];
  if (!items.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content">
        <p className="eyebrow">In their words</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">What business owners say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.quote} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <blockquote className="text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-brand-900">
                {t.attribution}
                {t.detail && <span className="block font-normal text-slate-500">{t.detail}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
