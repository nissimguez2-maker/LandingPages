import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import FitFinder from "@/components/fitfinder/FitFinder";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildBreadcrumbsJsonLd } from "@/lib/structuredData";
import { FIT_PAGE } from "@/content/fitFinder";

export const metadata: Metadata = {
  title: FIT_PAGE.seoTitle,
  description: FIT_PAGE.seoDescription,
  alternates: { canonical: `${getSiteUrl()}/find-your-fit` },
  openGraph: {
    title: FIT_PAGE.seoTitle,
    description: FIT_PAGE.seoDescription,
    url: `${getSiteUrl()}/find-your-fit`,
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function FindYourFitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbsJsonLd([{ name: "Find your fit", path: "/find-your-fit" }])),
        }}
      />
      <SiteHeader />
      <main className="bg-white">
        <div className="container-content max-w-3xl py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Find your fit" }]} />
          <p className="eyebrow">{FIT_PAGE.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
            {FIT_PAGE.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{FIT_PAGE.intro}</p>

          <div className="mt-10">
            <FitFinder />
          </div>

          <div className="mt-10">
            <DisclaimerBlock variant="compact" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
