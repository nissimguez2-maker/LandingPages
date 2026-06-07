"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LeadData, VerticalConfig } from "@/lib/types";
import { runStressTest, buildPrefill, fixFirst, type StressAnswers } from "@/lib/stressTest";
import {
  STRESS_INTRO,
  STRESS_STEPS,
  STRESS_TEASER,
  TIER_REVEAL,
  STRESS_CONTACT,
  FIT_COPY,
  PAYBACK_CLOSE,
  STRESS_PAYOFF,
} from "@/content/stressTest";
import { track } from "@/lib/analytics";
import { scoreLead, bandEvent } from "@/lib/leadScoring";
import { computeCompleteness } from "@/lib/completeness";
import { getStoredUtm } from "@/lib/utm";
import { SITE_NAME } from "@/lib/site";
import { RadioCards, TextField } from "./prequal/Fields";
import AnimatedNumber from "./motion/AnimatedNumber";
import Reveal from "./motion/Reveal";
import DisclaimerBlock from "./DisclaimerBlock";

const PREFILL_KEY = "mca_prefill";
const emailOk = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v?: string) => !!v && v.replace(/\D/g, "").length >= 10;

const METER: Record<string, string> = {
  resilient: "bg-emerald-400",
  exposed: "bg-amber-400",
  stretched: "bg-rose-400",
};

type Phase = "intro" | "step" | "result";
interface Contact {
  firstName: string;
  businessName: string;
  phone: string;
  email: string;
  marketingConsent: boolean;
}

/**
 * Cash-Flow Stress Test. A tap-only check that shows where the money runs short,
 * captures a real lead at the peak moment, then unlocks the personalized plan.
 * 100% client-side math. No dollar amount shown. No offer.
 */
export default function CashFlowStressTest({ vertical }: { vertical: VerticalConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [unlocked, setUnlocked] = useState(false);
  const [contact, setContact] = useState<Contact>({ firstName: "", businessName: "", phone: "", email: "", marketingConsent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const startedRef = useRef(false);
  const shownRef = useRef(false);
  const contactShownRef = useRef(false);
  const partialSavedRef = useRef(false);
  const hpRef = useRef("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const step = STRESS_STEPS[stepIdx];
  const currentValue = step ? answers[step.field] : undefined;
  const answered = Boolean(currentValue);

  const result = useMemo(() => runStressTest(answers as StressAnswers), [answers]);
  const fix = useMemo(() => fixFirst(answers as StressAnswers), [answers]);
  const reveal = TIER_REVEAL[result.tier];
  const fit = FIT_COPY[result.fitKey];

  const buildPayload = useCallback((): LeadData & { honeypot?: string } => {
    const contactData: Partial<LeadData> = {
      firstName: contact.firstName.trim() || undefined,
      businessName: contact.businessName.trim() || undefined,
      phone: contact.phone.trim() || undefined,
      email: contact.email.trim() || undefined,
      marketingConsent: contact.marketingConsent,
    };
    return {
      ...buildPrefill(answers as StressAnswers, vertical.slug, contactData),
      verticalTitle: vertical.title,
      sourcePage: typeof window !== "undefined" ? window.location.href : undefined,
      utm: getStoredUtm(),
      partial: true,
      honeypot: hpRef.current,
    };
  }, [answers, contact, vertical.slug, vertical.title]);

  // Safety net: if they typed contact then leave before pressing the button.
  useEffect(() => {
    const handler = () => {
      if (partialSavedRef.current) return;
      if (!phoneOk(contact.phone) && !emailOk(contact.email)) return;
      try {
        const blob = new Blob([JSON.stringify(buildPayload())], { type: "application/json" });
        navigator.sendBeacon("/api/lead", blob);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [buildPayload, contact.phone, contact.email]);

  const start = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("stresstest_started", { vertical: vertical.slug });
    }
    setPhase("step");
  };

  const choose = useCallback((field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const next = () => {
    if (!answered) return;
    track("stresstest_step", { vertical: vertical.slug, step: step.id, value: currentValue });
    if (stepIdx < STRESS_STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      track("stresstest_completed", { vertical: vertical.slug });
      setPhase("result");
    }
  };

  const back = () => {
    if (phase === "result") {
      setUnlocked(false);
      setPhase("step");
      return;
    }
    setStepIdx((i) => Math.max(0, i - 1));
  };

  // Fire result + contact-shown once.
  if (phase === "result" && !shownRef.current) {
    shownRef.current = true;
    track("stresstest_result_shown", { vertical: vertical.slug, tier: result.tier, exposure: result.exposure });
  }
  if (phase === "result" && !unlocked && !contactShownRef.current) {
    contactShownRef.current = true;
    track("stresstest_contact_shown", { vertical: vertical.slug });
  }

  const setC = (k: keyof Contact, v: string | boolean) => {
    setContact((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const submitContact = async () => {
    if (submitting) return;
    const e: Record<string, string> = {};
    if (!contact.firstName.trim()) e.firstName = "Please add your first name.";
    if (!contact.businessName.trim()) e.businessName = "Please add your business name.";
    if (!phoneOk(contact.phone) && !emailOk(contact.email)) {
      e.phone = "Add a phone or an email so we can send your results.";
    }
    setErrors(e);
    if (Object.keys(e).length) {
      track("stresstest_validation_error", { vertical: vertical.slug, fields: Object.keys(e) });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSubmitting(true);
    const payload = buildPayload();
    partialSavedRef.current = true;
    try {
      const { band, score } = scoreLead(payload);
      track(bandEvent(band), { vertical: vertical.slug, score, context: "stresstest" });
      const { percentage } = computeCompleteness(payload);
      track("partial_lead_saved", { vertical: vertical.slug, completion: percentage });
      track("stresstest_contact_captured", { vertical: vertical.slug });
      track("stresstest_lead_saved", { vertical: vertical.slug });
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      /* lead is best-effort; the form is a second chance */
    }
    setSubmitting(false);
    setUnlocked(true);
  };

  const onCta = () => {
    track("stresstest_cta", { vertical: vertical.slug, tier: result.tier });
    try {
      sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify(
          buildPrefill(answers as StressAnswers, vertical.slug, {
            firstName: contact.firstName.trim() || undefined,
            businessName: contact.businessName.trim() || undefined,
            phone: contact.phone.trim() || undefined,
            email: contact.email.trim() || undefined,
            marketingConsent: contact.marketingConsent,
          }),
        ),
      );
    } catch {
      /* ignore */
    }
    document.querySelector("#prequalify")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const errorList = Object.values(errors).filter(Boolean);
  const progress = Math.round(((stepIdx + (answered ? 1 : 0)) / STRESS_STEPS.length) * 100);

  return (
    <section id="estimate" className="scroll-mt-16 bg-white py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift">
          {/* INTRO */}
          {phase === "intro" && (
            <div className="p-7 text-center sm:p-10">
              <p className="eyebrow">{STRESS_INTRO.eyebrow}</p>
              <h2 className="mx-auto mt-2 max-w-xl text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
                {STRESS_INTRO.headline}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-600">{STRESS_INTRO.subhead}</p>
              <button type="button" onClick={start} className="btn-primary mt-7">
                {STRESS_INTRO.startLabel} →
              </button>
              <div className="mx-auto mt-5 max-w-md">
                <DisclaimerBlock variant="line" />
              </div>
            </div>
          )}

          {/* STEPS */}
          {phase === "step" && step && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Step {stepIdx + 1} of {STRESS_STEPS.length}</span>
                <span>Your profile: {progress}% built</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>

              {stepIdx === 0 && vertical.cashFlowSignature && (
                <figure className="mt-6 rounded-xl border-l-4 border-accent-500 bg-accent-50/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Sound familiar?</p>
                  <blockquote className="mt-1 text-sm italic leading-relaxed text-slate-700">
                    &ldquo;{vertical.cashFlowSignature}&rdquo;
                  </blockquote>
                </figure>
              )}

              <div className="mt-6">
                <RadioCards
                  legend={step.prompt}
                  help={step.help}
                  options={step.options}
                  value={currentValue}
                  onChange={(v: string) => choose(step.field, v)}
                  columns={step.columns ?? 1}
                />
              </div>

              <div aria-live="polite" className="min-h-[1.5rem]">
                {answered && step.mirror[currentValue!] && (
                  <p className="mt-4 text-sm font-medium text-brand-800">{step.mirror[currentValue!]}</p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                {stepIdx > 0 ? (
                  <button type="button" onClick={back} className="text-sm font-medium text-slate-500 hover:text-slate-800">
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" onClick={next} disabled={!answered} className="btn-primary">
                  {stepIdx < STRESS_STEPS.length - 1 ? "Next" : "See my read"}
                </button>
              </div>
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <div>
              {/* Free read: exposure + pressure points */}
              <div className="bg-brand-900 p-6 text-white sm:p-9" aria-live="polite">
                <p className="text-sm font-medium text-accent-300">{STRESS_TEASER.eyebrow}</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight font-display sm:text-3xl">{reveal.headline}</h2>
                <p className="mt-2 max-w-xl text-brand-100">{reveal.body}</p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{STRESS_TEASER.meterLabel}</span>
                    <span className="text-brand-200"><AnimatedNumber value={result.exposure} /> / 100</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
                    <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${METER[result.tier]}`} style={{ width: `${Math.max(result.exposure, 6)}%` }} />
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {result.pressurePoints.map((p, i) => (
                    <Reveal key={p} delay={i * 120}>
                      <li className="flex items-start gap-3 text-sm text-brand-100">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent-400" />
                        {p}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              {/* Gate OR payoff */}
              {!unlocked ? (
                <div className="p-6 sm:p-9">
                  {/* honeypot */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    defaultValue=""
                    onChange={(e) => { hpRef.current = e.target.value; }}
                    style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                  />
                  <p className="eyebrow">{STRESS_CONTACT.headline}</p>
                  <h3 className="mt-2 text-xl font-bold text-brand-900 font-display">{STRESS_CONTACT.sub}</h3>

                  {errorList.length > 0 && (
                    <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300">
                      <p className="font-semibold">Please fix the following:</p>
                      <ul className="mt-1 list-disc pl-5">
                        {errorList.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <TextField label={STRESS_CONTACT.fields.firstName.label} value={contact.firstName} onChange={(v) => setC("firstName", v)} autoComplete="given-name" error={errors.firstName} help={STRESS_CONTACT.fields.firstName.help} />
                    <TextField label={STRESS_CONTACT.fields.businessName.label} value={contact.businessName} onChange={(v) => setC("businessName", v)} autoComplete="organization" error={errors.businessName} help={STRESS_CONTACT.fields.businessName.help} />
                    <TextField label={STRESS_CONTACT.fields.phone.label} type="tel" inputMode="tel" value={contact.phone} onChange={(v) => setC("phone", v)} autoComplete="tel" error={errors.phone} help={STRESS_CONTACT.fields.phone.help} />
                    <TextField label={STRESS_CONTACT.fields.email.label} type="email" inputMode="email" value={contact.email} onChange={(v) => setC("email", v)} autoComplete="email" help={STRESS_CONTACT.fields.email.help} />
                  </div>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      checked={contact.marketingConsent}
                      onChange={(e) => setC("marketingConsent", e.target.checked)}
                      className="mt-0.5 h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>
                      {STRESS_CONTACT.consent.replace("FundVella", SITE_NAME)} <span className="text-slate-400">({STRESS_CONTACT.consentNote})</span>
                    </span>
                  </label>

                  <button type="button" onClick={submitContact} disabled={submitting} className="btn-primary mt-6 w-full">
                    {submitting ? "One moment…" : STRESS_CONTACT.button}
                  </button>
                  <p className="mt-3 text-center text-sm font-medium text-brand-800">{STRESS_CONTACT.nudge}</p>
                  <p className="mt-1 text-center text-xs text-slate-500">{STRESS_CONTACT.reassure}</p>
                </div>
              ) : (
                <div className="p-6 sm:p-9">
                  {contact.firstName && (
                    <p className="text-sm font-semibold text-accent-700">Here is your plan, {contact.firstName}.</p>
                  )}

                  <div className="mt-3 rounded-2xl border border-accent-200 bg-accent-50/50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{STRESS_PAYOFF.fixTitle}</p>
                    <p className="mt-1 text-sm font-medium text-brand-900">{fix}</p>
                  </div>

                  <p className="eyebrow mt-7">Your best match</p>
                  <h3 className="mt-2 text-xl font-bold text-brand-900 font-display">{fit.title}</h3>
                  <p className="mt-2 text-slate-600">{fit.rationale}</p>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-brand-50/50 p-5 sm:p-6">
                    <p className="font-semibold text-brand-900">{PAYBACK_CLOSE.title}</p>
                    <ul className="mt-3 space-y-2.5">
                      {PAYBACK_CLOSE.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-slate-700">
                          <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                          </svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button type="button" onClick={onCta} className="btn-primary mt-7 w-full sm:w-auto">
                    {STRESS_PAYOFF.ctaLabel} →
                  </button>
                  <p className="mt-3 text-sm font-medium text-brand-800">{STRESS_PAYOFF.ctaSub}</p>
                  <p className="mt-2 text-xs text-slate-500">{STRESS_PAYOFF.disclaimer}</p>
                  <button type="button" onClick={back} className="mt-4 block text-sm font-medium text-slate-400 hover:text-slate-700">
                    ← Change an answer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
