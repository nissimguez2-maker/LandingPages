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
          <li>Identity-verification data: where you proceed with an application, your Social Security number, which we use to help verify identity and evaluate funding options. Your Social Security number is encrypted and is never shown back to you or shared in plain text.</li>
          <li>Bank-account information: if you choose to link an account, we use Plaid Inc. to securely connect to your bank and retrieve account and transaction information. Plaid is a third party with its own privacy policy that governs its handling of your bank credentials and data; we do not receive or store your online-banking login.</li>
          <li>Uploaded documents: bank statements or similar financial documents you upload, which we store privately to review your inquiry.</li>
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
          <li><strong>Service providers</strong> that support our operations and process data on our behalf, including Netlify (hosting), Resend (email), cal.com (call scheduling), and Microsoft Clarity and PostHog (product analytics and session insights).</li>
          <li><strong>Plaid Inc.</strong>, which we use to connect to your bank account and obtain account and transaction information when you choose to link an account. Plaid processes this data under its own <a href="https://plaid.com/legal/" className="underline" target="_blank" rel="noopener noreferrer">privacy policy</a>.</li>
          <li><strong>Authorities</strong>, where required by law.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="Financial information & how we protect it">
        <p>
          Some of the information you provide, such as your Social Security number, bank-account information
          obtained through Plaid, and the financial documents you upload, is nonpublic personal information. We
          collect it only to evaluate and present potential funding options, to verify identity, and to meet legal
          and recordkeeping obligations, and we limit access to personnel and partners who need it for those
          purposes.
        </p>
        <p>
          We maintain administrative, technical, and physical safeguards designed to protect this information.
          Sensitive fields, including your Social Security number and any bank-access credentials, are encrypted at
          rest using AES-256-GCM encryption and are transmitted over encrypted connections. Uploaded documents are
          stored in a private location. No method of transmission or storage is 100% secure, but we use reasonable
          safeguards to protect your information.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies & analytics">
        <p>
          We use privacy-respecting product analytics to understand how the site is used, including Microsoft
          Clarity and PostHog, which may record anonymized usage and on-page interactions to help us improve
          the experience. Form fields are masked in any session recording, so what you type is not captured.
          We do not run paid advertising trackers. Scheduling a call is handled by cal.com. You can control
          cookies through your browser settings.
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

      <LegalSection heading="Sensitive personal information (California)">
        <p>
          Under the California Consumer Privacy Act, as amended by the California Privacy Rights Act, some of the
          information we collect is considered sensitive personal information, including your Social Security number
          and your financial-account information. We use and disclose this information only as needed to provide the
          services you request, to verify identity, evaluate funding options, and meet legal obligations, and not to
          infer characteristics about you.
        </p>
        <p>
          We do not sell or share your sensitive personal information for cross-context behavioral advertising.
          California residents have the right to limit our use and disclosure of sensitive personal information to
          those permitted purposes. To exercise this right, or your other rights described above, contact us using
          the details below.
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          Form submissions are sent over an encrypted connection, and sensitive fields such as your Social Security
          number and any bank-access credentials are encrypted at rest using AES-256-GCM. No method of transmission
          or storage is 100% secure, but we use reasonable safeguards to protect your information.
        </p>
      </LegalSection>

      <LegalSection heading="Business audience">
        <p>This site is intended for business owners and is not directed to children.</p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update this policy and will revise the date above. Questions? Contact us at
          {" "}<a href="mailto:funding@fundvella.com" className="underline hover:text-brand-700">funding@fundvella.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
