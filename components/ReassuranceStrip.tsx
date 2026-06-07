import type { VerticalConfig } from "@/lib/types";

/** A short "this is normal here" strip that sits near the form. */
export default function ReassuranceStrip({ vertical }: { vertical: VerticalConfig }) {
  const items = vertical.reassurance;
  if (!items?.length) return null;

  return (
    <section className="bg-white py-12">
      <div className="container-content max-w-3xl">
        <div className="rounded-2xl border border-accent-200 bg-accent-50/40 p-6 sm:p-7">
          {vertical.localTouch && <p className="font-semibold text-brand-900 font-display">{vertical.localTouch}</p>}
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {items.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-slate-700">
                <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                </svg>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
