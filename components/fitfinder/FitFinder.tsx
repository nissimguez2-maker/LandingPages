"use client";

/**
 * FitFinder — the tap-through "find your fit" quiz + result screen.
 *
 * This ROUTES; it does not score. The pure router (lib/fitRouting.ts) maps the
 * collected answers to a ProductId; the result screen pulls the product's name +
 * body from content/productsConfig.ts (the single product source of truth) and
 * shows a compliant "why this fits". On the CTA we save the prefill (with the
 * recommendedProduct + fit flags) and navigate to the result's ctaRoute.
 *
 * Compliance (docs/product-matrix.md §5): no promised approval/rate/number; the
 * not-yet path routes to the real credit runway, never a dead end.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { RadioCards } from "@/components/prequal/Fields";
import Reveal from "@/components/motion/Reveal";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import Icon from "@/components/icons/Icon";
import { routeFit, buildFitPrefill, type FitAnswers, type FitResult } from "@/lib/fitRouting";
import { saveApplicationPrefill } from "@/lib/application";
import { getProductById } from "@/content/productsConfig";
import { track } from "@/lib/analytics";
import {
  FIT_PAGE,
  FIT_STEPS,
  FIT_RESULT_COPY,
  FIT_RESULT_FOOTNOTE,
  type FitStep,
} from "@/content/fitFinder";

type Phase = "quiz" | "result";

/** Map a yes/no option value to the boolean the router expects. */
function toBool(v?: string): boolean | undefined {
  if (v === "yes") return true;
  if (v === "no") return false;
  return undefined;
}

/** Derive the FitAnswers the router consumes from the raw string answers. */
function toFitAnswers(raw: Record<string, string>): FitAnswers {
  return {
    useOfFunds: (raw.useOfFunds as FitAnswers["useOfFunds"]) || undefined,
    monthlyRevenue: (raw.monthlyRevenue as FitAnswers["monthlyRevenue"]) || undefined,
    timeInBusiness: (raw.timeInBusiness as FitAnswers["timeInBusiness"]) || undefined,
    creditBand: (raw.creditBand as FitAnswers["creditBand"]) || undefined,
    ownsRealEstateEquity: toBool(raw.ownsRealEstateEquity),
    hasUnpaidInvoices: toBool(raw.hasUnpaidInvoices),
    // A recurring use-of-funds reads as an ongoing need (line-of-credit signal).
    recurringNeed: raw.useOfFunds === "working_capital" || raw.useOfFunds === "marketing",
    // Patient/large is opt-in elsewhere; the quiz keeps it false (SBA stays last-resort).
    patientLargeNeed: false,
  };
}

export default function FitFinder() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step: FitStep = FIT_STEPS[stepIdx];
  const total = FIT_STEPS.length;

  const result: FitResult = useMemo(() => routeFit(toFitAnswers(answers)), [answers]);
  const product = getProductById(result.productId);
  const resultCopy = FIT_RESULT_COPY[result.productId];

  const setAnswer = (id: string, value: string) => {
    if (!started) {
      setStarted(true);
      track("cta_clicked", { location: "fitfinder", action: "fitfinder_started" });
    }
    setAnswers((prev) => ({ ...prev, [id]: value }));
    advance();
  };

  const advance = () => {
    if (stepIdx < total - 1) {
      setStepIdx((i) => i + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setPhase("result");
    const r = routeFit(toFitAnswers(answers));
    track("cta_clicked", {
      location: "fitfinder",
      action: "fitfinder_routed",
      product: r.productId,
      route: r.ctaRoute,
    });
  };

  const back = () => {
    if (phase === "result") {
      setPhase("quiz");
      return;
    }
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const skip = () => advance();

  const onPrimaryCta = () => {
    if (submitting) return;
    setSubmitting(true);
    const fitAnswers = toFitAnswers(answers);
    const prefill = buildFitPrefill(fitAnswers, result, FIT_PAGE.defaultVertical);
    saveApplicationPrefill(prefill);
    track("cta_clicked", {
      location: "fitfinder",
      action: "fitfinder_cta",
      product: result.productId,
      route: result.ctaRoute,
    });
    router.push(result.ctaRoute);
  };

  /* ── Result screen ──────────────────────────────────────────────────────── */
  if (phase === "result") {
    return (
      <Reveal>
        <div className="rounded-2xl bg-white p-6 shadow-lift sm:p-8">
          <p className="eyebrow">Your best-fit option</p>
          <h2 className="mt-2 text-2xl font-bold text-brand-900 font-display">{result.headline}</h2>

          <div className="mt-5 flex items-start gap-4 rounded-xl bg-brand-50/60 p-5">
            {product && (
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-[rgb(var(--accent-cta))] text-white">
                <Icon name={product.icon} className="h-5 w-5" />
              </span>
            )}
            <div>
              <h3 className="font-semibold text-brand-900">{product?.name ?? "Working capital"}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{product?.body}</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-brand-900">Why this fits you</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{result.why}</p>
          </div>

          {product?.complianceNote && (
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
              {product.complianceNote}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={onPrimaryCta} disabled={submitting} className="btn-primary">
              {resultCopy.ctaLabel}
            </button>
            <Link
              href="/products"
              className="text-sm font-semibold text-accent-700 underline-offset-2 hover:underline"
            >
              See all funding options
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">{resultCopy.reassurance}</p>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={back}
              className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
            >
              ← Change my answers
            </button>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-400">{FIT_RESULT_FOOTNOTE}</p>
        </div>
      </Reveal>
    );
  }

  /* ── Quiz screen ────────────────────────────────────────────────────────── */
  const progress = Math.round(((stepIdx + (started ? 0 : 0)) / total) * 100);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lift sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Step {stepIdx + 1} of {total}
        </p>
        {stepIdx > 0 && (
          <button
            type="button"
            onClick={back}
            className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[rgb(var(--accent-cta))] transition-all duration-300"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-6">
        <RadioCards
          legend={step.legend}
          help={step.help}
          options={step.options}
          value={answers[step.id]}
          onChange={(v) => setAnswer(step.id, v)}
          columns={step.columns ?? 2}
          name={step.id}
        />
      </div>

      {step.optional && (
        <div className="mt-5">
          <button
            type="button"
            onClick={skip}
            className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
          >
            Skip this — not sure
          </button>
        </div>
      )}

      <div className="mt-6">
        <DisclaimerBlock variant="line" />
      </div>
    </div>
  );
}
