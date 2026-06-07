const STEPS = [
  {
    title: "Complete a quick prequalification",
    description: "Answer a few questions about your business. It takes about two minutes and there's no obligation.",
  },
  {
    title: "Share recent bank statements if the file looks viable",
    description: "If the basics line up, share 3–4 months of business bank statements so the file can be reviewed properly.",
  },
  {
    title: "Review available options if underwriting supports the file",
    description: "A funding specialist may contact you to review available options. Approval depends on underwriting and documentation.",
  },
];

/** The 3-step process. Sets honest expectations up front. */
export default function HowItWorksSection() {
  return (
    <section className="bg-brand-50/50 py-10 sm:py-14">
      <div className="container-content">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">From check to capital in three steps</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative rounded-xl border border-brand-100 bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-base font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-brand-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
