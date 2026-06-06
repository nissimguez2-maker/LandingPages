import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclosures",
  description: `Important funding disclosures for ${SITE_NAME}.`,
};

export default function DisclosuresPage() {
  return (
    <LegalLayout title="Disclosures" lastUpdated="June 2026">
      <LegalSection heading="Not a commitment to lend">
        <p>
          Nothing on this site is a commitment to lend or an offer of financing, and this is not a bank
          loan. {SITE_NAME} helps businesses explore options and may work with third-party funding partners.
        </p>
      </LegalSection>

      <LegalSection heading="Approval depends on underwriting">
        <p>
          Eligibility, amounts, rates, and timing depend on underwriting and documentation and are not
          guaranteed. Reviews consider business revenue and bank activity, among other factors, including
          credit.
        </p>
      </LegalSection>

      <LegalSection heading="Estimates are not offers">
        <p>
          Any figures shown by tools on this site (such as a funding-range estimator) are illustrative
          estimates only, not offers, and do not reflect actual terms.
        </p>
      </LegalSection>

      <LegalSection heading="Products & terms vary">
        <p>
          Available products may include merchant cash advances and other commercial financing. Structures,
          costs, and repayment terms vary by product and provider and will be disclosed before you enter any
          agreement.
        </p>
      </LegalSection>

      <LegalSection heading="Affordability">
        <p>Any payments must fit your business cash flow. Please review terms carefully before accepting.</p>
      </LegalSection>

      <LegalSection heading="Communications consent">
        <p>
          If you opt in, you authorize {SITE_NAME} and its funding partners to contact you about your inquiry
          by phone, email, and text — including autodialed or prerecorded messages — at the number you
          provide. Consent is not a condition of any service, message/data rates may apply, and you can reply
          STOP to opt out of texts at any time.
        </p>
      </LegalSection>

      <LegalSection heading="No obligation">
        <p>Submitting your information places you under no obligation to accept any offer.</p>
      </LegalSection>
    </LegalLayout>
  );
}
