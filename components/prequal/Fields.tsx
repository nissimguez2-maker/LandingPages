"use client";

/** Reusable, accessible form primitives for the prequalification flow. */

import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { Option, OptionGroup } from "@/lib/types";
import { formatPhoneDisplay, normalizePhone } from "@/lib/application";

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const baseInputClass =
  "mt-1.5 w-full appearance-none rounded-lg border px-4 py-3 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm";
const inputStateClass = (error?: string) =>
  error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-500 focus:ring-brand-100";

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

/**
 * PhoneField — US phone with a visible "+1" prefix and progressive formatting.
 * Displays "+1 (555) 123-4567" while the stored/emitted value is E.164 "+15551234567".
 * Pass the E.164 value as `value`; `onChange` receives the E.164 normalized value.
 */
export function PhoneField({
  label,
  value,
  onChange,
  error,
  help,
}: {
  label: string;
  value: string;
  onChange: (e164: string) => void;
  error?: string;
  help?: string;
}) {
  const id = slug(label);
  const errorId = `${id}-error`;
  // Rehydrate display from stored E.164 ("+15551234567" → "+1 (555) 123-4567")
  const display = formatPhoneDisplay(value.replace(/^\+1/, ""));
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={display}
        onChange={(e) => {
          const normalized = normalizePhone(e.target.value);
          onChange(normalized);
        }}
        placeholder="+1 (555) 123-4567"
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

/**
 * Select — native dropdown for structured option sets (US states, etc.).
 * Mirrors TextField's label/error/a11y/Tailwind styling.
 * Native <select> for best mobile UX.
 */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  autoComplete,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly Option[];
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  help?: string;
}) {
  const id = slug(label);
  const errorId = `${id}-error`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 w-full appearance-none rounded-lg border px-4 py-3 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
        } ${value === "" ? "text-slate-400" : "text-slate-900"}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {help && !error && <span className="mt-1 block text-xs text-slate-500">{help}</span>}
      {error && (
        <span id={errorId} className="mt-1 block text-sm text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

/**
 * CheckCards — the multi-select sibling of RadioCards. Same card styling and 44px+
 * touch targets, but checkbox semantics: tapping a card toggles it in/out of the
 * selected array. Optional `maxSelect` caps how many can be on at once (extra
 * cards disable once the cap is hit). Sets aria-invalid on the group so the
 * wizard's focusFirstError can land here.
 */
export function CheckCards<T extends string>({
  legend,
  options,
  values,
  onChange,
  columns = 2,
  error,
  name,
  help,
  maxSelect,
}: {
  legend: string;
  options: readonly Option<T>[];
  values: readonly T[];
  onChange: (v: T[]) => void;
  columns?: 1 | 2 | 3 | 4;
  error?: string;
  name?: string;
  help?: string;
  maxSelect?: number;
}) {
  const groupName = name || slug(legend);
  const errorId = `${groupName}-error`;
  const helpId = `${groupName}-help`;
  const selected = new Set(values);
  const atCap = typeof maxSelect === "number" && selected.size >= maxSelect;

  const toggle = (v: T) => {
    if (selected.has(v)) {
      onChange(values.filter((x) => x !== v));
    } else {
      if (atCap) return;
      onChange([...values, v]);
    }
  };

  return (
    <fieldset
      aria-invalid={!!error}
      aria-describedby={`${help ? helpId : ""} ${error ? errorId : ""}`.trim() || undefined}
    >
      <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
      {help && (
        <p id={helpId} className="mt-1 text-xs text-slate-500">
          {help}
        </p>
      )}
      <div className={`mt-3 grid gap-2.5 ${COLS[columns]}`}>
        {options.map((o) => {
          const isOn = selected.has(o.value);
          const disabled = !isOn && atCap;
          return (
            <label
              key={o.value}
              className={`flex min-h-[48px] items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              } ${
                isOn
                  ? "border-brand-600 bg-brand-50 font-medium text-brand-900 ring-1 ring-brand-600"
                  : "border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                name={groupName}
                value={o.value}
                checked={isOn}
                disabled={disabled}
                onChange={() => toggle(o.value)}
                aria-label={`${legend}: ${o.label}`}
                className="h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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

/**
 * Combobox — type-OR-pick. A free-text input with a filterable dropdown seeded
 * from grouped suggestions. Whatever the owner types is the value (free text
 * passes straight through); the dropdown only speeds up common picks. Implements
 * the ARIA combobox pattern (role=combobox, aria-expanded, aria-controls,
 * aria-activedescendant) with a listbox popup and keyboard support.
 */
export function Combobox({
  label,
  value,
  onChange,
  groups,
  placeholder,
  error,
  help,
  autoComplete = "off",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** Grouped suggestions (free text is always allowed regardless). */
  groups: readonly OptionGroup[];
  placeholder?: string;
  error?: string;
  help?: string;
  autoComplete?: string;
}) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Flatten + filter by the current text. Empty query shows everything.
  const flat = useMemo(() => {
    const q = value.trim().toLowerCase();
    const rows: { group: string; label: string }[] = [];
    for (const g of groups) {
      for (const opt of g.options) {
        if (!q || opt.toLowerCase().includes(q)) rows.push({ group: g.group, label: opt });
      }
    }
    return rows;
  }, [groups, value]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = (label: string) => {
    onChange(label);
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < flat.length) {
        e.preventDefault();
        pick(flat[activeIndex].label);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="block" ref={wrapRef}>
      <label className="text-sm font-semibold text-brand-900" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`${baseInputClass} ${inputStateClass(error)}`}
        />
        {open && flat.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lift"
          >
            {flat.map((row, i) => {
              const isActive = i === activeIndex;
              const isSelected = row.label === value;
              const first = i === 0 || flat[i - 1].group !== row.group;
              return (
                <li key={`${row.group}-${row.label}`} role="presentation">
                  {first && (
                    <p className="px-3 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {row.group}
                    </p>
                  )}
                  <div
                    id={`${id}-opt-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pick(row.label);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`mx-1 cursor-pointer rounded-md px-3 py-2 text-sm ${
                      isActive ? "bg-brand-50 text-brand-900" : "text-slate-700"
                    }`}
                  >
                    {row.label}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {help && !error && <span className="mt-1 block text-xs text-slate-500">{help}</span>}
      {error && (
        <span id={errorId} className="mt-1 block text-sm text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}

/* ── AddressAutocomplete — one input that fills street/city/state/zip ──────────
 * Uses the Geoapify autocomplete API (no SDK, plain fetch, 250ms debounce). On
 * select it parses the result and fills all four target fields, clearing their
 * errors (the parent owns error state). GRACEFUL FALLBACK: if the key is unset,
 * the request errors, or there's no JS, it renders the four manual fields
 * (street/city/state/zip) instead — the owner can always type by hand. The key is
 * read from NEXT_PUBLIC_GEOAPIFY_KEY and is never hardcoded. */

export interface AddressValue {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export function AddressAutocomplete({
  legend,
  value,
  onChange,
  errors,
  streetAutoComplete = "street-address",
  usStates,
}: {
  legend: string;
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  /** Keyed by logical field: street/city/state/zip. */
  errors?: { street?: string; city?: string; state?: string; zip?: string };
  streetAutoComplete?: string;
  /** US states option list (passed in to avoid a circular import). */
  usStates: readonly Option[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
  const id = useId();
  const listboxId = `${id}-listbox`;
  const wrapRef = useRef<HTMLFieldSetElement>(null);
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // If the autocomplete fetch ever fails, fall back to the plain manual fields
  // for the rest of the session (don't keep hammering a broken/unauthorized key).
  const [autocompleteBroken, setAutocompleteBroken] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const useAutocomplete = Boolean(apiKey) && !autocompleteBroken;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  function queryGeoapify(text: string) {
    if (!apiKey || autocompleteBroken) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text,
        )}&filter=countrycode:us&format=json&apiKey=${apiKey}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`geoapify_${res.status}`);
        const data = (await res.json()) as { results?: GeoapifyFeature[] };
        const results = Array.isArray(data.results) ? data.results : [];
        setSuggestions(results.slice(0, 5));
        setOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        // Unset key, network failure, bad response → drop to manual fields.
        setAutocompleteBroken(true);
        setSuggestions([]);
        setOpen(false);
      }
    }, 250);
  }

  function selectSuggestion(f: GeoapifyFeature) {
    const street =
      f.address_line1 ||
      [f.housenumber, f.street].filter(Boolean).join(" ").trim() ||
      f.name ||
      "";
    onChange({
      street,
      city: f.city || "",
      state: f.state_code || stateCodeFromName(f.state, usStates) || "",
      zip: f.postcode || "",
    });
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!useAutocomplete) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const cityStateZip = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
      <div className="sm:col-span-3">
        <TextField
          label="City"
          value={value.city}
          onChange={(v) => onChange({ ...value, city: v })}
          autoComplete="address-level2"
          error={errors?.city}
        />
      </div>
      <div className="sm:col-span-1">
        <Select
          label="State"
          value={value.state}
          onChange={(v) => onChange({ ...value, state: v })}
          options={usStates}
          placeholder="State"
          autoComplete="address-level1"
          error={errors?.state}
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          label="ZIP"
          value={value.zip}
          onChange={(v) => onChange({ ...value, zip: v.replace(/\D/g, "").slice(0, 5) })}
          inputMode="numeric"
          autoComplete="postal-code"
          error={errors?.zip}
        />
      </div>
    </div>
  );

  // ── Manual fallback (no key / fetch failed) ───────────────────────────────────
  if (!useAutocomplete) {
    return (
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
        <TextField
          label="Street address"
          value={value.street}
          onChange={(v) => onChange({ ...value, street: v })}
          autoComplete={streetAutoComplete}
          error={errors?.street}
        />
        {cityStateZip}
      </fieldset>
    );
  }

  // ── Autocomplete path: one smart input that fills the rest ────────────────────
  return (
    <fieldset className="space-y-4" ref={wrapRef}>
      <legend className="text-sm font-semibold text-brand-900">{legend}</legend>
      <div className="relative">
        <label className="text-sm font-semibold text-brand-900" htmlFor={id}>
          Street address
        </label>
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
          aria-invalid={!!errors?.street}
          autoComplete={streetAutoComplete}
          value={value.street}
          placeholder="Start typing your address…"
          onChange={(e) => {
            onChange({ ...value, street: e.target.value });
            queryGeoapify(e.target.value);
          }}
          onKeyDown={onKeyDown}
          className={`${baseInputClass} ${inputStateClass(errors?.street)}`}
        />
        {open && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={legend}
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lift"
          >
            {suggestions.map((f, i) => (
              <li key={f.place_id || `${f.formatted}-${i}`} role="presentation">
                <div
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(f);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`mx-1 cursor-pointer rounded-md px-3 py-2 text-sm ${
                    i === activeIndex ? "bg-brand-50 text-brand-900" : "text-slate-700"
                  }`}
                >
                  {f.formatted || f.address_line1}
                </div>
              </li>
            ))}
          </ul>
        )}
        {errors?.street && <span className="mt-1 block text-sm text-red-700">{errors.street}</span>}
        <p className="mt-1 text-xs text-slate-500">Pick a suggestion to fill city, state and ZIP automatically.</p>
      </div>
      {cityStateZip}
    </fieldset>
  );
}

/** Geoapify `format=json` result row (only the fields we read). */
interface GeoapifyFeature {
  place_id?: string;
  formatted?: string;
  address_line1?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postcode?: string;
}

/** Resolve a 2-letter code from a full state name when Geoapify omits state_code. */
function stateCodeFromName(name: string | undefined, usStates: readonly Option[]): string {
  if (!name) return "";
  const hit = usStates.find((s) => s.label.toLowerCase() === name.toLowerCase());
  return hit?.value ?? "";
}
