import Link from "next/link";

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
        Not a commitment to lend or a bank loan. Approval depends on underwriting and is not guaranteed.{" "}
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
        This is not a commitment to lend and is not a bank loan. Funding options, amounts, and timing depend
        on underwriting and documentation; approval is not guaranteed. Any payments must fit your business
        cash flow. Submitting your information places you under no obligation. A funding specialist may
        contact you to review your inquiry. See our{" "}
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
