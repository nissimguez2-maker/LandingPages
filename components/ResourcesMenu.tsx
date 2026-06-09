"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/** Header "Resources" dropdown. Shares the visual style of IndustryMenu. */
const PILLARS = [
  { href: "/resources/working-capital-guide", label: "Working Capital Guide" },
  { href: "/resources/merchant-cash-advance-explained", label: "Merchant Cash Advance Explained" },
  { href: "/resources/business-funding-by-industry", label: "Funding by Industry" },
  { href: "/resources/business-funding-bad-credit-guide", label: "Bad Credit Funding Guide" },
];

export default function ResourcesMenu({ vertical }: { vertical?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) track("resources_menu_opened", { source_vertical: vertical ?? "home" });
  };

  const onPick = (href: string) => {
    track("resources_menu_clicked", { href, source_vertical: vertical ?? "home" });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="resources-menu-panel"
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
      >
        Resources
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <nav
          id="resources-menu-panel"
          aria-label="Resources"
          className="absolute left-0 z-50 mt-2 w-[min(92vw,460px)] rounded-xl border border-slate-200 bg-white p-2 shadow-lift"
        >
          <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:gap-x-2">
            {PILLARS.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={() => onPick(p.href)}
                  className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm leading-snug text-slate-700 transition hover:bg-brand-50 hover:text-brand-900"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1 grid grid-cols-1 gap-0.5 border-t border-slate-100 pt-1 sm:grid-cols-2 sm:gap-x-2">
            <Link
              href="/resources"
              onClick={() => onPick("/resources")}
              className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-semibold text-accent-700 transition hover:bg-accent-50"
            >
              All guides →
            </Link>
            <Link
              href="/resources/glossary"
              onClick={() => onPick("/resources/glossary")}
              className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-semibold text-accent-700 transition hover:bg-accent-50"
            >
              Glossary
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
