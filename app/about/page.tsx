import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildBreadcrumbsJsonLd } from "@/lib/structuredData";

const TITLE = "About FundVella";
const DESCRIPTION =
  "FundVella connects small business owners with working-capital specialists. We are not a lender. Files are reviewed on revenue and bank activity, not credit alone.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: `${getSiteUrl()}/about`, type: "website", siteName: SITE_NAME },
};

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-brand-900 font-display">{heading}</h2>
      <div className="mt-2 space-y-3 text-base leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbsJsonLd([{ name: "About", path: "/about" }])) }}
      />
      <SiteHeader />
      <main className="bg-white">
        <div className="container-content max-w-3xl py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
          <p className="eyebrow">About</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
            Working capital, reviewed on your revenue
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            FundVella helps small business owners find working capital that fits how their business actually earns,
            then connects them with specialists who do the review. We built it for operators who are tired of being
            judged on a credit score alone.
          </p>

          <div className="mt-10 space-y-8">
            <Section heading="What FundVella is">
              <p>
                FundVella is a prequalification and matching service. You answer a few questions in about two minutes,
                and if your file looks viable, a working-capital specialist reviews your recent bank activity and walks
                you through options that fit your cash flow. Starting is free and does not trigger a hard credit check.
              </p>
            </Section>

            <Section heading="What FundVella is not">
              <p>
                <strong>FundVella is not a lender, a bank, or a financial advisor.</strong> We do not issue funding, set
                rates, or make approval decisions. Those decisions are made by independent funding specialists and
                their underwriters. You may qualify; approval depends on underwriting, and there is no obligation to
                accept an offer. A factor rate is not an APR.
              </p>
            </Section>

            <Section heading="How the review works">
              <p>
                Most operating businesses can be reviewed on revenue and bank activity, not credit alone. A specialist
                typically looks at three to four months of business bank statements, your time in business, and how
                steadily money moves through your account. The goal is a payment that fits your cash flow, not one that
                fights it.
              </p>
              <p>
                We publish plain-English{" "}
                <Link href="/resources" className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800">
                  funding guides
                </Link>{" "}
                so you can understand costs and terms before you ever talk to anyone.
              </p>
            </Section>

            <Section heading="How we handle your information">
              <p>
                We treat your information carefully and share it only with the specialists and providers needed to
                review your inquiry. Sensitive data is encrypted, and we do not sell your personal information. See our{" "}
                <Link href="/privacy" className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/disclosures" className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800">
                  Disclosures
                </Link>{" "}
                for details.
              </p>
            </Section>
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
