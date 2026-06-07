import type { Metadata } from "next";

import PageViewTracker from "@/components/PageViewTracker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import CashFlowStressTest from "@/components/CashFlowStressTest";
import OfferingsSection from "@/components/OfferingsSection";
import DayInCashFlowSection from "@/components/DayInCashFlowSection";
import ExampleUsesSection from "@/components/ExampleUsesSection";
import ReassuranceStrip from "@/components/ReassuranceStrip";
import GlossarySection from "@/components/GlossarySection";
import CommonQuestionsSection from "@/components/CommonQuestionsSection";
import IndustryPicker from "@/components/IndustryPicker";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import StickyCTA from "@/components/StickyCTA";
import Reveal from "@/components/motion/Reveal";
import { generalFunding } from "@/content/landingPagesConfig";
import { accentCssVars } from "@/lib/themes";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME}, Small business funding, reviewed on revenue`,
  description:
    "Working capital for almost any operating business, reviewed on revenue and bank activity, not credit alone. Take the 2-minute cash-flow check. Approval depends on underwriting.",
};

export default function HomePage() {
  const v = generalFunding;
  return (
    <div style={accentCssVars(v.theme?.accent)}>
      <a href="#estimate" className="skip-link">
        Skip to the cash-flow check
      </a>
      <PageViewTracker vertical="home" />
      <SiteHeader vertical={v} />
      <main>
        <HeroSection vertical={v} />
        <TrustBar />

        <CashFlowStressTest vertical={v} />
        <ReassuranceStrip vertical={v} />

        <DayInCashFlowSection vertical={v} />
        <ExampleUsesSection vertical={v} />
        <OfferingsSection />

        <section className="bg-white py-16 sm:py-20">
          <div className="container-content">
            <p className="eyebrow">Built for your industry</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 font-display">
              Find the page built for your business
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              We have dedicated pages for these industries, and we fund plenty that aren&apos;t listed.
              Tell us what you do and we&apos;ll point you to the right place.
            </p>
            <div className="mt-8">
              <IndustryPicker />
            </div>
          </div>
        </section>

        <HowItWorksSection />
        <Reveal>
          <SocialProofSection vertical={v} />
        </Reveal>
        <FAQSection faqs={v.faqs} />
        <CommonQuestionsSection vertical={v} />
        <GlossarySection vertical={v} />
        <CTASection vertical={v} />
      </main>
      <SiteFooter />
      <StickyCTA vertical="home" label={v.cta.primary} />
    </div>
  );
}
