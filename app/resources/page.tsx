import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPillars, getArticlesByCategory, getGlossary } from "@/content/articlesConfig";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildBreadcrumbsJsonLd } from "@/lib/structuredData";

const TITLE = "Small Business Funding Guides & Resources";
const DESCRIPTION =
  "Plain-English guides on working capital, costs, qualifying, and choosing a funding option. Useful whether or not you ever apply.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/resources` },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: `${getSiteUrl()}/resources`, type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ResourcesHubPage() {
  const pillars = getPillars();
  const categories = getArticlesByCategory();
  const glossary = getGlossary();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbsJsonLd([{ name: "Resources", path: "/resources" }])) }}
      />
      <SiteHeader />
      <main className="bg-white">
        <section className="container-content py-12 lg:py-16">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Resources" }]} />
          <p className="eyebrow">Resources</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
            Straight answers on small business funding
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Plain-English guides on costs, terms, and qualifying, written to be useful whether or not you ever
            apply. FundVella is not a lender; we connect owners with working-capital specialists.
          </p>
        </section>

        {pillars.length ? (
          <section className="container-content pb-12">
            <h2 className="sr-only">Guides</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {pillars.map((p) => (
                <Link
                  key={p.slug}
                  href={`/resources/${p.slug}`}
                  className="hover-lift group flex h-full flex-col rounded-2xl border border-accent-300 bg-white p-6 shadow-card ring-1 ring-accent-200"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                    {p.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-brand-900 group-hover:text-brand-700 font-display">{p.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                  <span className="mt-3 text-sm font-semibold text-accent-700">Read the guide →</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="container-content space-y-12 pb-16">
          {categories.map((group) => (
            <div key={group.category}>
              <h2 className="text-xl font-semibold text-brand-900 font-display">{group.category}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/resources/${a.slug}`}
                    className="hover-lift group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
                  >
                    {a.readingMinutes ? (
                      <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                        {a.readingMinutes} min read
                      </span>
                    ) : null}
                    <h3 className="mt-3 font-semibold text-brand-900 group-hover:text-brand-700">{a.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{a.excerpt}</p>
                    <span className="mt-3 text-sm font-semibold text-accent-700">Read →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {glossary ? (
            <Link
              href={`/resources/${glossary.slug}`}
              className="hover-lift group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-brand-900 font-display group-hover:text-brand-700">{glossary.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{glossary.excerpt}</p>
              </div>
              <span className="mt-3 flex-none text-sm font-semibold text-accent-700 sm:mt-0">Open the glossary →</span>
            </Link>
          ) : null}
        </section>

        <section className="container-content pb-16">
          <div className="rounded-2xl border border-accent-200 bg-accent-50 px-6 py-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <p className="text-base font-medium text-brand-800">
              Prefer to skip ahead? See what you may qualify for in about 2 minutes, an estimate, not an offer.
            </p>
            <Link href="/#estimate" className="btn-primary mt-4 !min-h-0 !px-5 !py-3 text-sm sm:mt-0 sm:flex-none">
              See what you may qualify for
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
