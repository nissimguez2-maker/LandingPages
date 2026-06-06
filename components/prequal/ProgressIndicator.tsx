"use client";

/** Step progress for the prequalification flow (Fogg: makes ability/length legible). */
export default function ProgressIndicator({
  steps,
  current,
}: {
  steps: { id: number; label: string }[];
  current: number;
}) {
  const pct = Math.round(((current - 1) / steps.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Step {current} of {steps.length}
        </span>
        <span>{steps[current - 1]?.label}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-accent-600 transition-all duration-300"
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
    </div>
  );
}
