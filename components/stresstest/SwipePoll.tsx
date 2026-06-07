"use client";

import { useRef, useState } from "react";

export interface SwipeCard {
  id: string;
  prompt: string;
  help?: string;
  /** Stored value for each answer (maps to a LeadData enum). */
  yes: string;
  no: string;
  skip: string;
  /** Optional follow-up shown after a "yes" to capture severity. */
  followUp?: { prompt: string; left: { label: string; value: string }; right: { label: string; value: string } };
}

/**
 * Swipe poll. Big Yes / No / Skip buttons are the primary, equal-weight input;
 * the swipe gesture is an enhancement that calls the exact same handler. Fully
 * keyboard and screen-reader usable. Respects prefers-reduced-motion.
 */
export default function SwipePoll({
  cards,
  onAnswer,
  onComplete,
}: {
  cards: SwipeCard[];
  onAnswer?: (id: string, value: string) => void;
  onComplete: (responses: Record<string, string>) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [followId, setFollowId] = useState<string | null>(null);
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);
  const card = cards[idx];

  const reduce =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const advance = (next: Record<string, string>) => {
    setDx(0);
    if (idx < cards.length - 1) setIdx(idx + 1);
    else onComplete(next);
  };

  const answer = (kind: "yes" | "no" | "skip") => {
    const value = kind === "yes" ? card.yes : kind === "no" ? card.no : card.skip;
    onAnswer?.(card.id, value);
    if (kind === "yes" && card.followUp) {
      setResponses((r) => ({ ...r, [card.id]: value }));
      setFollowId(card.id);
      setDx(0);
      return;
    }
    const next = { ...responses, [card.id]: value };
    setResponses(next);
    advance(next);
  };

  const chooseFollow = (value: string) => {
    const next = { ...responses, [card.id]: value };
    setResponses(next);
    onAnswer?.(card.id, value);
    setFollowId(null);
    advance(next);
  };

  const onDown = (e: React.PointerEvent) => {
    if (followId) return;
    startX.current = e.clientX;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (startX.current == null || reduce) return;
    setDx(e.clientX - startX.current);
  };
  const onUp = () => {
    if (startX.current == null) return;
    const moved = dx;
    startX.current = null;
    if (moved > 60) answer("yes");
    else if (moved < -60) answer("no");
    else setDx(0);
  };

  const hint = dx > 30 ? "yes" : dx < -30 ? "no" : null;

  return (
    <div>
      <p className="text-xs font-medium text-slate-500">
        Quick gut check. {idx + 1} of {cards.length}.
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-accent-500 transition-[width] duration-300" style={{ width: `${((idx) / cards.length) * 100}%` }} />
      </div>

      <div
        className="relative mt-4 select-none rounded-2xl border border-slate-200 bg-white p-6 shadow-card touch-pan-y"
        style={reduce ? undefined : { transform: `translateX(${dx}px) rotate(${dx * 0.02}deg)` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => { startX.current = null; setDx(0); }}
        aria-live="polite"
      >
        {hint && (
          <span className={`absolute right-4 top-4 rounded-md px-2 py-0.5 text-xs font-bold ${hint === "yes" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {hint === "yes" ? "YES" : "NO"}
          </span>
        )}
        <p className="text-lg font-semibold text-brand-900">{followId ? card.followUp!.prompt : card.prompt}</p>
        {!followId && card.help && <p className="mt-1 text-sm text-slate-500">{card.help}</p>}

        {followId ? (
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button type="button" onClick={() => chooseFollow(card.followUp!.left.value)} className="btn-secondary">{card.followUp!.left.label}</button>
            <button type="button" onClick={() => chooseFollow(card.followUp!.right.value)} className="btn-secondary">{card.followUp!.right.label}</button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <button type="button" onClick={() => answer("no")} className="min-h-[48px] rounded-lg border border-slate-300 font-semibold text-slate-700 transition hover:bg-slate-50">No</button>
            <button type="button" onClick={() => answer("skip")} className="min-h-[48px] rounded-lg border border-slate-200 text-sm font-medium text-slate-400 transition hover:bg-slate-50">Not sure</button>
            <button type="button" onClick={() => answer("yes")} className="min-h-[48px] rounded-lg bg-brand-900 font-semibold text-white transition hover:bg-brand-800">Yes</button>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Tap a button or swipe the card.</p>
    </div>
  );
}
