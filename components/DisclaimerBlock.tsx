import Link from "next/link";

import { COMPLIANCE } from "@/content/compliance";

/**
 * Compliance disclaimer with three variants:
 *  - "full"    : the master disclosure (rendered once, near the form)
 *  - "compact" : smaller card
 *  - "line"    : a single sentence + link (footer)
 * `compact` boolean kept for back-compat.
 */
export default function DisclaimerBlock({
  compact = false,
  variant,
}: {
  compact?: boolean;
  variant?: "full" | "compact" | "line";
}) {
  const v = variant ?? (compact ? "compact" : "full");

  if (v === "line") {
    return (
      <p className="text-xs leading-relaxed text-slate-500">
        {COMPLIANCE.line}{" "}
        <Link href="/disclosures" className="underline hover:text-slate-700">
          Full disclosures
        </Link>
        .
      </p>
    );
  }

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 text-slate-600 ${
        v === "compact" ? "p-4 text-xs" : "p-5 text-sm"
      }`}
    >
      <p className="font-semibold text-slate-700">Important disclosure</p>
      <p className="mt-1.5 leading-relaxed">
        {COMPLIANCE.full} See our{" "}
        <Link href="/disclosures" className="underline hover:text-slate-800">
          disclosures
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-slate-800">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
