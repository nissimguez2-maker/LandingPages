/**
 * Compliance disclaimer. Rendered near the form and in the footer.
 * Language is intentionally conservative — no guarantees, not a bank loan.
 */
export default function DisclaimerBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 text-slate-600 ${
        compact ? "p-4 text-xs" : "p-5 text-sm"
      }`}
    >
      <p className="font-semibold text-slate-700">Important disclosure</p>
      <p className="mt-1.5 leading-relaxed">
        This is not a commitment to lend and is not a bank loan. Funding options, amounts, and timing
        depend on underwriting and documentation, and approval is not guaranteed. Any payments must fit
        your business cash flow. Submitting your information places you under no obligation to accept an
        offer. A funding specialist may contact you to review your inquiry. Eligibility is based on
        business revenue and bank activity, among other factors.
      </p>
    </div>
  );
}
