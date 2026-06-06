"use client";

/** Reusable, accessible form primitives for the prequalification flow. */

import type { Option } from "@/lib/types";

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function RadioCards<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 2,
  error,
  name,
}: {
  legend: string;
  options: readonly Option<T>[];
  value?: T;
  onChange: (v: T) => void;
  columns?: 1 | 2 | 3 | 4;
  error?: string;
  name?: string;
}) {
  const groupName = name || slug(legend);
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
      <div className={`mt-3 grid gap-2.5 ${COLS[columns]}`}>
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center rounded-lg border px-4 py-3 text-sm transition ${
                selected
                  ? "border-brand-600 bg-brand-50 font-medium text-brand-900 ring-1 ring-brand-600"
                  : "border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-1.5 w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
        }`}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      <span>{label}</span>
    </label>
  );
}
