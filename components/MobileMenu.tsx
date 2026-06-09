"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PILLARS = [
  { href: "/resources/working-capital-guide", label: "Working Capital Guide" },
  { href: "/resources/merchant-cash-advance-explained", label: "Merchant Cash Advance Explained" },
  { href: "/resources/business-funding-by-industry", label: "Funding by Industry" },
  { href: "/resources/business-funding-bad-credit-guide", label: "Bad Credit Funding Guide" },
];

const caret = (
  <svg className="h-5 w-5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

/** Mobile (<md) navigation: hamburger toggles a full-width slide-down panel with
 *  accordion sections. Desktop nav (IndustryMenu/ResourcesMenu/About) is hidden
 *  at this breakpoint by the header. */
export default function MobileMenu({ industries }: { industries: { slug: string; title: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const itemClass = "block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-900";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-brand-800 transition hover:bg-brand-50"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div id="mobile-nav" className="absolute inset-x-0 top-16 z-40 border-t border-slate-200 bg-white shadow-lift">
          <nav className="container-content flex max-h-[80vh] flex-col gap-1 overflow-y-auto py-3" aria-label="Primary">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50">
                Industries {caret}
              </summary>
              <ul className="mt-0.5 space-y-0.5 pl-2">
                {industries.map((v) => (
                  <li key={v.slug}>
                    <Link href={`/${v.slug}`} onClick={close} className={itemClass}>
                      {v.title}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-slate-100 pt-1">
                  <Link href="/#estimate" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent-700 hover:bg-accent-50">
                    Other or not listed →
                  </Link>
                </li>
              </ul>
            </details>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50">
                Resources {caret}
              </summary>
              <ul className="mt-0.5 space-y-0.5 pl-2">
                {PILLARS.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} onClick={close} className={itemClass}>
                      {p.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-slate-100 pt-1">
                  <Link href="/resources" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent-700 hover:bg-accent-50">
                    All guides →
                  </Link>
                </li>
                <li>
                  <Link href="/resources/glossary" onClick={close} className={itemClass}>
                    Glossary
                  </Link>
                </li>
              </ul>
            </details>

            <Link href="/about" onClick={close} className="rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50">
              About
            </Link>

            <Link href="/#estimate" onClick={close} className="btn-primary mt-2 w-full">
              Check my funding
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
