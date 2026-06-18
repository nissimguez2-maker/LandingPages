"use client";

import { useEffect, useRef, useState } from "react";
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
 *  at this breakpoint by the header. Industries use short, clean labels. */
export default function MobileMenu({ industries }: { industries: { slug: string; title: string; label?: string }[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close + a focus trap while the panel is open: Tab cycles within the
  // panel so keyboard users can't tab out into the (scroll-locked) page behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      const toggle = toggleRef.current;
      if (!panel || !toggle) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      // The toggle button sits outside the panel but is part of the menu; keep it
      // in the loop so focus wraps between the trigger and the panel contents.
      const ring = [toggle, ...focusable];
      if (ring.length === 0) return;
      const first = ring[0];
      const last = ring[ring.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (active && !ring.includes(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the panel is open; restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus into the panel when it opens, and back to the toggle when it closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button, summary");
      firstLink?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  const close = () => setOpen(false);
  const itemClass = "block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-900";

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
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
        <div ref={panelRef} id="mobile-nav" className="absolute inset-x-0 top-16 z-40 border-t border-slate-200 bg-white shadow-lift">
          <nav className="container-content flex max-h-[80vh] flex-col gap-1 overflow-y-auto py-3" aria-label="Primary">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50">
                Industries {caret}
              </summary>
              <ul className="mt-0.5 space-y-0.5 pl-2">
                {industries.map((v) => (
                  <li key={v.slug}>
                    <Link href={`/${v.slug}`} onClick={close} className={itemClass}>
                      {v.label ?? v.title}
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

            <Link href="/products" onClick={close} className="rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50">
              Funding options
            </Link>

            <Link href="/find-your-fit" onClick={close} className="rounded-lg px-3 py-3 text-base font-semibold text-accent-700 hover:bg-accent-50">
              Find your fit
            </Link>

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
