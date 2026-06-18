import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import Icon from "@/components/icons/Icon";
import Reveal from "@/components/motion/Reveal";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildBreadcrumbsJsonLd, buildServiceJsonLd } from "@/lib/structuredData";
import {
  FUNDING_PRODUCTS,
  PATH_PRODUCTS,
  SERVICE_PRODUCTS,
} from "@/content/productsConfig";
import type { Product } from "@/lib/types";

const TITLE = "Funding options | FundVella";
const DESCRIPTION =
  "The funding options FundVella surfaces, from revenue-based working capital to lines of credit, HELOCs, term and SBA loans, equipment, bridge, and invoice factoring. FundVella is not a lender.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/products` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getSiteUrl()}/products`,
    type: "website",
    siteName: SITE_NAME,
  },
};

/** Funding-option card. Shares the OfferingsSection visual: no border/ring, the
 *  primary option carries a badge and a slightly stronger shadow. */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const hero = product.isPrimary;
  return (
    <Reveal delay={index * 60}>
      <div className={`hover-lift flex h-full flex-col rounded-2xl bg-white p-6 ${hero ? "shadow-lift" : "shadow-card"}`}>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
              hero ? "bg-[rgb(var(--accent-cta))] text-white" : "bg-brand-50 text-brand-700"
            }`}
          >
            <Icon name={product.icon} className="h-5 w-5" />
          </span>
          <h3 className="font-semibold text-brand-900">{product.name}</h3>
          {hero && (
            <span className="ml-auto rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
              Most popular
            </span>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-accent-700">{product.bestWhen}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{product.body}</p>
        <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
          {product.framingFacts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-400" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
        {product.complianceNote && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
            {product.complianceNote}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbsJsonLd([{ name: "Funding options", path: "/products" }])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServiceJsonLd("Small business funding options", "products")),
        }}
      />
      <SiteHeader />
      <main className="bg-white">
        <div className="container-content py-14">
          <div className="max-w-3xl">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Funding options" }]} />
            <p className="eyebrow">Funding options</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
              The option that fits how your business earns
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              There is no one-size-fits-all funding. The right option depends on what the money is for and how
              cash actually moves through your business. A specialist reads your file and matches you to the fit,
              usually starting with revenue-based funding. FundVella is not a lender; it connects you with
              specialists who review your file and present options.
            </p>
          </div>

          {/* Funding products */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-brand-900 font-display">Funding options</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              Eight ways to put working capital to work. Amounts, costs, and timing are decided by underwriting,
              not promised here.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FUNDING_PRODUCTS.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">
              Revenue-based funding is a purchase of future receivables and uses a factor rate that fixes one
              total payback amount, not an APR. Term loans and SBA loans are real loans and do carry an APR.
              You see the full cost before you decide. You may qualify; approval depends on underwriting, and
              there is no obligation to accept an offer.
            </p>
          </section>

          {/* Path back: credit repair (clearly separated) */}
          <section className="mt-14 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <p className="eyebrow">If you're not fundable yet</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-900 font-display">A not-yet is not a no</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              If credit is the blocker today, there is a path back rather than a dead end. This is a route to
              becoming fundable, not a funding product.
            </p>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {PATH_PRODUCTS.map((p) => (
                <div key={p.id} className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-brand-900">{p.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.body}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
                    {p.framingFacts.map((fact) => (
                      <li key={fact} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-400" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                  {p.complianceNote && (
                    <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
                      {p.complianceNote}
                    </p>
                  )}
                </div>
              ))}

              {/* Card processing service note */}
              {SERVICE_PRODUCTS.map((p) => (
                <div key={p.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-brand-900">{p.name}</h3>
                    <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                      Service
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Primary CTA → existing prequal anchor */}
          <section className="mt-14 rounded-2xl bg-brand-900 px-6 py-10 text-center sm:px-10">
            <h2 className="text-2xl font-bold text-white font-display">Not sure which one fits?</h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Answer a few questions in about two minutes. A specialist reviews your file and matches you to the
              option that fits your cash flow. No hard credit check, no obligation.
            </p>
            <Link href="/#estimate" className="btn-primary mt-6 inline-flex">
              Check my funding
            </Link>
          </section>

          <div className="mt-12">
            <DisclaimerBlock variant="compact" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
