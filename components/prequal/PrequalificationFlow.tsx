"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

import ProgressIndicator from "./ProgressIndicator";
import FormStep from "./FormStep";
import { RadioCards, TextField, TextArea, Checkbox } from "./Fields";
import DisclaimerBlock from "../DisclaimerBlock";

const STEPS = [
  { id: 1, label: "Business" },
  { id: 2, label: "Details" },
  { id: 3, label: "Contact" },
  { id: 4, label: "Optional" },
];

const emailOk = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v?: string) => !!v && v.replace(/\D/g, "").length >= 10;

export default function PrequalificationFlow({ vertical }: { vertical: VerticalConfig }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lead, setLead] = useState<LeadData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const partialSavedRef = useRef(false);

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

  /** Assemble the full payload with attribution + meta. */
  const buildPayload = useCallback(
    (partial: boolean): LeadData => ({
      ...lead,
      industry: vertical.slug,
      verticalTitle: vertical.title,
      sourcePage: typeof window !== "undefined" ? window.location.href : undefined,
      utm: getStoredUtm(),
      partial,
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

  /** Background partial save — never blocks the UI. */
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
      /* non-fatal — best-effort capture */
    }
  }, [buildPayload, fireBandEvent, vertical.slug]);

  // Safety net: if the visitor leaves after giving contact info but before
  // submitting, fire a beacon so the partial lead is still captured.
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
      if (!lead.monthlyRevenue) e.monthlyRevenue = "Please choose an option.";
      if (!lead.timeInBusiness) e.timeInBusiness = "Please choose an option.";
      if (!lead.amountNeeded) e.amountNeeded = "Please choose an option.";
      if (!lead.urgency) e.urgency = "Please choose an option.";
    } else if (current === 2) {
      if (!lead.existingDebt) e.existingDebt = "Please choose an option.";
      if (!lead.recentNsfs) e.recentNsfs = "Please choose an option.";
      if (!lead.useOfFunds) e.useOfFunds = "Please choose an option.";
      if (!lead.canProvideBankStatements) e.canProvideBankStatements = "Please choose an option.";
    } else if (current === 3) {
      if (!lead.firstName?.trim()) e.firstName = "Required";
      if (!lead.lastName?.trim()) e.lastName = "Required";
      if (!lead.businessName?.trim()) e.businessName = "Required";
      if (!phoneOk(lead.phone)) e.phone = "Enter a valid phone number.";
      if (!emailOk(lead.email)) e.email = "Enter a valid email.";
      if (!lead.state?.trim()) e.state = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleNext() {
    if (!validateStep(step)) return;
    track("prequal_step_completed", { vertical: vertical.slug, step });

    if (step === 3) {
      track("prequal_contact_captured", { vertical: vertical.slug });
      void savePartial(); // capture the lead now, before the optional step
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function handleBack() {
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
      // Lead was already captured as a partial at step 3 — proceed to thank-you.
    }
    router.push("/thank-you");
  }

  const backBtn = (
    <button
      type="button"
      onClick={handleBack}
      className="text-sm font-medium text-slate-500 hover:text-slate-800"
    >
      ← Back
    </button>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      <ProgressIndicator steps={STEPS} current={step} />

      <div className="mt-7">
        {step === 1 && (
          <FormStep
            title="Tell us about your business"
            description="Quick questions to start — no obligation."
            footer={
              <>
                <span />
                <button type="button" onClick={handleNext} className="btn-primary">
                  Continue
                </button>
              </>
            }
          >
            <RadioCards
              legend="Average monthly revenue"
              options={REVENUE_OPTIONS}
              value={lead.monthlyRevenue}
              onChange={(v: RevenueValue) => set("monthlyRevenue", v)}
              error={errors.monthlyRevenue}
            />
            <RadioCards
              legend="Time in business"
              options={TIME_IN_BUSINESS_OPTIONS}
              value={lead.timeInBusiness}
              onChange={(v: TimeInBusinessValue) => set("timeInBusiness", v)}
              error={errors.timeInBusiness}
            />
            <RadioCards
              legend="How much are you looking for?"
              options={AMOUNT_OPTIONS}
              value={lead.amountNeeded}
              onChange={(v: AmountValue) => set("amountNeeded", v)}
              error={errors.amountNeeded}
            />
            <RadioCards
              legend="How soon do you need it?"
              options={URGENCY_OPTIONS}
              value={lead.urgency}
              onChange={(v: UrgencyValue) => set("urgency", v)}
              columns={2}
              error={errors.urgency}
            />
          </FormStep>
        )}

        {step === 2 && (
          <FormStep
            title="A few underwriting details"
            description="Honest answers help match you to the right options. 'Prefer to discuss' is always okay."
            footer={
              <>
                {backBtn}
                <button type="button" onClick={handleNext} className="btn-primary">
                  Continue
                </button>
              </>
            }
          >
            <RadioCards
              legend="Existing business loans or advances?"
              options={EXISTING_DEBT_OPTIONS}
              value={lead.existingDebt}
              onChange={(v: ExistingDebtValue) => set("existingDebt", v)}
              error={errors.existingDebt}
            />
            <RadioCards
              legend="Current daily/weekly payments on existing financing"
              options={PAYMENT_BURDEN_OPTIONS}
              value={lead.paymentBurden}
              onChange={(v: PaymentBurdenValue) => set("paymentBurden", v)}
            />
            <RadioCards
              legend="Recent NSFs or negative balance days?"
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
                  Continue
                </button>
              </>
            }
          >
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
            <Checkbox
              label="I agree to be contacted by phone, email, or text about my inquiry. Message/data rates may apply. Consent is not a condition of any service."
              checked={!!lead.marketingConsent}
              onChange={(v) => set("marketingConsent", v)}
            />
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
            <TextField label="Business website (optional)" type="url" inputMode="url" value={lead.website || ""} onChange={(v) => set("website", v)} placeholder="https://" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Current funder, if any (optional)" value={lead.currentFunderName || ""} onChange={(v) => set("currentFunderName", v)} />
              <TextField label="Current balance owed, if known (optional)" inputMode="numeric" value={lead.currentBalanceOwed || ""} onChange={(v) => set("currentBalanceOwed", v)} placeholder="$" />
            </div>
            <TextArea label="Anything we should know? (optional)" value={lead.notes || ""} onChange={(v) => set("notes", v)} />
            <DisclaimerBlock compact />
          </FormStep>
        )}
      </div>
    </div>
  );
}
