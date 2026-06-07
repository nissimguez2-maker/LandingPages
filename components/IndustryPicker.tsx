"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { matchIndustry, getActiveVerticals } from "@/content/landingPagesConfig";
import { track } from "@/lib/analytics";

/**
 * Homepage industry router. Free-text match → the specialized vertical page;
 * no match → stay here and use the general readiness check (no dead ends).
 */
export default function IndustryPicker() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const verticals = getActiveVerticals();

  const go = (e?: React.FormEvent) => {
    e?.preventDefault();
    const slug = matchIndustry(q);
    if (slug) {
      track("industry_picker_routed", { query: q, slug, matched: true });
      router.push(`/${slug}`);
      return;
    }
    track("industry_picker_routed", { query: q, matched: false });
    setMsg("No dedicated page for that yet — no problem. Check your readiness right here; we fund most industries.");
    document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setMsg("");
          }}
          placeholder="What kind of business do you run? (e.g. landscaping, gym, law firm)"
          aria-label="Your industry"
          className="w-full appearance-none rounded-lg border border-slate-300 px-4 py-3.5 text-sm text-slate-900 shadow-sm transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button type="submit" className="btn-primary sm:w-auto">
          Find my funding
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {verticals.map((v) => (
          <Link
            key={v.slug}
            href={`/${v.slug}`}
            className="hover-lift group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <h3 className="font-semibold text-brand-900 group-hover:text-brand-700">{v.title}</h3>
            <p className="mt-1.5 flex-1 text-sm text-slate-600">{v.heroHighlights[0]}</p>
            <span className="mt-3 text-sm font-semibold text-accent-700">Check readiness →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
