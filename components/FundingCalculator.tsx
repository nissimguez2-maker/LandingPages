"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  VerticalConfig,
  TimeInBusinessValue,
  NsfValue,
  ExistingDebtValue,
} from "@/lib/types";
import {
  TIME_IN_BUSINESS_OPTIONS,
  NSF_OPTIONS,
  EXISTING_DEBT_OPTIONS,
} from "@/lib/types";
import { DEFAULT_CALCULATOR } from "@/content/landingPagesConfig";
import { estimateAdvance, calcReadiness, revenueBand } from "@/lib/calculator";
import { track } from "@/lib/analytics";
import { RadioCards } from "./prequal/Fields";
import AnimatedNumber from "./motion/AnimatedNumber";

const PREFILL_KEY = "mca_prefill";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const BAND_LABEL: Record<string, string> = {
  green: "Strong file",
  yellow: "Looks reviewable",
  red: "Worth strengthening",
};
const BAND_DOT: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

/**
 * Gamified readiness engine. Multi-input → live estimated range + an animated
 * readiness meter (same signals as scoreLead) + "boost your range" nudges, then
 * prefills the prequal form. 100% client-side math — no API, no secrets. Every
 * number is an ESTIMATE, never an offer.
 */
export default function FundingCalculator({ vertical }: { vertical: VerticalConfig }) {
  const cfg = useMemo(() => ({ ...DEFAULT_CALCULATOR, ...(vertical.calculator ?? {}) }), [vertical.calculator]);

  const [raw, setRaw] = useState("");
  const [timeInBusiness, setTime] = useState<TimeInBusinessValue | undefined>();
  const [recentNsfs, setNsfs] = useState<NsfValue | undefined>();
  const [existingDebt, setDebt] = useState<ExistingDebtValue | undefined>();
  const interacted = useRef(false);

  const monthly = Number(raw.replace(/[^0-9.]/g, ""));
  const valid = Number.isFinite(monthly) && monthly >= cfg.minMonthly;

  const inputs = { monthly, timeInBusiness, recentNsfs, existingDebt };
  const est = useMemo(() => estimateAdvance(inputs, cfg), [monthly, timeInBusiness, recentNsfs, existingDebt, cfg]);
  const readiness = useMemo(() => calcReadiness(inputs), [monthly, timeInBusiness, recentNsfs, existingDebt]);

  const markInteract = () => {
    if (!interacted.current) {
      interacted.current = true;
      track("calculator_input_changed", { vertical: vertical.slug });
    }
  };

  // Fire a readiness event once a valid estimate is on screen.
  const shownRef = useRef(false);
  useEffect(() => {
    if (valid && !shownRef.current) {
      shownRef.current = true;
      track("calculator_readiness_shown", { vertical: vertical.slug, score: readiness.score, band: readiness.band });
    }
  }, [valid, readiness.score, readiness.band, vertical.slug]);

  const onContinue = () => {
    if (!valid) return;
    track("calculator_used", { vertical: vertical.slug, monthly, low: est.low, high: est.high, readiness: readiness.score });
    try {
      sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({
          monthlyRevenue: revenueBand(monthly),
          ...(timeInBusiness ? { timeInBusiness } : {}),
          ...(recentNsfs ? { recentNsfs } : {}),
          ...(existingDebt ? { existingDebt } : {}),
        }),
      );
    } catch {
      /* ignore */
    }
    const el = document.querySelector("#prequalify");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="estimate" className="scroll-mt-16 bg-white py-16 sm:py-20">
      <div className="container-content max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift">
          <div className="grid lg:grid-cols-2">
            {/* ── Inputs ─────────────────────────────────────────── */}
            <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="eyebrow">Funding estimate</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900 font-display sm:text-3xl">
                How much could you qualify for?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {vertical.calcContext ??
                  "Answer four quick questions for a live estimate and a readiness check. No credit pull, nothing saved until you continue."}
              </p>

              <label className="mt-6 block">
                <span className="text-sm font-semibold text-brand-900">Average monthly deposits</span>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-300 bg-white px-4 text-lg focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100">
                  <span className="text-slate-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={raw}
                    onChange={(e) => {
                      setRaw(e.target.value);
                      markInteract();
                    }}
                    placeholder="25,000"
                    aria-label="Average monthly deposits"
                    className="w-full appearance-none bg-transparent px-2 py-3.5 font-semibold text-slate-900 focus:outline-none"
                  />
                  <span className="whitespace-nowrap text-xs text-slate-400">/ mo</span>
                </div>
              </label>

              <div className="mt-5 space-y-4">
                <RadioCards
                  legend="Time in business"
                  options={TIME_IN_BUSINESS_OPTIONS}
                  value={timeInBusiness}
                  onChange={(v: TimeInBusinessValue) => {
                    setTime(v);
                    markInteract();
                  }}
                  columns={2}
                />
                <RadioCards
                  legend="Recent NSFs or negative days?"
                  options={NSF_OPTIONS}
                  value={recentNsfs}
                  onChange={(v: NsfValue) => {
                    setNsfs(v);
                    markInteract();
                  }}
                  columns={2}
                />
                <RadioCards
                  legend="Existing advances or loans?"
                  options={EXISTING_DEBT_OPTIONS}
                  value={existingDebt}
                  onChange={(v: ExistingDebtValue) => {
                    setDebt(v);
                    markInteract();
                  }}
                  columns={2}
                />
              </div>
            </div>

            {/* ── Results ────────────────────────────────────────── */}
            <div className="bg-brand-900 p-6 text-white sm:p-8" aria-live="polite">
              {valid ? (
                <>
                  <p className="text-sm font-medium text-brand-200">Estimated funding range</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-white font-display">
                    <AnimatedNumber value={est.low} format={usd} /> –{" "}
                    <AnimatedNumber value={est.high} format={usd} />
                  </p>

                  {/* Readiness meter */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <span className={`h-2.5 w-2.5 rounded-full ${BAND_DOT[readiness.band]}`} />
                        {BAND_LABEL[readiness.band]}
                      </span>
                      <span className="text-brand-200">
                        <AnimatedNumber value={readiness.score} /> / 100
                      </span>
                    </div>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-accent-400 transition-[width] duration-700 ease-out"
                        style={{ width: `${readiness.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Typical structure */}
                  <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-white/10 p-3">
                      <dt className="text-brand-200">Typical est. payment</dt>
                      <dd className="mt-0.5 font-semibold">
                        {usd(est.estPaymentLow)}–{usd(est.estPaymentHigh)}/mo
                      </dd>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <dt className="text-brand-200">Remits ~% of deposits</dt>
                      <dd className="mt-0.5 font-semibold">
                        {Math.round(est.holdbackLow * 100)}–{Math.round(est.holdbackHigh * 100)}%
                      </dd>
                    </div>
                  </dl>

                  {/* Boost-your-range nudges */}
                  {readiness.nudges.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-300">
                        Boost your range
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-brand-100">
                        {readiness.nudges.map((n) => (
                          <li key={n} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent-400" />
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button type="button" onClick={onContinue} className="btn-primary mt-7 w-full">
                    Continue with these numbers
                  </button>
                  <p className="mt-3 text-center text-xs text-brand-300">
                    Estimate only — not an offer. Real options depend on underwriting and documentation.
                  </p>
                </>
              ) : (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-lg font-semibold text-white">Enter your monthly deposits</p>
                  <p className="mt-2 text-sm text-brand-200">
                    Add at least {usd(cfg.minMonthly)} in average monthly deposits to see a live estimate and
                    your readiness score. The more you tell us, the sharper it gets.
                  </p>
                  <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-0 rounded-full bg-accent-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
