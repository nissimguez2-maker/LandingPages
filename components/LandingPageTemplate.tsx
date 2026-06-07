import type { VerticalConfig } from "@/lib/types";

import PageViewTracker from "./PageViewTracker";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import TrustBar from "./TrustBar";
import SocialProofSection from "./SocialProofSection";
import UseCasesSection from "./UseCasesSection";
import Timeline from "./Timeline";
import QualificationCriteriaSection from "./QualificationCriteriaSection";
import FitComparisonTable from "./FitComparisonTable";
import Testimonials from "./Testimonials";
import CashFlowStressTest from "./CashFlowStressTest";
import PainReliefSection from "./PainReliefSection";
import OfferingsSection from "./OfferingsSection";
import DayInCashFlowSection from "./DayInCashFlowSection";
import ExampleUsesSection from "./ExampleUsesSection";
import ReassuranceStrip from "./ReassuranceStrip";
import GlossarySection from "./GlossarySection";
import CommonQuestionsSection from "./CommonQuestionsSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import DisclaimerBlock from "./DisclaimerBlock";
import StickyCTA from "./StickyCTA";
import Reveal from "./motion/Reveal";
import PrequalificationFlow from "./prequal/PrequalificationFlow";

/**
 * The single template every vertical renders through. Order pulls the engaging,
 * interactive pieces up front (calculator → form), then the explanatory content:
 * hook → trust → estimate → act → relevance → fit → process → proof → FAQ.
 */
export default function LandingPageTemplate({ vertical }: { vertical: VerticalConfig }) {
  return (
    <>
      <a href="#estimate" className="skip-link">
        Skip to funding estimate
      </a>
      <PageViewTracker vertical={vertical.slug} />
      <SiteHeader vertical={vertical} />
      <main>
        <HeroSection vertical={vertical} />
        <TrustBar items={vertical.heroHighlights} />

        <PainReliefSection vertical={vertical} />

        <DayInCashFlowSection vertical={vertical} />

        <CashFlowStressTest vertical={vertical} />

        <section id="prequalify" className="scroll-mt-20 bg-brand-50/50 py-16 sm:py-20">
          <div className="container-content max-w-3xl">
            <div className="text-center">
              <p className="eyebrow">Prequalification</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">
                Start your prequalification
              </h2>
              <p className="mt-3 text-slate-600">
                About 2 minutes. A specialist reviews your file based on revenue and bank activity.
              </p>
            </div>
            <div className="mt-8">
              <PrequalificationFlow vertical={vertical} />
            </div>
            <div className="mt-6">
              <DisclaimerBlock />
            </div>
          </div>
        </section>

        <ReassuranceStrip vertical={vertical} />

        <Reveal>
          <UseCasesSection vertical={vertical} />
        </Reveal>
        <ExampleUsesSection vertical={vertical} />
        <OfferingsSection />
        <Reveal>
          <QualificationCriteriaSection vertical={vertical} />
        </Reveal>
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
