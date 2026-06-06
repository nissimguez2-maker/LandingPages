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
import FundingCalculator from "./FundingCalculator";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import DisclaimerBlock from "./DisclaimerBlock";
import StickyCTA from "./StickyCTA";
import PrequalificationFlow from "./prequal/PrequalificationFlow";

/**
 * The single template every vertical renders through. Section order follows the
 * conversion sequence: hook → trust → relevance → process → expectations → fit →
 * proof → estimate → act → FAQ.
 */
export default function LandingPageTemplate({ vertical }: { vertical: VerticalConfig }) {
  return (
    <>
      <a href="#prequalify" className="skip-link">
        Skip to prequalification form
      </a>
      <PageViewTracker vertical={vertical.slug} />
      <SiteHeader vertical={vertical} />
      <main>
        <HeroSection vertical={vertical} />
        <TrustBar items={vertical.heroHighlights} />
        <SocialProofSection vertical={vertical} />
        <UseCasesSection vertical={vertical} />
        <Timeline />
        <QualificationCriteriaSection vertical={vertical} />
        <FitComparisonTable vertical={vertical} />
        <Testimonials vertical={vertical} />
        <FundingCalculator vertical={vertical} />

        <section id="prequalify" className="scroll-mt-20 bg-brand-50/50 py-16 sm:py-20">
          <div className="container-content max-w-3xl">
            <div className="text-center">
              <p className="eyebrow">Prequalification</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900">
                Check your funding readiness
              </h2>
              <p className="mt-3 text-slate-600">
                About 2 minutes, based on your revenue and bank activity. No obligation to accept an offer.
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

        <FAQSection faqs={vertical.faqs} />
        <CTASection vertical={vertical} />
      </main>
      <SiteFooter />
      <StickyCTA vertical={vertical.slug} label={vertical.cta.primary} />
    </>
  );
}
