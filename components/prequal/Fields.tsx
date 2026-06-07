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
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function RadioCards<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 2,
  error,
  name,
  help,
}: {
  legend: string;
  options: readonly Option<T>[];
  value?: T;
  onChange: (v: T) => void;
  columns?: 1 | 2 | 3 | 4;
  error?: string;
  name?: string;
  help?: string;
}) {
  const groupName = name || slug(legend);
  const errorId = `${groupName}-error`;
  const helpId = `${groupName}-help`;
  return (
    <fieldset aria-invalid={!!error} aria-describedby={`${help ? helpId : ""} ${error ? errorId : ""}`.trim() || undefined}>
      <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
      {help && (
        <p id={helpId} className="mt-1 text-xs text-slate-500">
          {help}
        </p>
      )}
      <div className={`mt-3 grid gap-2.5 ${COLS[columns]}`}>
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex min-h-[48px] cursor-pointer items-center rounded-lg border px-4 py-3 text-sm transition ${
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
                aria-label={`${legend}: ${o.label}`}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
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
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  help?: string;
}) {
  const id = slug(label);
  const errorId = `${id}-error`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 w-full appearance-none rounded-lg border px-4 py-3 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
        }`}
      />
      {help && !error && <span className="mt-1 block text-xs text-slate-500">{help}</span>}
      {error && (
        <span id={errorId} className="mt-1 block text-sm text-red-700">
          {error}
        </span>
      )}
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
  const id = slug(label);
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:text-sm"
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
        className="mt-0.5 h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      <span>{label}</span>
    </label>
  );
}
