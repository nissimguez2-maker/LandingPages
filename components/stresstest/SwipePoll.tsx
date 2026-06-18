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
 * Quick poll. Tapping a button is the primary, always-on input; swiping the
 * question is a secondary enhancement. The swipe gesture lives ONLY on the
 * question area, never on the buttons, so pointer capture can never swallow a
 * button tap. Fully keyboard and screen-reader usable; respects reduced motion.
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
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lockedRef = useRef(false);
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

  // Swipe handlers are attached to the question surface only (NOT the buttons),
  // so setPointerCapture here never interferes with a tap on a button below.
  // Direction-locked: capture the pointer only once the gesture is clearly
  // horizontal, so vertical page scroll on tall phones is never swallowed.
  const onDown = (e: React.PointerEvent) => {
    if (followId || reduce) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    lockedRef.current = false;
  };
  const onMove = (e: React.PointerEvent) => {
    if (startX.current == null || startY.current == null) return;
    const ddx = e.clientX - startX.current;
    const ddy = e.clientY - startY.current;
    if (!lockedRef.current) {
      if (Math.abs(ddx) < 10 && Math.abs(ddy) < 10) return; // too small to decide direction
      if (Math.abs(ddy) >= Math.abs(ddx)) { startX.current = null; startY.current = null; return; } // vertical → let the page scroll
      lockedRef.current = true; // horizontal intent → take over the gesture
      setDragging(true);
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    }
    setDx(ddx);
  };
  const onUp = () => {
    if (startX.current == null) return;
    const moved = dx;
    startX.current = null;
    startY.current = null;
    lockedRef.current = false;
    setDragging(false);
    if (moved > 60) answer("yes");
    else if (moved < -60) answer("no");
    else setDx(0);
  };

  const hint = dx > 30 ? "yes" : dx < -30 ? "no" : null;

  // Equal-weight, low-contrast buttons. "Yes" carries a soft navy tint so it
  // reads as the affirmative without the harsh dark-vs-white jump.
  const btnBase = "min-h-[48px] rounded-xl border font-semibold transition active:scale-[0.98]";
  const noBtn = `${btnBase} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
  const skipBtn = `${btnBase} border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50`;
  const yesBtn = `${btnBase} border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-300 hover:bg-brand-100`;

  return (
    <div>
      {cards.length > 1 && (
        <>
          <p className="text-xs font-medium text-slate-500">
            Quick gut check. {idx + 1} of {cards.length}.
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-accent-500 transition-[width] duration-300" style={{ width: `${(idx / cards.length) * 100}%` }} />
          </div>
        </>
      )}

      <div
        className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
        style={reduce ? undefined : { transform: `translateX(${dx}px) rotate(${dx * 0.02}deg)`, transition: dragging ? "none" : "transform 0.25s ease-out" }}
      >
        {hint && (
          <span className={`pointer-events-none absolute right-4 top-4 z-10 rounded-md px-2 py-0.5 text-xs font-bold ${hint === "yes" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {hint === "yes" ? "YES" : "NO"}
          </span>
        )}

        {/* Swipe surface: the question only. Buttons sit outside it so taps always register. */}
        <div
          className="cursor-grab touch-pan-y select-none px-6 pt-6 active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { startX.current = null; startY.current = null; lockedRef.current = false; setDragging(false); setDx(0); }}
          aria-live="polite"
        >
          <p className="text-lg font-semibold text-brand-900">{followId ? card.followUp!.prompt : card.prompt}</p>
          {!followId && card.help && <p className="mt-1 text-sm text-slate-500">{card.help}</p>}
        </div>

        <div className="px-6 pb-6 pt-5">
          {followId ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button type="button" onClick={() => chooseFollow(card.followUp!.left.value)} className={noBtn}>{card.followUp!.left.label}</button>
              <button type="button" onClick={() => chooseFollow(card.followUp!.right.value)} className={yesBtn}>{card.followUp!.right.label}</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              <button type="button" onClick={() => answer("no")} className={noBtn}>No</button>
              <button type="button" onClick={() => answer("skip")} className={skipBtn}>Not sure</button>
              <button type="button" onClick={() => answer("yes")} className={yesBtn}>Yes</button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Tap an answer, or swipe the card.</p>
    </div>
  );
}
