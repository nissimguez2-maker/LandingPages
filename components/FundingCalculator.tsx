"use client";

import { useState } from "react";
import type { VerticalConfig, RevenueValue } from "@/lib/types";
import { DEFAULT_CALCULATOR } from "@/content/landingPagesConfig";
import { track } from "@/lib/analytics";

const PREFILL_KEY = "mca_prefill";

function revenueBand(monthly: number): RevenueValue {
  if (monthly < 10000) return "under_10k";
  if (monthly < 20000) return "10k_20k";
  if (monthly < 50000) return "20k_50k";
  if (monthly < 150000) return "50k_150k";
  return "150k_plus";
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * Client-only estimate tool. Produces an ESTIMATE RANGE from monthly deposits —
 * explicitly NOT an offer. No API, no secrets. Can prefill the prequal form.
 */
export default function FundingCalculator({ vertical }: { vertical: VerticalConfig }) {
  const cfg = { ...DEFAULT_CALCULATOR, ...(vertical.calculator ?? {}) };
  const [raw, setRaw] = useState("");

  const monthly = Number(raw.replace(/[^0-9.]/g, ""));
  const valid = Number.isFinite(monthly) && monthly >= cfg.minMonthly;
  const clamped = Math.min(Math.max(monthly, cfg.minMonthly), cfg.maxMonthly);
  const low = Math.round((clamped * cfg.lowFactor) / 500) * 500;
  const high = Math.round((clamped * cfg.highFactor) / 500) * 500;

  const onUse = () => {
    if (!valid) return;
    track("calculator_used", { vertical: vertical.slug, monthly, low, high });
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ monthlyRevenue: revenueBand(monthly) }));
    } catch {
      /* ignore */
    }
    const el = document.querySelector("#prequalify");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-content max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-brand-50/40 p-6 shadow-card sm:p-8">
          <p className="eyebrow">Quick estimate</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">
            Estimate a possible funding range
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your average monthly deposits to see a rough range. This is an estimate only — not an
            offer — and actual options depend on underwriting.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="block flex-1">
              <span className="text-sm font-semibold text-brand-900">Average monthly deposits</span>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <span className="text-slate-400">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder="25,000"
                  className="w-full bg-transparent px-2 py-3 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </label>
            <button type="button" onClick={onUse} disabled={!valid} className="btn-primary sm:w-auto">
              Use this & continue
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-brand-100 bg-white p-5 text-center" aria-live="polite">
            {valid ? (
              <>
                <p className="text-sm text-slate-500">Estimated range</p>
                <p className="mt-1 text-3xl font-bold text-brand-900">
                  {usd(low)} – {usd(high)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Estimate only, subject to underwriting and documentation. Not an offer of funding.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Enter at least {usd(cfg.minMonthly)} in monthly deposits to see an estimate.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
