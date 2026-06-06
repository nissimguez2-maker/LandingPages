import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

/** Shared shell for the Privacy / Terms / Disclosures pages. */
export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <div className="container-content max-w-3xl py-16">
          <h1 className="text-3xl font-bold tracking-tight text-brand-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">{children}</div>
          <p className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            This page is general information, not legal advice. Have your own counsel review and customize it
            (company legal name, contact details, governing law) before relying on it.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-brand-900">{heading}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
