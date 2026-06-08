"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LeadData, VerticalConfig, AmountValue, BankStatementsValue, Option } from "@/lib/types";
import { AMOUNT_OPTIONS, BANK_STATEMENTS_OPTIONS } from "@/lib/types";
import { runStressTest, buildPrefill, fixFirst, type StressAnswers } from "@/lib/stressTest";
import {
  STRESS_INTRO,
  USE_OPTIONS,
  USE_MIRROR,
  SWIPE_CARDS,
  REVENUE_STEP,
  TIME_STEP,
  URGENCY_STEP,
  STRESS_TEASER,
  TIER_REVEAL,
  FIT_COPY,
  PAYBACK_CLOSE,
  STRESS_CONTACT,
  STRESS_PAYOFF,
  STRESS_ENRICH,
} from "@/content/stressTest";
import { track, identifyLead } from "@/lib/analytics";
import { scoreLead, bandEvent } from "@/lib/leadScoring";
import { computeCompleteness } from "@/lib/completeness";
import { getStoredUtm } from "@/lib/utm";
import { SITE_NAME } from "@/lib/site";
import { RadioCards, TextField } from "./prequal/Fields";
import AnimatedNumber from "./motion/AnimatedNumber";
import Reveal from "./motion/Reveal";
import DisclaimerBlock from "./DisclaimerBlock";
import SwipePoll from "./stresstest/SwipePoll";
import { CALCOM_ENABLED, CALCOM_HANDLE, CALCOM_NAMESPACE, getCalNs } from "@/lib/calcom";
import BookCallInline from "./BookCallInline";
import BookCallFloating from "./BookCallFloating";

const emailOk = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v?: string) => !!v && v.replace(/\D/g, "").length >= 10;

const METER: Record<string, string> = {
  resilient: "bg-emerald-400",
  exposed: "bg-amber-400",
  stretched: "bg-rose-400",
};
const STEPS = 5;

type Phase = "intro" | "step" | "result";
interface Contact {
  firstName: string;
  businessName: string;
  phone: string;
  email: string;
  marketingConsent: boolean;
}

export default function CashFlowStressTest({ vertical }: { vertical: VerticalConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pollResponses, setPollResponses] = useState<Record<string, string>>({});

  const [unlocked, setUnlocked] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [contact, setContact] = useState<Contact>({ firstName: "", businessName: "", phone: "", email: "", marketingConsent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // optional enrichment
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [enrichDone, setEnrichDone] = useState(false);
  const [amountNeeded, setAmount] = useState<AmountValue | undefined>();
  const [bankStatements, setBank] = useState<BankStatementsValue | undefined>();
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");

  const startedRef = useRef(false);
  const shownRef = useRef(false);
  const contactShownRef = useRef(false);
  const partialSavedRef = useRef(false);
  const bookedRef = useRef(false);
  const exitFiredRef = useRef(false);
  const hpRef = useRef("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const calTriggerRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const viewedRef = useRef(false);
  const confirmedRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contactRef = useRef(contact);
  contactRef.current = contact;
  useEffect(() => () => { if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); }, []);

  const result = useMemo(() => runStressTest(answers as StressAnswers), [answers]);
  const fix = useMemo(() => fixFirst(answers as StressAnswers), [answers]);
  const reveal = TIER_REVEAL[result.tier];
  const fit = FIT_COPY[result.fitKey];

  // Move focus to the new step / result heading (keyboard + screen reader + tall phones).
  useEffect(() => {
    if (phase === "intro") return;
    headingRef.current?.focus();
  }, [phase, stepIdx, unlocked]);

  const labelFor = (opts: readonly { value: string; label: string }[], v?: string) => opts.find((o) => o.value === v)?.label;

  const buildContact = useCallback(
    (extra?: Partial<LeadData>): Partial<LeadData> => ({
      firstName: contact.firstName.trim() || undefined,
      businessName: contact.businessName.trim() || undefined,
      phone: contact.phone.trim() || undefined,
      email: contact.email.trim() || undefined,
      marketingConsent: contact.marketingConsent,
      pollResponses,
      ...extra,
    }),
    [contact, pollResponses],
  );

  const buildPayload = useCallback(
    (partial: boolean, extra?: Partial<LeadData>): LeadData & { honeypot?: string } => ({
      ...buildPrefill(answers as StressAnswers, vertical.slug, buildContact(extra)),
      verticalTitle: vertical.title,
      sourcePage: typeof window !== "undefined" ? window.location.href : undefined,
      utm: getStoredUtm(),
      partial,
      honeypot: hpRef.current,
    }),
    [answers, vertical.slug, vertical.title, buildContact],
  );

  useEffect(() => {
    const handler = () => {
      if (partialSavedRef.current) return;
      if (!phoneOk(contact.phone) && !emailOk(contact.email)) return;
      try {
        navigator.sendBeacon("/api/lead", new Blob([JSON.stringify(buildPayload(true))], { type: "application/json" }));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [buildPayload, contact.phone, contact.email]);

  // Fallback capture: when someone books through the cal.com bubble or popup
  // instead of filling the form, still land the lead in the CRM using the email
  // cal.com collected. Fires once.
  const onCalBooked = useCallback(
    (info: { email?: string; name?: string }) => {
      if (bookedRef.current) return;
      bookedRef.current = true;
      track("stresstest_call_booked", { vertical: vertical.slug });
      const parts = (info.name || "").trim().split(/\s+/).filter(Boolean);
      const extra: Partial<LeadData> = {
        ...(info.email && !contact.email.trim() ? { email: info.email } : {}),
        ...(parts[0] && !contact.firstName.trim() ? { firstName: parts[0] } : {}),
        ...(parts.length > 1 ? { lastName: parts.slice(1).join(" ") } : {}),
        notes: "Booked a discovery call via cal.com.",
      };
      try {
        const payload = buildPayload(true, extra);
        if (payload.email || payload.phone) {
          partialSavedRef.current = true;
          void fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
        }
      } catch {
        /* best effort */
      }
    },
    [buildPayload, contact.email, contact.firstName, vertical.slug],
  );

  // Fire booking_confirmed exactly once per booking, no matter which surface
  // (inline embed, floating bubble, or gate popup) reports it.
  const onBookingConfirmed = useCallback(
    (source: string) => {
      if (confirmedRef.current) return;
      confirmedRef.current = true;
      track("booking_confirmed", { vertical: vertical.slug, source });
    },
    [vertical.slug],
  );

  // Exit-intent escalation (desktop): if a visitor is at the contact step and
  // looks like they're leaving without giving info, open the cal.com popup once
  // so we get a booked call instead of a bounce. Suppressed while they are
  // actively filling the form, and only armed after a short dwell so it never
  // hijacks someone mid-type. Mobile relies on the always-on bubble.
  useEffect(() => {
    if (!CALCOM_ENABLED || phase !== "result" || unlocked) return;
    getCalNs(); // make sure the embed + namespace are primed for the trigger
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 4000);
    const open = () => {
      if (!armed || exitFiredRef.current || partialSavedRef.current || bookedRef.current) return;
      const ae = document.activeElement;
      if (ae && ["INPUT", "TEXTAREA", "SELECT"].includes(ae.tagName)) return;
      const c = contactRef.current;
      if (c.firstName || c.businessName || c.phone || c.email) return;
      exitFiredRef.current = true;
      track("booking_exit_intent", { vertical: vertical.slug });
      calTriggerRef.current?.click();
    };
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) open();
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => { clearTimeout(armTimer); document.removeEventListener("mouseout", onMouseOut); };
  }, [phase, unlocked, vertical.slug]);

  const start = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("stresstest_started", { vertical: vertical.slug });
    }
    setPhase("step");
  };

  const skipToInfo = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("stresstest_started", { vertical: vertical.slug, skipped: true });
    }
    setSkipped(true);
    setPhase("result");
  };

  const goToResult = () => {
    track("stresstest_completed", { vertical: vertical.slug });
    setPhase("result");
  };

  const nextFrom = (id: string, value?: string) => {
    track("stresstest_step", { vertical: vertical.slug, step: id, value });
    if (stepIdx < STEPS - 1) setStepIdx((i) => i + 1);
    else goToResult();
  };

  const back = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (phase === "result") {
      setUnlocked(false);
      setPhase("step");
      // A skipper never answered the questions, so send them to Q1, not Q5.
      if (skipped) { setSkipped(false); setStepIdx(0); }
      else setStepIdx(STEPS - 1);
      return;
    }
    setStepIdx((i) => Math.max(0, i - 1));
  };

  // swipe (the one debt question)
  const onSwipeComplete = (resp: Record<string, string>) => {
    setPollResponses(resp);
    setAnswers((a) => ({ ...a, existingDebt: resp.debt }));
    track("stresstest_step", { vertical: vertical.slug, step: "debt" });
    if (stepIdx < STEPS - 1) setStepIdx((i) => i + 1);
    else goToResult();
  };
  // tap
  const choose = (field: string, value: string) => setAnswers((a) => ({ ...a, [field]: value }));
  // tap + auto-advance: the answer IS the Next, with a short beat to read the mirror.
  const chooseAndAdvance = (field: string, value: string, stepId: string) => {
    choose(field, value);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => nextFrom(stepId, value), 550);
  };

  // View / result-shown / contact-shown events fire from effects, never during render.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || viewedRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          track("stresstest_viewed", { vertical: vertical.slug });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [vertical.slug]);

  useEffect(() => {
    if (phase !== "result") return;
    if (!shownRef.current) {
      shownRef.current = true;
      track("stresstest_result_shown", { vertical: vertical.slug, tier: result.tier, exposure: result.exposure, strength: result.strength });
    }
    if (!unlocked && !contactShownRef.current) {
      contactShownRef.current = true;
      track("stresstest_contact_shown", { vertical: vertical.slug });
    }
  }, [phase, unlocked, result.tier, result.exposure, result.strength, vertical.slug]);

  const setC = (k: keyof Contact, v: string | boolean) => {
    setContact((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const submitContact = async () => {
    if (submitting) return;
    const e: Record<string, string> = {};
    if (!contact.firstName.trim()) e.firstName = "Please add your first name.";
    if (!contact.businessName.trim()) e.businessName = "Please add your business name.";
    if (!phoneOk(contact.phone) && !emailOk(contact.email)) e.phone = "Add a phone or an email so we can send your plan.";
    setErrors(e);
    if (Object.keys(e).length) {
      track("stresstest_validation_error", { vertical: vertical.slug, fields: Object.keys(e) });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitting(true);
    const payload = buildPayload(true);
    partialSavedRef.current = true;
    const { band, score } = scoreLead(payload);
    track(bandEvent(band), { vertical: vertical.slug, score, context: "stresstest" });
    identifyLead({ lead: true, band, vertical: vertical.slug });
    track("stresstest_contact_captured", { vertical: vertical.slug });
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
      if (res.ok) {
        track("partial_lead_saved", { vertical: vertical.slug, completion: computeCompleteness(payload).percentage });
        track("stresstest_lead_saved", { vertical: vertical.slug, band, score });
      }
    } catch {
      /* best effort */
    }
    setSubmitting(false);
    setUnlocked(true);
  };

  const saveEnrichment = async () => {
    const extra: Partial<LeadData> = {
      ...(amountNeeded ? { amountNeeded } : {}),
      ...(bankStatements ? { canProvideBankStatements: bankStatements } : {}),
      ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
      ...(state.trim() ? { state: state.trim() } : {}),
    };
    setEnrichDone(true);
    track("stresstest_enrichment_saved", { vertical: vertical.slug });
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildPayload(false, extra)), keepalive: true });
    } catch {
      /* best effort */
    }
  };

  const errorList = Object.values(errors).filter(Boolean);
  const progress = Math.round(((stepIdx + 1) / STEPS) * 100);
  const calNotes = skipped
    ? `${vertical.title} | direct booking`
    : `${vertical.title} | ${reveal.label} | needs: ${labelFor(USE_OPTIONS, answers.useOfFunds) ?? ""}`;

  const summaryLine = (() => {
    const pain = labelFor(USE_OPTIONS, answers.useOfFunds)?.toLowerCase();
    const rev = labelFor(REVENUE_STEP.options, answers.monthlyRevenue);
    const time = labelFor(TIME_STEP.options, answers.timeInBusiness);
    const parts: string[] = [];
    if (pain) parts.push(`you put ${pain} first`);
    if (rev) parts.push(`about ${rev} a month`);
    if (time) parts.push(`${time.toLowerCase()} in business`);
    return parts.length ? `Based on your answers: ${parts.join(", ")}. That is a timing gap, not a sales problem.` : "";
  })();

  return (
    <section ref={sectionRef} id="estimate" className="scroll-mt-16 bg-white py-10 sm:py-14">
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
              <div className="mt-3">
                <button type="button" onClick={skipToInfo} className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
                  Prefer to skip? Just leave your info{CALCOM_ENABLED ? " or book a call" : ""}
                </button>
              </div>
              <div className="mx-auto mt-5 max-w-md">
                <DisclaimerBlock variant="line" />
              </div>
            </div>
          )}

          {/* STEPS */}
          {phase === "step" && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Question {stepIdx + 1} of {STEPS}</span>
                <span>Your profile: {progress}% built</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>

              {/* Q1 use of funds (tap) */}
              {stepIdx === 0 && (
                <div className="mt-6">
                  {vertical.cashFlowSignature && (
                    <figure className="mb-5 rounded-xl border-l-4 border-accent-500 bg-accent-50/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Sound familiar?</p>
                      <blockquote className="mt-1 text-sm italic leading-relaxed text-slate-700">&ldquo;{vertical.cashFlowSignature}&rdquo;</blockquote>
                    </figure>
                  )}
                  <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">If you had more cash this week, where would it go first?</h2>
                  <RadioCards legend="If you had more cash this week, where would it go first?" options={USE_OPTIONS as readonly Option[]} value={answers.useOfFunds} onChange={(v: string) => chooseAndAdvance("useOfFunds", v, "use")} columns={1} />
                  <p className="mt-4 min-h-[1.5rem] text-sm font-medium text-brand-800">{answers.useOfFunds && USE_MIRROR[answers.useOfFunds]}</p>
                </div>
              )}

              {/* Q2 revenue (tap) */}
              {stepIdx === 1 && (
                <div className="mt-6">
                  <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">{REVENUE_STEP.prompt}</h2>
                  <RadioCards legend={REVENUE_STEP.prompt} help={REVENUE_STEP.help} options={REVENUE_STEP.options as readonly Option[]} value={answers.monthlyRevenue} onChange={(v: string) => chooseAndAdvance("monthlyRevenue", v, "revenue")} columns={1} />
                  <p className="mt-4 min-h-[1.5rem] text-sm font-medium text-brand-800">{answers.monthlyRevenue && REVENUE_STEP.mirror[answers.monthlyRevenue]}</p>
                  <div className="mt-4">
                    <button type="button" onClick={back} className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-800">← Back</button>
                  </div>
                </div>
              )}

              {/* Q3 time (tap) */}
              {stepIdx === 2 && (
                <div className="mt-6">
                  <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">{TIME_STEP.prompt}</h2>
                  <RadioCards legend={TIME_STEP.prompt} help={TIME_STEP.help} options={TIME_STEP.options as readonly Option[]} value={answers.timeInBusiness} onChange={(v: string) => chooseAndAdvance("timeInBusiness", v, "time")} columns={2} />
                  <p className="mt-4 min-h-[1.5rem] text-sm font-medium text-brand-800">{answers.timeInBusiness && TIME_STEP.mirror[answers.timeInBusiness]}</p>
                  <div className="mt-4">
                    <button type="button" onClick={back} className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-800">← Back</button>
                  </div>
                </div>
              )}

              {/* Q4 existing debt (the one swipe) */}
              {stepIdx === 3 && (
                <div className="mt-6">
                  <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold text-brand-900 focus:outline-none">One quick yes or no</h2>
                  <div className="mt-4">
                    <SwipePoll cards={SWIPE_CARDS} onComplete={onSwipeComplete} />
                  </div>
                  <div className="mt-4">
                    <button type="button" onClick={back} className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-800">← Back</button>
                  </div>
                </div>
              )}

              {/* Q5 urgency (tap) */}
              {stepIdx === 4 && (
                <div className="mt-6">
                  <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">{URGENCY_STEP.prompt}</h2>
                  <RadioCards legend={URGENCY_STEP.prompt} help={URGENCY_STEP.help} options={URGENCY_STEP.options as readonly Option[]} value={answers.urgency} onChange={(v: string) => chooseAndAdvance("urgency", v, "urgency")} columns={2} />
                  <p className="mt-4 min-h-[1.5rem] text-sm font-medium text-brand-800">{answers.urgency && URGENCY_STEP.mirror[answers.urgency]}</p>
                  <div className="mt-4">
                    <button type="button" onClick={back} className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-800">← Back</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <div>
              {/* Free read */}
              {!skipped && (
              <div className="bg-brand-900 p-6 text-white sm:p-9" aria-live="polite">
                <p className="text-sm font-medium text-accent-300">{STRESS_TEASER.eyebrow}</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-bold tracking-tight font-display focus:outline-none sm:text-3xl">{reveal.headline}</h2>
                <p className="mt-2 max-w-xl text-brand-100">{reveal.body}</p>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{STRESS_TEASER.meterLabel}</span>
                    <span className="text-brand-200"><AnimatedNumber value={result.strength} /> / 100</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
                    <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${METER[result.tier]}`} style={{ width: `${Math.max(result.strength, 6)}%` }} />
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
              )}

              {!unlocked ? (
                <div className="p-6 sm:p-9">
                  {/* Fallback capture: a floating cal.com bubble + exit-intent popup so a
                      visitor who will not type can still book a call instead of bouncing. */}
                  {CALCOM_ENABLED && <BookCallFloating vertical={vertical.slug} notes={calNotes} onBooked={onCalBooked} onConfirmed={() => onBookingConfirmed("floating")} />}

                  {/* cost of waiting, on screen while they decide */}
                  <div className="rounded-2xl border border-slate-200 bg-brand-50/50 p-5 sm:p-6">
                    <p className="font-semibold text-brand-900">{PAYBACK_CLOSE.title}</p>
                    <ul className="mt-3 space-y-2.5">
                      {PAYBACK_CLOSE.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-slate-700">
                          <svg className="mt-0.5 h-5 w-5 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" /></svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* honeypot */}
                  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" onChange={(e) => { hpRef.current = e.target.value; }} style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }} />

                  <p className="eyebrow mt-7">{STRESS_CONTACT.headline}</p>
                  <h3 className="mt-1 text-xl font-bold text-brand-900 font-display">{STRESS_CONTACT.sub}</h3>
                  {summaryLine && <p className="mt-2 text-sm text-slate-600">{summaryLine}</p>}

                  {errorList.length > 0 && (
                    <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300">
                      <p className="font-semibold">Please fix the following:</p>
                      <ul className="mt-1 list-disc pl-5">{errorList.map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </div>
                  )}

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <TextField label={STRESS_CONTACT.fields.firstName.label} value={contact.firstName} onChange={(v) => setC("firstName", v)} autoComplete="given-name" error={errors.firstName} help={STRESS_CONTACT.fields.firstName.help} />
                    <TextField label={STRESS_CONTACT.fields.businessName.label} value={contact.businessName} onChange={(v) => setC("businessName", v)} autoComplete="organization" error={errors.businessName} help={STRESS_CONTACT.fields.businessName.help} />
                    <TextField label={STRESS_CONTACT.fields.phone.label} type="tel" inputMode="tel" value={contact.phone} onChange={(v) => setC("phone", v)} autoComplete="tel" error={errors.phone} help={STRESS_CONTACT.fields.phone.help} />
                    <TextField label={STRESS_CONTACT.fields.email.label} type="email" inputMode="email" value={contact.email} onChange={(v) => setC("email", v)} autoComplete="email" help={STRESS_CONTACT.fields.email.help} />
                  </div>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
                    <input type="checkbox" checked={contact.marketingConsent} onChange={(e) => setC("marketingConsent", e.target.checked)} className="mt-0.5 h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <span>{STRESS_CONTACT.consent.replace("FundVella", SITE_NAME)} <span className="text-slate-400">({STRESS_CONTACT.consentNote})</span></span>
                  </label>

                  <button type="button" onClick={submitContact} disabled={submitting} className="btn-primary mt-6 w-full">{submitting ? "One moment…" : STRESS_CONTACT.button}</button>
                  <p className="mt-2 text-center text-xs text-slate-500">{STRESS_CONTACT.reassure}</p>

                  {CALCOM_ENABLED && (
                    <p className="mt-4 text-center text-sm text-slate-500">
                      Rather not type it out?{" "}
                      <button
                        ref={calTriggerRef}
                        type="button"
                        data-cal-namespace={CALCOM_NAMESPACE}
                        data-cal-link={CALCOM_HANDLE}
                        data-cal-config={JSON.stringify({ layout: "month_view", notes: calNotes })}
                        onClick={() => track("booking_opened", { vertical: vertical.slug, source: "gate-link" })}
                        className="font-semibold text-accent-700 underline-offset-2 hover:underline"
                      >
                        Book a quick call instead
                      </button>
                    </p>
                  )}

                  <button type="button" onClick={back} className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-slate-400 hover:text-slate-700">← Change an answer</button>
                </div>
              ) : (
                <div className="p-6 sm:p-9">
                  {contact.firstName && <p className="text-sm font-semibold text-accent-700">Here is your plan, {contact.firstName}.</p>}

                  <div className="mt-3 rounded-2xl border border-accent-200 bg-accent-50/50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{STRESS_PAYOFF.fixTitle}</p>
                    <p className="mt-1 text-sm font-medium text-brand-900">{fix}</p>
                  </div>

                  <p className="eyebrow mt-7">Your best match</p>
                  <h3 className="mt-2 text-xl font-bold text-brand-900 font-display">{fit.title}</h3>
                  <p className="mt-2 text-slate-600">{fit.rationale}</p>

                  {/* Booking or callback */}
                  <div className="mt-7 rounded-2xl border border-slate-200 bg-brand-50/50 p-5 sm:p-6">
                    {CALCOM_ENABLED ? (
                      <>
                        <p className="font-semibold text-brand-900 font-display">{STRESS_PAYOFF.bookTitle}</p>
                        <p className="mt-1 text-sm text-slate-600">{STRESS_PAYOFF.bookSub}</p>
                        <div className="mt-4">
                          <BookCallInline vertical={vertical.slug} name={contact.firstName} email={contact.email} notes={calNotes} onConfirmed={() => onBookingConfirmed("inline")} />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-brand-900 font-display">{STRESS_PAYOFF.callbackTitle}</p>
                        <p className="mt-1 text-sm text-slate-600">{STRESS_PAYOFF.callbackSub}</p>
                      </>
                    )}
                  </div>

                  {/* Slim optional enrichment */}
                  {enrichDone ? (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                      <p className="font-semibold text-brand-900">{STRESS_ENRICH.doneTitle}</p>
                      <p className="mt-1 text-sm text-slate-600">{STRESS_ENRICH.doneSub}</p>
                    </div>
                  ) : enrichOpen ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 p-5 sm:p-6">
                      <p className="font-semibold text-brand-900">{STRESS_ENRICH.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{STRESS_ENRICH.sub}</p>
                      <div className="mt-4 space-y-4">
                        <RadioCards legend={STRESS_ENRICH.amount} options={AMOUNT_OPTIONS} value={amountNeeded} onChange={(v: AmountValue) => setAmount(v)} columns={2} />
                        <RadioCards legend={STRESS_ENRICH.bank} options={BANK_STATEMENTS_OPTIONS} value={bankStatements} onChange={(v: BankStatementsValue) => setBank(v)} columns={3} />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextField label={STRESS_ENRICH.state.label} value={state} onChange={setState} autoComplete="address-level1" help={STRESS_ENRICH.state.help} />
                          <TextField label={STRESS_ENRICH.lastName.label} value={lastName} onChange={setLastName} autoComplete="family-name" />
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-4">
                        <button type="button" onClick={saveEnrichment} className="btn-primary">{STRESS_ENRICH.saveLabel}</button>
                        <button type="button" onClick={() => setEnrichOpen(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800">{STRESS_ENRICH.skipLabel}</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setEnrichOpen(true)} className="mt-6 text-sm font-semibold text-accent-700 hover:text-accent-800">+ {STRESS_PAYOFF.enrichToggle}</button>
                  )}

                  <p className="mt-6 text-xs text-slate-500">{STRESS_PAYOFF.disclaimer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
