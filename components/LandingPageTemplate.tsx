import type { VerticalConfig } from "@/lib/types";

import PageViewTracker from "./PageViewTracker";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import PainReliefSection from "./PainReliefSection";
import CashFlowStressTest from "./CashFlowStressTest";
import TrustStats from "./TrustStats";
import SocialProofSection from "./SocialProofSection";
import OfferingsSection from "./OfferingsSection";
import Timeline from "./Timeline";
import ExampleUsesSection from "./ExampleUsesSection";
import FitComparisonTable from "./FitComparisonTable";
import QuestionsSection from "./QuestionsSection";
import CTASection from "./CTASection";
import StickyCTA from "./StickyCTA";

/**
 * One template for every vertical, consolidated into 7 calm zones:
 *   Hero → empathy → the cash-flow check → proof → how it works + options → FAQ → CTA.
 * The Cash-Flow Stress Test stays exactly where it is, untouched, with the empathy
 * block immediately before it (the adjacency that makes the tool convert).
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
        {/* Z1 Hero */}
        <HeroSection vertical={vertical} />

        {/* Z2 Empathy — directly above the tool */}
        <PainReliefSection vertical={vertical} />

        {/* Z3 The cash-flow check (UNTOUCHED) */}
        <CashFlowStressTest vertical={vertical} />

        {/* Z4 Proof — one band right after the tool */}
        <TrustStats />
        <SocialProofSection vertical={vertical} />

        {/* Z5 How funding works + what it's for + fit */}
        <OfferingsSection vertical={vertical} />
        <Timeline />
        <ExampleUsesSection vertical={vertical} />
        <FitComparisonTable vertical={vertical} />

        {/* Z6 FAQ */}
        <QuestionsSection vertical={vertical} />

        {/* Z7 CTA */}
        <CTASection vertical={vertical} />
      </main>
      <SiteFooter />
      <StickyCTA vertical={vertical.slug} label={vertical.cta.primary} />
    </>
  );
}
