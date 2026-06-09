import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleBody from "@/components/resources/ArticleBody";
import ArticleBridge from "@/components/resources/ArticleBridge";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import { getResourceSlugs, getResourceBySlug, getRelated } from "@/content/articlesConfig";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildArticleJsonLd, buildFaqJsonLd, buildBreadcrumbsJsonLd } from "@/lib/structuredData";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getResourceBySlug(slug);
  if (!a) return {};
  const url = `${getSiteUrl()}/resources/${a.slug}`;
  return {
    title: { absolute: a.seoTitle },
    description: a.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: a.seoTitle, description: a.seoDescription, url, type: "article", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: a.seoTitle, description: a.seoDescription },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getResourceBySlug(slug);
  if (!a) notFound();

  const related = getRelated(a, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildArticleJsonLd({
              title: a.title,
              description: a.seoDescription,
              slug: `/resources/${a.slug}`,
              datePublished: a.publishedAt,
              dateModified: a.updatedAt,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbsJsonLd([
              { name: "Resources", path: "/resources" },
              { name: a.title, path: `/resources/${a.slug}` },
            ])
          ),
        }}
      />
      {a.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(a.faqs)) }}
        />
      ) : null}

      <SiteHeader />
      <main className="bg-white">
        <article className="container-content py-10 lg:py-14">
          <div className="mx-auto max-w-[720px]">
            <Breadcrumbs
              items={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: a.title }]}
            />

            <header className="mb-8">
              <span className="inline-flex w-fit items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                {a.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-brand-900 font-display sm:text-4xl">
                {a.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{a.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>By {SITE_NAME}</span>
                {a.readingMinutes ? (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{a.readingMinutes} min read</span>
                  </>
                ) : null}
                <span className="text-slate-300">·</span>
                <time dateTime={a.updatedAt ?? a.publishedAt}>Updated {formatDate(a.updatedAt ?? a.publishedAt)}</time>
              </div>
            </header>

            <ArticleBody blocks={a.body} />

            {a.kind === "glossary" && a.terms?.length ? (
              <dl className="mt-8 space-y-5">
                {a.terms.map((t) => (
                  <div key={t.term} className="border-l-2 border-accent-200 pl-4">
                    <dt className="font-semibold text-brand-900">{t.term}</dt>
                    <dd className="mt-1 text-base leading-relaxed text-slate-700">
                      {t.plain}
                      {t.example ? <span className="mt-1 block text-sm text-slate-500">Example: {t.example}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {a.faqs?.length ? (
              <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-brand-900 font-display">
                  Frequently asked
                </h2>
                <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-card">
                  {a.faqs.map((f) => (
                    <details key={f.question} className="group p-5">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-brand-900">
                        {f.question}
                        <svg
                          className="h-5 w-5 flex-none text-slate-400 transition-transform group-open:rotate-180"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </summary>
                      <p className="mt-3 text-base leading-relaxed text-slate-600">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <ArticleBridge moneyPagePath={a.moneyPagePath} />

            {related.length ? (
              <section className="mt-14" aria-labelledby="related-heading">
                <h2 id="related-heading" className="text-xl font-semibold text-brand-900 font-display">
                  Keep reading
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/resources/${r.slug}`}
                      className="hover-lift group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                    >
                      <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                        {r.category}
                      </span>
                      <h3 className="mt-3 text-sm font-semibold text-brand-900 group-hover:text-brand-700">{r.title}</h3>
                      <span className="mt-3 text-sm font-semibold text-accent-700">Read →</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-12 space-y-3">
              <p className="text-xs leading-relaxed text-slate-500">
                This article is general education, not financial, legal, or tax advice. Examples are illustrative and
                not offers. A factor rate is not an APR and the two are not interchangeable. FundVella is not a lender
                or bank; funding options, amounts, costs, and timing depend on underwriting and are not guaranteed.
              </p>
              <DisclaimerBlock variant="compact" />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
