import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of the ${SITE_NAME} website and prequalification service.`,
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="June 2026">
      <LegalSection heading="Acceptance of terms">
        <p>
          By accessing or using this website, you agree to these Terms of Service. If you do not agree,
          please do not use the site.
        </p>
      </LegalSection>

      <LegalSection heading="What we do">
        <p>
          {SITE_NAME} provides information and a prequalification service that helps operating businesses
          explore working-capital options. We are not a bank and do not provide legal, tax, or financial
          advice. We may share your information with funding partners and underwriters to evaluate options.
          Submitting a request does not guarantee approval, an offer, or any particular terms; approval
          depends on underwriting and documentation.
        </p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>
          The site is for business use by individuals authorized to act on behalf of a business. You agree
          to provide accurate, complete information.
        </p>
      </LegalSection>

      <LegalSection heading="No professional advice">
        <p>
          Content on this site is for general informational purposes only and is not a substitute for advice
          from qualified professionals.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The site, including its text, design, and logos, is owned by {SITE_NAME} or its licensors and may
          not be copied or reused without permission.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimers & limitation of liability">
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent
          permitted by law, {SITE_NAME} is not liable for any indirect, incidental, or consequential damages
          arising from your use of the site.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>These terms are governed by the laws of <strong>[your state/jurisdiction]</strong>.</p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update these terms and will revise the date above. Questions? Contact us at
          {" "}<a href="mailto:funding@fundvella.com" className="underline hover:text-brand-700">funding@fundvella.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
