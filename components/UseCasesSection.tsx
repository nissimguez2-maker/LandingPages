import type { VerticalConfig } from "@/lib/types";
import Icon from "./icons/Icon";

/** Vertical-specific "what businesses use this for" grid. */
export default function UseCasesSection({ vertical }: { vertical: VerticalConfig }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content">
        <p className="eyebrow">Common uses</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
          What {vertical.title.replace(" Funding", "").toLowerCase()} owners use working capital for
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vertical.useCases.map((useCase, i) => (
            <div key={useCase.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-700">
                {vertical.useCaseIcons?.[i] ? (
                  <Icon name={vertical.useCaseIcons[i]} className="h-5 w-5" />
                ) : (
                  i + 1
                )}
              </div>
              <h3 className="mt-4 font-semibold text-brand-900">{useCase.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
