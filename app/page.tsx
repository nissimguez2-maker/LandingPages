import type { Metadata } from "next";

import PageViewTracker from "@/components/PageViewTracker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import PainReliefSection from "@/components/PainReliefSection";
import CashFlowStressTest from "@/components/CashFlowStressTest";
import OfferingsSection from "@/components/OfferingsSection";
import DayInCashFlowSection from "@/components/DayInCashFlowSection";
import ExampleUsesSection from "@/components/ExampleUsesSection";
import ReassuranceStrip from "@/components/ReassuranceStrip";
import QuestionsSection from "@/components/QuestionsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import CTASection from "@/components/CTASection";
import StickyCTA from "@/components/StickyCTA";
import Reveal from "@/components/motion/Reveal";
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
        <HeroSection vertical={v} />
        <TrustBar />

        <PainReliefSection vertical={v} />

        <CashFlowStressTest vertical={v} />
        <ReassuranceStrip vertical={v} />

        <DayInCashFlowSection vertical={v} />
        <ExampleUsesSection vertical={v} />
        <OfferingsSection />

        <HowItWorksSection />
        <Reveal>
          <SocialProofSection vertical={v} />
        </Reveal>
        <QuestionsSection vertical={v} />
        <CTASection vertical={v} />
      </main>
      <SiteFooter />
      <StickyCTA vertical="home" label={v.cta.primary} />
      </div>
    </>
  );
}
