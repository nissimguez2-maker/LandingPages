import type { VerticalConfig } from "@/lib/types";

import PageViewTracker from "./PageViewTracker";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import TrustBar from "./TrustBar";
import PainReliefSection from "./PainReliefSection";
import SocialProofSection from "./SocialProofSection";
import Timeline from "./Timeline";
import FitComparisonTable from "./FitComparisonTable";
import Testimonials from "./Testimonials";
import CashFlowStressTest from "./CashFlowStressTest";
import DayInCashFlowSection from "./DayInCashFlowSection";
import ExampleUsesSection from "./ExampleUsesSection";
import ReassuranceStrip from "./ReassuranceStrip";
import OfferingsSection from "./OfferingsSection";
import QuestionsSection from "./QuestionsSection";
import CTASection from "./CTASection";
import StickyCTA from "./StickyCTA";

/**
 * One template for every vertical. Lead with the tool: the Cash-Flow Stress Test
 * (which captures the lead) sits right under the hero, then the supporting story.
 */
export default function LandingPageTemplate({ vertical }: { vertical: VerticalConfig }) {
  return (
    <>
      <a href="#estimate" className="skip-link">
        Skip to the cash-flow check
      </a>
      <PageViewTracker vertical={vertical.slug} />
      <SiteHeader vertical={vertical} />
      <main>
        <HeroSection vertical={vertical} />
        <TrustBar items={vertical.heroHighlights} />

        <PainReliefSection vertical={vertical} />

        <CashFlowStressTest vertical={vertical} />
        <ReassuranceStrip vertical={vertical} />

        <DayInCashFlowSection vertical={vertical} />
        <ExampleUsesSection vertical={vertical} />
        <FitComparisonTable vertical={vertical} />
        <OfferingsSection />
        <Timeline />
        <SocialProofSection vertical={vertical} />
        <Testimonials vertical={vertical} />
        <QuestionsSection vertical={vertical} />
        <CTASection vertical={vertical} />
      </main>
      <SiteFooter />
      <StickyCTA vertical={vertical.slug} label={vertical.cta.primary} />
    </>
  );
}
