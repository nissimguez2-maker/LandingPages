import { HOW_IT_WORKS_STEPS } from "@/content/landingPagesConfig";
import Collapsible from "./Collapsible";

/** Visual timeline of the 3-step process (connected on desktop, stacked on mobile). */
export default function Timeline() {
  return (
    <Collapsible eyebrow="How it works" title="Three steps, no surprises" bg="bg-brand-50/50" wide>
      <ol className="relative grid gap-6 md:grid-cols-3 md:gap-6">
        {/* connecting line (desktop) */}
        <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-brand-200 md:block" aria-hidden="true" />
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <li key={step.title} className="relative">
            <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-base font-bold text-white ring-4 ring-brand-50">
              {i + 1}
            </span>
            <h3 className="mt-4 font-semibold text-brand-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </Collapsible>
  );
}
