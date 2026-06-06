import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and shares information submitted through our prequalification forms.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 2026">
      <LegalSection heading="Overview">
        <p>
          This Privacy Policy explains how {SITE_NAME} (&ldquo;we&rdquo;) collects, uses, and shares
          information when you use this website and submit a prequalification request. By using the site,
          you agree to this policy.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>We collect information you provide and some collected automatically:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Contact details: name, business name, email, phone, and state.</li>
          <li>Business details: revenue range, time in business, bank-activity indicators, use of funds, existing financing, website, and any notes you share.</li>
          <li>Technical/marketing data: pages viewed, referral and UTM parameters, and basic device/usage data.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To review your inquiry and assess potential funding options.</li>
          <li>To contact you about your request by phone, email, or text (where you have consented).</li>
          <li>To operate, secure, and improve the site.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we share your information">
        <p>We may share your information with:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Our CRM provider</strong> (HubSpot), which stores and processes your inquiry on our behalf.</li>
          <li><strong>Funding partners and underwriters</strong>, to evaluate and present available options.</li>
          <li><strong>Service providers</strong> that support our operations (e.g., hosting and analytics).</li>
          <li><strong>Authorities</strong>, where required by law.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="Cookies & analytics">
        <p>
          We use basic, privacy-respecting analytics to understand site usage. No paid advertising trackers
          are connected at this time. You can control cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="Data retention">
        <p>
          We retain your information for as long as needed to review your inquiry, provide services, and meet
          legal or recordkeeping requirements, then delete or de-identify it.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices & rights">
        <ul className="list-disc space-y-1 pl-5">
          <li>Opt out of marketing texts by replying STOP; unsubscribe from emails using the link provided.</li>
          <li>Request access to, correction of, or deletion of your personal information, subject to applicable law.</li>
        </ul>
        <p>To exercise these choices, contact us using the details below.</p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          Form submissions are sent over an encrypted connection. No method of transmission or storage is
          100% secure, but we use reasonable safeguards to protect your information.
        </p>
      </LegalSection>

      <LegalSection heading="Business audience">
        <p>This site is intended for business owners and is not directed to children.</p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update this policy and will revise the date above. Questions? Contact us at
          {" "}<strong>[your contact email]</strong>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
