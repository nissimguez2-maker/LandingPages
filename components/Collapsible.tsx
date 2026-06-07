import type { ReactNode } from "react";

/**
 * A whole section that collapses in place. The eyebrow + title become the
 * clickable bar (no duplicate heading), so a page reads as a short stack of
 * rows the visitor can open on demand. Native <details>, works without JS,
 * collapsed by default unless `defaultOpen`.
 */
export default function Collapsible({
  eyebrow,
  title,
  defaultOpen = false,
  bg = "bg-white",
  wide = false,
  children,
}: {
  eyebrow: string;
  title: string;
  defaultOpen?: boolean;
  bg?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`${bg} border-b border-slate-100`}>
      <details
        className={`mx-auto w-full px-5 py-5 group sm:px-6 sm:py-6 lg:px-8 ${wide ? "max-w-content" : "max-w-3xl"}`}
        {...(defaultOpen ? { open: true } : {})}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
          <span className="block">
            <span className="eyebrow block">{eyebrow}</span>
            <span className="mt-1 block text-xl font-bold tracking-tight text-brand-900 font-display sm:text-2xl">{title}</span>
          </span>
          <svg className="h-6 w-6 flex-none text-slate-400 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="mt-5">{children}</div>
      </details>
    </section>
  );
}
