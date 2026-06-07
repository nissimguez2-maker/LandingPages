"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type {
  LeadData,
  VerticalConfig,
  RevenueValue,
  TimeInBusinessValue,
  AmountValue,
  UrgencyValue,
  ExistingDebtValue,
  PaymentBurdenValue,
  NsfValue,
  UseOfFundsValue,
  BankStatementsValue,
  ContactTimeValue,
  ChannelValue,
} from "@/lib/types";
import {
  REVENUE_OPTIONS,
  TIME_IN_BUSINESS_OPTIONS,
  AMOUNT_OPTIONS,
  URGENCY_OPTIONS,
  EXISTING_DEBT_OPTIONS,
  PAYMENT_BURDEN_OPTIONS,
  NSF_OPTIONS,
  USE_OF_FUNDS_OPTIONS,
  BANK_STATEMENTS_OPTIONS,
  CONTACT_TIME_OPTIONS,
  CHANNEL_OPTIONS,
} from "@/lib/types";
import { track } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import { scoreLead, bandEvent } from "@/lib/leadScoring";
import { computeCompleteness } from "@/lib/completeness";
import { SITE_NAME } from "@/lib/site";

import ProgressIndicator from "./ProgressIndicator";
import FormStep from "./FormStep";
import { RadioCards, TextField, TextArea } from "./Fields";

const STEPS = [
  { id: 1, label: "Business" },
  { id: 2, label: "Details" },
  { id: 3, label: "Contact" },
  { id: 4, label: "Optional" },
];

const PREFILL_KEY = "mca_prefill";

const emailOk = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v?: string) => !!v && v.replace(/\D/g, "").length >= 10;

export default function PrequalificationFlow({ vertical }: { vertical: VerticalConfig }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  // Seed from the funding calculator's prefill, if present.
  const [lead, setLead] = useState<LeadData>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.sessionStorage.getItem(PREFILL_KEY);
      if (raw) {
        window.sessionStorage.removeItem(PREFILL_KEY);
        return JSON.parse(raw) as LeadData;
      }
    } catch {
      /* ignore */
    }
    return {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const partialSavedRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const hpRef = useRef(""); // honeypot — stays empty for real users

  const set = useCallback(
    <K extends keyof LeadData>(key: K, value: LeadData[K]) => {
      if (!startedRef.current) {
        startedRef.current = true;
        track("prequal_form_started", { vertical: vertical.slug });
      }
      setLead((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [vertical.slug],
  );

  const buildPayload = useCallback(
    (partial: boolean): LeadData & { honeypot?: string } => ({
      ...lead,
      industry: vertical.slug,
      verticalTitle: vertical.title,
      sourcePage: typeof window !== "undefined" ? window.location.href : undefined,
      utm: getStoredUtm(),
      partial,
      honeypot: hpRef.current,
    }),
    [lead, vertical.slug, vertical.title],
  );

  const fireBandEvent = useCallback(
    (payload: LeadData, context: string) => {
      const { band, score } = scoreLead(payload);
      track(bandEvent(band), { vertical: vertical.slug, score, context });
    },
    [vertical.slug],
  );

  const savePartial = useCallback(async () => {
    const payload = buildPayload(true);
    if (!payload.email && !payload.phone) return;
    partialSavedRef.current = true;
    const { percentage } = computeCompleteness(payload);
    track("partial_lead_saved", { vertical: vertical.slug, completion: percentage });
    fireBandEvent(payload, "partial");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      /* best-effort */
    }
  }, [buildPayload, fireBandEvent, vertical.slug]);

  // Safety net: capture a partial if the visitor leaves after giving contact info.
  useEffect(() => {
    const handler = () => {
      if (submittedRef.current || partialSavedRef.current) return;
      const payload = buildPayload(true);
      if (!payload.email && !payload.phone) return;
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/lead", blob);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [buildPayload]);

  function validateStep(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 1) {
      if (!lead.monthlyRevenue) e.monthlyRevenue = "Choose your average monthly revenue.";
      if (!lead.timeInBusiness) e.timeInBusiness = "Choose how long you've been in business.";
      if (!lead.amountNeeded) e.amountNeeded = "Choose how much you're looking for.";
      if (!lead.urgency) e.urgency = "Choose how soon you need it.";
    } else if (current === 2) {
      if (!lead.existingDebt) e.existingDebt = "Tell us about existing financing.";
      if (!lead.recentNsfs) e.recentNsfs = "Choose an option for recent NSFs.";
      if (!lead.useOfFunds) e.useOfFunds = "Choose a primary use of funds.";
      if (!lead.canProvideBankStatements) e.canProvideBankStatements = "Let us know about bank statements.";
    } else if (current === 3) {
      if (!lead.firstName?.trim()) e.firstName = "First name is required.";
      if (!lead.lastName?.trim()) e.lastName = "Last name is required.";
      if (!lead.businessName?.trim()) e.businessName = "Business name is required.";
      if (!phoneOk(lead.phone)) e.phone = "Enter a valid phone number.";
      if (!emailOk(lead.email)) e.email = "Enter a valid email.";
      if (!lead.state?.trim()) e.state = "State is required.";
    }
    setErrors(e);
    if (Object.keys(e).length) {
      track("prequal_validation_error", { vertical: vertical.slug, step: current, fields: Object.keys(e) });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    return true;
  }

  async function handleNext() {
    if (!validateStep(step)) return;
    track("prequal_step_completed", { vertical: vertical.slug, step });
    if (step === 3) track("prequal_contact_captured", { vertical: vertical.slug });
    // Save a partial as soon as we have a contact channel (covers later drop-off).
    if (lead.email || lead.phone) void savePartial();
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function handleBack() {
    track("prequal_step_abandoned", { vertical: vertical.slug, step, direction: "back" });
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const payload = buildPayload(false);
    submittedRef.current = true;
    track("prequal_form_submitted", { vertical: vertical.slug });
    fireBandEvent(payload, "full");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* lead already captured as partial at step 3 */
    }
    router.push(`/thank-you?v=${vertical.slug}`);
  }

  const errorList = Object.values(errors).filter(Boolean);
  const errorSummary =
    errorList.length > 0 ? (
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <p className="font-semibold">Please fix the following:</p>
        <ul className="mt-1 list-disc pl-5">
          {errorList.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    ) : null;

  const backBtn = (
    <button type="button" onClick={handleBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
      ← Back
    </button>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      {/* Honeypot — hidden from real users; bots that fill it are silently dropped server-side. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        onChange={(e) => {
          hpRef.current = e.target.value;
        }}
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />
      <ProgressIndicator steps={STEPS} current={step} />
      <div aria-live="polite" className="sr-only">{`Step ${step} of ${STEPS.length}: ${STEPS[step - 1].label}`}</div>

      <div className="mt-7">
        {step === 1 && (
          <FormStep
            title="Tell us about your business"
            description="Quick questions to start — no obligation."
            footer={
              <>
                <span />
                <button type="button" onClick={handleNext} className="btn-primary">
                  Next: your financials
                </button>
              </>
            }
          >
            {errorSummary}
            <RadioCards legend="Average monthly revenue" options={REVENUE_OPTIONS} value={lead.monthlyRevenue} onChange={(v: RevenueValue) => set("monthlyRevenue", v)} error={errors.monthlyRevenue} />
            <RadioCards legend="Time in business" options={TIME_IN_BUSINESS_OPTIONS} value={lead.timeInBusiness} onChange={(v: TimeInBusinessValue) => set("timeInBusiness", v)} error={errors.timeInBusiness} />
            <RadioCards legend="How much are you looking for?" options={AMOUNT_OPTIONS} value={lead.amountNeeded} onChange={(v: AmountValue) => set("amountNeeded", v)} error={errors.amountNeeded} />
            <RadioCards legend="How soon do you need it?" options={URGENCY_OPTIONS} value={lead.urgency} onChange={(v: UrgencyValue) => set("urgency", v)} columns={2} error={errors.urgency} />
          </FormStep>
        )}

        {step === 2 && (
          <FormStep
            title="A few underwriting details"
            description="Honest answers help match you to the right options. Where offered, “Prefer to discuss” is always okay."
            footer={
              <>
                {backBtn}
                <button type="button" onClick={handleNext} className="btn-primary">
                  Next: your contact details
                </button>
              </>
            }
          >
            {errorSummary}
            <RadioCards
              legend="Existing loans or merchant cash advances (MCAs)?"
              help="Include any business loans, MCAs, or credit lines you're currently repaying."
              options={EXISTING_DEBT_OPTIONS}
              value={lead.existingDebt}
              onChange={(v: ExistingDebtValue) => set("existingDebt", v)}
              error={errors.existingDebt}
            />
            <RadioCards
              legend="Current daily/weekly payments on existing financing"
              help="Roughly what you pay out each week on current loans or advances."
              options={PAYMENT_BURDEN_OPTIONS}
              value={lead.paymentBurden}
              onChange={(v: PaymentBurdenValue) => set("paymentBurden", v)}
            />
            <RadioCards
              legend="Recent NSFs or negative balance days?"
              help="NSFs are bounced payments from insufficient funds — estimate the last 90 days."
              options={NSF_OPTIONS}
              value={lead.recentNsfs}
              onChange={(v: NsfValue) => set("recentNsfs", v)}
              columns={2}
              error={errors.recentNsfs}
            />
            <RadioCards
              legend="Primary use of funds"
              options={USE_OF_FUNDS_OPTIONS}
              value={lead.useOfFunds}
              onChange={(v: UseOfFundsValue) => set("useOfFunds", v)}
              columns={2}
              error={errors.useOfFunds}
            />
            <RadioCards
              legend="Can you provide 3–4 months of business bank statements?"
              help="Recent statements help a specialist review your cash flow faster."
              options={BANK_STATEMENTS_OPTIONS}
              value={lead.canProvideBankStatements}
              onChange={(v: BankStatementsValue) => set("canProvideBankStatements", v)}
              columns={3}
              error={errors.canProvideBankStatements}
            />
          </FormStep>
        )}

        {step === 3 && (
          <FormStep
            title="Where should a specialist reach you?"
            description="Your details are used only to review your inquiry. No obligation."
            footer={
              <>
                {backBtn}
                <button type="button" onClick={handleNext} className="btn-primary">
                  Next: optional details
                </button>
              </>
            }
          >
            {errorSummary}
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="First name" value={lead.firstName || ""} onChange={(v) => set("firstName", v)} autoComplete="given-name" error={errors.firstName} />
              <TextField label="Last name" value={lead.lastName || ""} onChange={(v) => set("lastName", v)} autoComplete="family-name" error={errors.lastName} />
            </div>
            <TextField label="Business name" value={lead.businessName || ""} onChange={(v) => set("businessName", v)} autoComplete="organization" error={errors.businessName} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Phone" type="tel" inputMode="tel" value={lead.phone || ""} onChange={(v) => set("phone", v)} autoComplete="tel" error={errors.phone} />
              <TextField label="Email" type="email" inputMode="email" value={lead.email || ""} onChange={(v) => set("email", v)} autoComplete="email" error={errors.email} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="State" value={lead.state || ""} onChange={(v) => set("state", v)} autoComplete="address-level1" error={errors.state} />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
              <input
                type="checkbox"
                checked={!!lead.marketingConsent}
                onChange={(e) => set("marketingConsent", e.target.checked)}
                className="mt-0.5 h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>
                By submitting, I authorize {SITE_NAME} and its funding partners to contact me about my
                inquiry by phone, email, and text — including autodialed or prerecorded messages — at the
                number provided. Consent isn&apos;t a condition of any service; message/data rates may apply;
                reply STOP to opt out. See our{" "}
                <Link href="/privacy" className="underline hover:text-slate-800">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </FormStep>
        )}

        {step === 4 && (
          <FormStep
            title="Anything else? (optional)"
            description="These help a specialist review your file faster. You can skip and submit."
            footer={
              <>
                {backBtn}
                <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary">
                  {submitting ? "Submitting…" : "See What You May Qualify For"}
                </button>
              </>
            }
          >
            <RadioCards
              legend="Best time to reach you (optional)"
              options={CONTACT_TIME_OPTIONS}
              value={lead.preferredContactTime}
              onChange={(v: ContactTimeValue) => set("preferredContactTime", v)}
              columns={4}
            />
            <RadioCards
              legend="Preferred contact method (optional)"
              options={CHANNEL_OPTIONS}
              value={lead.preferredChannel}
              onChange={(v: ChannelValue) => set("preferredChannel", v)}
              columns={3}
            />
            <TextField label="Business website (optional)" type="url" inputMode="url" value={lead.website || ""} onChange={(v) => set("website", v)} placeholder="https://" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Current funder, if any (optional)" value={lead.currentFunderName || ""} onChange={(v) => set("currentFunderName", v)} />
              <TextField label="Current balance owed, if known (optional)" inputMode="numeric" value={lead.currentBalanceOwed || ""} onChange={(v) => set("currentBalanceOwed", v)} placeholder="$" />
            </div>
            <TextArea label="Anything we should know? (optional)" value={lead.notes || ""} onChange={(v) => set("notes", v)} />
          </FormStep>
        )}
      </div>
    </div>
  );
}
