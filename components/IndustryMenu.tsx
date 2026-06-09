"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Header "Industries" menu. A click-to-open dropdown that sends owners straight
 * to the page built for their trade. Items use short, clean labels; the word
 * "Funding" lives once in the panel heading. Keyboard and screen-reader friendly.
 */
export default function IndustryMenu({
  industries,
  vertical,
}: {
  industries: { slug: string; title: string; label?: string }[];
  vertical?: string;
}) {
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
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) track("industries_menu_opened", { source_vertical: vertical ?? "home", count: industries.length });
  };

  const onPick = (slug: string, title: string, isOther = false) => {
    track("industry_menu_clicked", { slug, title, is_other: isOther, source_vertical: vertical ?? "home" });
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
        aria-controls="industry-menu-panel"
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
      >
        Industries
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <nav
          id="industry-menu-panel"
          aria-label="Industries"
          className="absolute left-0 z-50 mt-2 w-[min(92vw,520px)] rounded-xl border border-slate-200 bg-white p-2 shadow-lift"
        >
          <p className="px-3 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Funding by industry
          </p>
          <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:gap-x-2">
            {industries.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/${v.slug}`}
                  onClick={() => onPick(v.slug, v.title)}
                  className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm leading-snug text-slate-700 transition hover:bg-brand-50 hover:text-brand-900"
                >
                  {v.label ?? v.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-slate-100 pt-1">
            <Link
              href="/#estimate"
              onClick={() => onPick("other", "Other / not listed", true)}
              className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-semibold text-accent-700 transition hover:bg-accent-50"
            >
              Other or not listed. We fund most businesses →
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
