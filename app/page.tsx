import type { Metadata } from "next";

import PageViewTracker from "@/components/PageViewTracker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import PainReliefSection from "@/components/PainReliefSection";
import CashFlowStressTest from "@/components/CashFlowStressTest";
import TrustStats from "@/components/TrustStats";
import SocialProofSection from "@/components/SocialProofSection";
import OfferingsSection from "@/components/OfferingsSection";
import Timeline from "@/components/Timeline";
import ExampleUsesSection from "@/components/ExampleUsesSection";
import QuestionsSection from "@/components/QuestionsSection";
import CTASection from "@/components/CTASection";
import StickyCTA from "@/components/StickyCTA";
import { generalFunding } from "@/content/landingPagesConfig";
import { accentCssVars } from "@/lib/themes";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { buildFaqJsonLd } from "@/lib/structuredData";

const HOME_TITLE = "Small Business Funding on Your Revenue | FundVella";
const HOME_DESCRIPTION =
  "Working capital for almost any business, read on revenue and bank activity, not credit alone. You may qualify. Approval depends on underwriting.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: getSiteUrl() },
  openGraph: { title: HOME_TITLE, description: HOME_DESCRIPTION, url: getSiteUrl(), type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION },
};

export default function HomePage() {
  const v = generalFunding;
  return (
    <>
      {v.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(v.faqs)) }}
        />
      ) : null}
      <div style={accentCssVars(v.theme?.accent)}>
        <a href="#estimate" className="skip-link">
          Skip to the cash-flow check
        </a>
        <PageViewTracker vertical="home" />
        <SiteHeader vertical={v} />
        <main>
          {/* Z1 Hero */}
          <HeroSection vertical={v} />

          {/* Z2 Empathy — directly above the tool */}
          <PainReliefSection vertical={v} />

          {/* Z3 The cash-flow check (UNTOUCHED) */}
          <CashFlowStressTest vertical={v} />

          {/* Z4 Proof */}
          <TrustStats />
          <SocialProofSection vertical={v} />

          {/* Z5 How funding works + what it's for. On the HOME page the funding
              options open by default so the product story isn't hidden behind a click. */}
          <OfferingsSection defaultOpen />
          <Timeline />
          <ExampleUsesSection vertical={v} />

          {/* Z6 FAQ */}
          <QuestionsSection vertical={v} />

          {/* Z7 CTA */}
          <CTASection vertical={v} />
        </main>
        <SiteFooter />
        <StickyCTA vertical="home" label={v.cta.primary} />
      </div>
    </>
  );
}
