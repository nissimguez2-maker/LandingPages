import Link from "next/link";
import type { VerticalConfig } from "@/lib/types";
import { SITE_NAME } from "@/lib/site";
import CTAButton from "./CTAButton";

/** Lean, sticky header. Shows the canonical readiness CTA on vertical pages. */
export default function SiteHeader({ vertical }: { vertical?: VerticalConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 19V13M12 19V6M19 19V10" />
            </svg>
          </span>
          <span className="font-display">{SITE_NAME}</span>
        </Link>
        {vertical ? (
          <CTAButton
            label={vertical.cta.primary}
            target="#estimate"
            location="header"
            vertical={vertical.slug}
            className="hidden !px-4 !py-2 text-sm sm:inline-flex"
          />
        ) : (
          <span className="hidden text-sm text-slate-500 sm:block">
            Reviewed on revenue &amp; bank activity
          </span>
        )}
      </div>
    </header>
  );
}
