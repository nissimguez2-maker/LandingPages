import Link from "next/link";
import type { VerticalConfig } from "@/lib/types";
import { getActiveVerticals, INDUSTRY_NAV_LABELS } from "@/content/landingPagesConfig";
import CTAButton from "./CTAButton";
import IndustryMenu from "./IndustryMenu";
import ResourcesMenu from "./ResourcesMenu";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";

/** Sticky header: brand lockup, primary nav (Industries · Resources · About),
 *  the canonical CTA, and a mobile menu. Industries use short, clean labels
 *  (the word "Funding" lives in the dropdown heading, not on every item). */
export default function SiteHeader({ vertical }: { vertical?: VerticalConfig }) {
  const industries = getActiveVerticals().map((v) => ({
    slug: v.slug,
    title: v.title,
    label: INDUSTRY_NAV_LABELS[v.slug] ?? v.title,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden h-6 w-px bg-slate-200 md:block" aria-hidden="true" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {industries.length > 1 && <IndustryMenu industries={industries} vertical={vertical?.slug} />}
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
            >
              Funding options
            </Link>
            <ResourcesMenu vertical={vertical?.slug} />
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {vertical ? (
            <CTAButton
              label={vertical.cta.primary}
              target="#estimate"
              location="header"
              vertical={vertical.slug}
              className="hidden !min-h-0 !px-4 !py-2 text-sm sm:inline-flex"
            />
          ) : (
            <Link href="/#estimate" className="btn-primary hidden !min-h-0 !px-4 !py-2 text-sm sm:inline-flex">
              Check my funding
            </Link>
          )}
          <MobileMenu industries={industries} />
        </div>
      </div>
    </header>
  );
}
