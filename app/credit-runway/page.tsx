import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import Icon from "@/components/icons/Icon";
import Reveal from "@/components/motion/Reveal";
import CreditRunwayForm from "@/components/creditrunway/CreditRunwayForm";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildBreadcrumbsJsonLd } from "@/lib/structuredData";
import { CREDIT_RUNWAY } from "@/content/creditRunway";

export const metadata: Metadata = {
  title: CREDIT_RUNWAY.seoTitle,
  description: CREDIT_RUNWAY.seoDescription,
  alternates: { canonical: `${getSiteUrl()}/credit-runway` },
  openGraph: {
    title: CREDIT_RUNWAY.seoTitle,
    description: CREDIT_RUNWAY.seoDescription,
    url: `${getSiteUrl()}/credit-runway`,
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function CreditRunwayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbsJsonLd([{ name: "Credit runway", path: "/credit-runway" }])),
        }}
      />
      <SiteHeader />
      <main className="bg-white">
        <div className="container-content max-w-3xl py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Credit runway" }]} />
          <p className="eyebrow">{CREDIT_RUNWAY.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
            {CREDIT_RUNWAY.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{CREDIT_RUNWAY.intro}</p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{CREDIT_RUNWAY.notALoan}</p>

          {/* How it works */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-brand-900 font-display">{CREDIT_RUNWAY.howItWorksHeading}</h2>
            <p className="mt-2 text-slate-600">{CREDIT_RUNWAY.howItWorksIntro}</p>
            <ol className="mt-6 grid gap-5 sm:grid-cols-2">
              {CREDIT_RUNWAY.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 60}>
                  <li className="flex h-full gap-4 rounded-2xl bg-white p-5 shadow-card">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-900">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>

          {/* CROA rails — stated plainly */}
          <section className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brand-900 font-display">{CREDIT_RUNWAY.termsHeading}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {CREDIT_RUNWAY.terms.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Interest capture */}
          <section className="mt-12">
            <CreditRunwayForm />
          </section>

          {/* Cross-link back to fit / products */}
          <section className="mt-10 text-sm text-slate-600">
            <p>
              Already fundable, or not sure?{" "}
              <Link
                href="/find-your-fit"
                className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
              >
                Find your fit
              </Link>{" "}
              or browse{" "}
              <Link
                href="/products"
                className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
              >
                all funding options
              </Link>
              .
            </p>
          </section>

          <div className="mt-10">
            <DisclaimerBlock variant="compact" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
