import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import DisclaimerBlock from "./DisclaimerBlock";

/**
 * Neutral thank-you page. NEVER shows rejection language — every visitor gets the
 * same calm confirmation regardless of internal lead band.
 */
export default function ThankYou({ verticalTitle }: { verticalTitle?: string }) {
  return (
    <>
      <SiteHeader />
      <main className="bg-brand-50/40">
        <div className="container-content flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
            <svg className="h-9 w-9 text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="eyebrow mt-6">{verticalTitle ? `${verticalTitle} • ` : ""}Prequalification received</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
            Thanks — your information was received.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
            A funding specialist may contact you to review whether the file is worth pursuing. Approval is
            not guaranteed and depends on underwriting and documentation.
          </p>

          <div className="mt-10 grid w-full gap-4 text-left sm:grid-cols-3">
            {[
              { t: "We may reach out", d: "A specialist may contact you using the details you provided." },
              { t: "Have statements ready", d: "3–4 months of business bank statements help. Clean files can move faster." },
              { t: "No obligation", d: "There's no obligation to accept any offer, and payments must fit cash flow." },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="font-semibold text-brand-900">{c.t}</p>
                <p className="mt-1.5 text-sm text-slate-600">{c.d}</p>
              </div>
            ))}
          </div>

          <Link href="/" className="btn-secondary mt-10">
            Back to home
          </Link>

          <div className="mt-10 w-full">
            <DisclaimerBlock compact />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
