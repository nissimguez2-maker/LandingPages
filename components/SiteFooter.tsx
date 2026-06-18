import Link from "next/link";
import { getActiveVerticals } from "@/content/landingPagesConfig";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import DisclaimerBlock from "./DisclaimerBlock";

const RESOURCE_LINKS = [
  { href: "/resources/working-capital-guide", label: "Working Capital Guide" },
  { href: "/resources/merchant-cash-advance-explained", label: "Merchant Cash Advance Explained" },
  { href: "/resources/business-funding-by-industry", label: "Funding by Industry" },
  { href: "/resources/business-funding-bad-credit-guide", label: "Bad Credit Funding Guide" },
  { href: "/resources/glossary", label: "Glossary" },
  { href: "/resources", label: "All guides" },
];

/** Footer with full internal linking (SEO) + the compliance disclaimer. */
export default function SiteFooter() {
  const verticals = getActiveVerticals();
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-content py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="font-bold text-brand-900">{SITE_NAME}</p>
            <p className="mt-2 max-w-xs text-sm text-slate-500">{SITE_TAGLINE}</p>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Funding by industry</p>
            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {verticals.map((v) => (
                <li key={v.slug}>
                  <Link href={`/${v.slug}`} className="text-slate-600 hover:text-brand-700">
                    {v.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resources</p>
            <ul className="mt-3 space-y-2 text-sm">
              {RESOURCE_LINKS.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-slate-600 hover:text-brand-700">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-slate-600 hover:text-brand-700">
                  Funding options
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-brand-700">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#estimate" className="text-slate-600 hover:text-brand-700">
                  Check my funding
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Legal">
          <Link href="/privacy" className="text-slate-600 hover:text-brand-700">Privacy Policy</Link>
          <Link href="/terms" className="text-slate-600 hover:text-brand-700">Terms of Service</Link>
          <Link href="/disclosures" className="text-slate-600 hover:text-brand-700">Disclosures</Link>
        </nav>

        <div className="mt-4">
          <DisclaimerBlock variant="line" />
        </div>

        <p className="mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. This site does not provide
          legal, tax, or financial advice.
        </p>
      </div>
    </footer>
  );
}
