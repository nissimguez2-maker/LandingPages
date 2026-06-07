"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { VerticalConfig } from "@/lib/types";
import { runStressTest, buildPrefill, type StressAnswers } from "@/lib/stressTest";
import {
  STRESS_INTRO,
  STRESS_STEPS,
  TIER_REVEAL,
  FIT_COPY,
  PAYBACK_CLOSE,
  STRESS_CTA,
} from "@/content/stressTest";
import { track } from "@/lib/analytics";
import { RadioCards } from "./prequal/Fields";
import AnimatedNumber from "./motion/AnimatedNumber";
import Reveal from "./motion/Reveal";
import DisclaimerBlock from "./DisclaimerBlock";

const PREFILL_KEY = "mca_prefill";

const METER: Record<string, string> = {
  resilient: "bg-emerald-400",
  exposed: "bg-amber-400",
  stretched: "bg-rose-400",
};

type Phase = "intro" | "step" | "result";

/**
 * Cash-Flow Stress Test — a tap-only diagnostic that surfaces WHY a merchant
 * needs working capital (not how much), captures lead intel, and hands a
 * pre-filled prequal to the form. 100% client-side. No dollar amount, no offer.
 */
export default function CashFlowStressTest({ vertical }: { vertical: VerticalConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const startedRef = useRef(false);
  const shownRef = useRef(false);

  const step = STRESS_STEPS[stepIdx];
  const currentValue = step ? answers[step.field] : undefined;
  const answered = Boolean(currentValue);

  const result = useMemo(() => runStressTest(answers as StressAnswers), [answers]);

  const start = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("stresstest_started", { vertical: vertical.slug });
    }
    setPhase("step");
  };

  const choose = useCallback(
    (field: string, value: string) => setAnswers((prev) => ({ ...prev, [field]: value })),
    [],
  );

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
      setPhase("step");
      return;
    }
    setStepIdx((i) => Math.max(0, i - 1));
  };

  // Fire result_shown once.
  if (phase === "result" && !shownRef.current) {
    shownRef.current = true;
    track("stresstest_result_shown", { vertical: vertical.slug, tier: result.tier, exposure: result.exposure });
  }

  const onCta = () => {
    track("stresstest_cta", { vertical: vertical.slug, tier: result.tier });
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify(buildPrefill(answers as StressAnswers, vertical.slug)));
    } catch {
      /* ignore */
    }
    document.querySelector("#prequalify")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fit = FIT_COPY[result.fitKey];
  const reveal = TIER_REVEAL[result.tier];
  const progress = Math.round(((stepIdx + (answered ? 1 : 0)) / STRESS_STEPS.length) * 100);

  return (
    <section id="estimate" className="scroll-mt-16 bg-white py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift">
          {/* ── INTRO ─────────────────────────────────────────── */}
          {phase === "intro" && (
            <div className="p-7 text-center sm:p-10">
              <p className="eyebrow">{STRESS_INTRO.eyebrow}</p>
              <h2 className="mx-auto mt-2 max-w-xl text-3xl font-bold tracking-tight text-brand-900 font-display sm:text-4xl">
                {STRESS_INTRO.headline}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-600">
                {vertical.calcContext ? `${vertical.calcContext} ` : ""}
                {STRESS_INTRO.subhead}
              </p>
              <button type="button" onClick={start} className="btn-primary mt-7">
                {STRESS_INTRO.startLabel} →
              </button>
              <div className="mx-auto mt-5 max-w-md">
                <DisclaimerBlock variant="line" />
              </div>
            </div>
          )}

          {/* ── STEPS ─────────────────────────────────────────── */}
          {phase === "step" && step && (
            <div className="p-6 sm:p-8">
              {/* progress */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>
                  Step {stepIdx + 1} of {STRESS_STEPS.length}
                </span>
                <span>Building your cash-flow profile…</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>

              {/* Step 1 mirror: the merchant's own cash-flow signature */}
              {stepIdx === 0 && vertical.cashFlowSignature && (
                <figure className="mt-6 rounded-xl border-l-4 border-accent-500 bg-accent-50/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Sound familiar?</p>
                  <blockquote className="mt-1 text-sm italic leading-relaxed text-slate-700">
                    “{vertical.cashFlowSignature}”
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

              {/* mirror reaction */}
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
                  {stepIdx < STRESS_STEPS.length - 1 ? "Continue" : "See my results"}
                </button>
              </div>
            </div>
          )}

          {/* ── RESULT ────────────────────────────────────────── */}
          {phase === "result" && (
            <div>
              <div className="bg-brand-900 p-6 text-white sm:p-9" aria-live="polite">
                <p className="text-sm font-medium text-accent-300">Your cash-flow read</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight font-display sm:text-3xl">{reveal.headline}</h2>
                <p className="mt-2 max-w-xl text-brand-100">{reveal.body}</p>

                {/* exposure meter */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Exposure to a bad week</span>
                    <span className="text-brand-200">
                      <AnimatedNumber value={result.exposure} /> / 100
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ease-out ${METER[result.tier]}`}
                      style={{ width: `${Math.max(result.exposure, 6)}%` }}
                    />
                  </div>
                </div>

                {/* pressure points */}
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

              <div className="p-6 sm:p-9">
                {/* fit */}
                <p className="eyebrow">The usual next move for a profile like yours</p>
                <h3 className="mt-2 text-xl font-bold text-brand-900 font-display">{fit.title}</h3>
                <p className="mt-2 text-slate-600">{fit.rationale}</p>

                {/* payback clarity — the salesy close */}
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
                  {STRESS_CTA} →
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Takes about 2 minutes, and checking won&apos;t affect your credit. No obligation. Estimate only —
                  approval depends on underwriting, and any payments are structured to fit your cash flow.
                </p>
                <button type="button" onClick={back} className="mt-4 block text-sm font-medium text-slate-400 hover:text-slate-700">
                  ← Change an answer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
