import Link from "next/link";
import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TrustBar from "@/components/TrustBar";
import HowItWorksSection from "@/components/HowItWorksSection";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import { getActiveVerticals } from "@/content/landingPagesConfig";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Fast working-capital reviews by industry`,
  description:
    "Fast working-capital reviews for real operating businesses, based on revenue and bank activity. Choose your industry to check your funding readiness. Approval depends on underwriting.",
};

export default function HomePage() {
  const verticals = getActiveVerticals();
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-brand-900 text-white">
          <div className="container-content py-20 text-center sm:py-24">
            <p className="eyebrow text-accent-300">Working capital, reviewed fast</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Fast working-capital reviews for real operating businesses
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100">
              Based on revenue, bank activity, time in business, and document readiness. You may qualify.
              Approval depends on underwriting.
            </p>
          </div>
        </section>

        <TrustBar />

        <section className="bg-white py-16 sm:py-20">
          <div className="container-content">
            <p className="eyebrow">Choose your industry</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
              Find the review built for your business
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {verticals.map((v) => (
                <Link
                  key={v.slug}
                  href={`/${v.slug}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card transition hover:border-brand-300 hover:shadow-lift"
                >
                  <h3 className="font-semibold text-brand-900 group-hover:text-brand-700">{v.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-slate-600">{v.heroHighlights[0]}</p>
                  <span className="mt-4 text-sm font-semibold text-accent-700">Check readiness →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <section className="bg-white py-12">
          <div className="container-content">
            <DisclaimerBlock />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
