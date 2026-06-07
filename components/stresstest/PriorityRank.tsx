"use client";

import { useRef } from "react";

export interface RankOption {
  value: string;
  label: string;
}

/**
 * Drag-to-rank list. The up/down buttons are the reliable source of truth
 * (work on any device + keyboard); pointer drag is an enhancement. Controlled:
 * parent owns `order` and gets `onChange`. Top of the list = most important.
 */
export default function PriorityRank({
  legend,
  help,
  options,
  order,
  onChange,
}: {
  legend: string;
  help?: string;
  options: RankOption[];
  order: string[];
  onChange: (order: string[]) => void;
}) {
  const liveRef = useRef<HTMLParagraphElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const dragFrom = useRef<number | null>(null);
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    const next = order.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    if (liveRef.current) liveRef.current.textContent = `${labelOf(item)} moved to position ${to + 1} of ${order.length}`;
  };

  const onDown = (i: number) => (e: React.PointerEvent) => {
    dragFrom.current = i;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragFrom.current == null) return;
    const y = e.clientY;
    let to = rows.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    if (to === -1) to = order.length - 1;
    if (to !== dragFrom.current) {
      move(dragFrom.current, to);
      dragFrom.current = to;
    }
  };
  const onUp = () => {
    dragFrom.current = null;
  };

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
      <ol className="mt-3 space-y-2" onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {order.map((v, i) => (
          <li
            key={v}
            ref={(el) => { rows.current[i] = el; }}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">{i + 1}</span>
            <span
              onPointerDown={onDown(i)}
              className="flex-none cursor-grab touch-none select-none px-1 text-slate-400"
              aria-hidden="true"
            >
              ⠿
            </span>
            <span className="flex-1 text-sm font-medium text-brand-900">{labelOf(v)}</span>
            <span className="flex flex-none gap-1">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                aria-label={`Move ${labelOf(v)} up`}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === order.length - 1}
                aria-label={`Move ${labelOf(v)} down`}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 disabled:opacity-30"
              >
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      <p ref={liveRef} aria-live="polite" className="sr-only" />
    </fieldset>
  );
}
