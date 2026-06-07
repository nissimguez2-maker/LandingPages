import type { Metadata } from "next";

import PageViewTracker from "@/components/PageViewTracker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import CashFlowStressTest from "@/components/CashFlowStressTest";
import PainReliefSection from "@/components/PainReliefSection";
import OfferingsSection from "@/components/OfferingsSection";
import PrequalificationFlow from "@/components/prequal/PrequalificationFlow";
import IndustryPicker from "@/components/IndustryPicker";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import StickyCTA from "@/components/StickyCTA";
import Reveal from "@/components/motion/Reveal";
import { generalFunding } from "@/content/landingPagesConfig";
import { accentCssVars } from "@/lib/themes";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Small business funding, reviewed on revenue`,
  description:
    "Working capital for almost any operating business, reviewed on revenue and bank activity — not credit alone. Check your readiness in two minutes. Approval depends on underwriting.",
};

export default function HomePage() {
  const v = generalFunding;
  return (
    <div style={accentCssVars(v.theme?.accent)}>
      <a href="#estimate" className="skip-link">
        Skip to funding estimate
      </a>
      <PageViewTracker vertical="home" />
      <SiteHeader vertical={v} />
      <main>
        <HeroSection vertical={v} />
        <TrustBar />

        <PainReliefSection vertical={v} />

        <CashFlowStressTest vertical={v} />

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
              <PrequalificationFlow vertical={v} />
            </div>
            <div className="mt-6">
              <DisclaimerBlock />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container-content">
            <p className="eyebrow">Built for your industry</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">
              Find the review built for your business
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              We have dedicated pages for these industries — and we fund plenty that aren&apos;t listed.
              Tell us what you do and we&apos;ll point you to the right place.
            </p>
            <div className="mt-8">
              <IndustryPicker />
            </div>
          </div>
        </section>

        <OfferingsSection />
        <HowItWorksSection />
        <Reveal>
          <SocialProofSection vertical={v} />
        </Reveal>
        <FAQSection faqs={v.faqs} />
        <CTASection vertical={v} />
      </main>
      <SiteFooter />
      <StickyCTA vertical="home" label={v.cta.primary} />
    </div>
  );
}
