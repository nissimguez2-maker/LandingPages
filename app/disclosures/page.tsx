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
          agreement. Product-specific notes follow.
        </p>
      </LegalSection>

      <LegalSection heading="Revenue-based funding (merchant cash advance)">
        <p>
          A revenue-based advance is a purchase of a portion of your future receivables, not a loan. Its cost
          is expressed as a factor rate that sets one total payback amount, not an interest rate or an APR.
          Repayment is typically a fixed daily or weekly ACH or a share of card sales. Amounts and terms depend
          on underwriting and your business bank activity.
        </p>
      </LegalSection>

      <LegalSection heading="HELOC (home equity line of credit)">
        <p>
          A HELOC is secured by real property, so your property serves as collateral. Any number shown before
          a full review is indicative only and is not an offer or a commitment; final terms are confirmed
          against your equity, title, and underwriting. For a line secured by an owner-occupied residence, a
          three-business-day federal right of rescission may apply, during which you can cancel.
        </p>
      </LegalSection>

      <LegalSection heading="Term loans & SBA loans">
        <p>
          Term loans and SBA loans are loans. Their cost is expressed as an interest rate and an APR (unlike
          revenue-based funding). SBA loans are bank-funded, generally require tax returns and additional
          documentation, and can take longer to process. Rates, amounts, and terms depend on underwriting and
          are not guaranteed.
        </p>
      </LegalSection>

      <LegalSection heading="Equipment financing">
        <p>
          Equipment financing is typically secured by the equipment being purchased, which serves as
          collateral. Structures may be a loan or a lease, and terms vary by provider. Any tax treatment or
          potential write-offs should be confirmed with your own CPA or tax advisor.
        </p>
      </LegalSection>

      <LegalSection heading="Credit repair / restoration">
        <p>
          Credit repair is a service, not a loan or a guarantee of funding. It is provided by a third-party
          partner and is governed by the federal Credit Repair Organizations Act (CROA) and applicable state
          law. There are no upfront fees; any fees are billed monthly, in arrears, after services are
          performed, and you may cancel within three business days. We dispute inaccurate or questionable
          items only and do not promise any credit score, any number of deletions, or any particular outcome.
        </p>
      </LegalSection>

      <LegalSection heading="Card processing">
        <p>
          Card (payment) processing is a service that lets a business accept card payments. It is not funding,
          a loan, or a commitment to lend. Pricing and terms are set by the processing provider and disclosed
          before you enroll.
        </p>
      </LegalSection>

      <LegalSection heading="Affordability">
        <p>Any payments must fit your business cash flow. Please review terms carefully before accepting.</p>
      </LegalSection>

      <LegalSection heading="Communications consent">
        <p>
          If you opt in, you authorize {SITE_NAME} and its funding partners to contact you about your inquiry
          by phone, email, and text, including autodialed or prerecorded messages, at the number you
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
