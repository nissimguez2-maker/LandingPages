import Link from "next/link";
import type { VerticalConfig } from "@/lib/types";
import { SITE_NAME } from "@/lib/site";
import CTAButton from "./CTAButton";

/** Lean, sticky header. Shows a scroll-to-form CTA on vertical pages. */
export default function SiteHeader({ vertical }: { vertical?: VerticalConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-sm text-white">
            ✓
          </span>
          {SITE_NAME}
        </Link>
        {vertical ? (
          <CTAButton
            label="Check Readiness"
            location="header"
            vertical={vertical.slug}
            className="!px-4 !py-2 text-sm"
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
