import type { VerticalConfig } from "@/lib/types";

import PageViewTracker from "./PageViewTracker";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import TrustBar from "./TrustBar";
import SocialProofSection from "./SocialProofSection";
import Timeline from "./Timeline";
import FitComparisonTable from "./FitComparisonTable";
import Testimonials from "./Testimonials";
import CashFlowStressTest from "./CashFlowStressTest";
import DayInCashFlowSection from "./DayInCashFlowSection";
import ExampleUsesSection from "./ExampleUsesSection";
import ReassuranceStrip from "./ReassuranceStrip";
import OfferingsSection from "./OfferingsSection";
import GlossarySection from "./GlossarySection";
import CommonQuestionsSection from "./CommonQuestionsSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import StickyCTA from "./StickyCTA";
import Reveal from "./motion/Reveal";

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

        <CashFlowStressTest vertical={vertical} />
        <ReassuranceStrip vertical={vertical} />

        <DayInCashFlowSection vertical={vertical} />
        <ExampleUsesSection vertical={vertical} />
        <OfferingsSection />
        <Reveal>
          <FitComparisonTable vertical={vertical} />
        </Reveal>
        <Timeline />
        <SocialProofSection vertical={vertical} />
        <Testimonials vertical={vertical} />
        <FAQSection faqs={vertical.faqs} />
        <CommonQuestionsSection vertical={vertical} />
        <GlossarySection vertical={vertical} />
        <CTASection vertical={vertical} />
      </main>
      <SiteFooter />
      <StickyCTA vertical={vertical.slug} label={vertical.cta.primary} />
    </>
  );
}
