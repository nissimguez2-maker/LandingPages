"use client";

/**
 * Deep-application UI primitives. Built on the same tokens as the prequal
 * (brand navy, accent CSS vars, shadow-card, .secure-surface, .lock-note) and
 * reuses the prequal Checkbox/TextField where they already fit.
 *
 * The trust language is deliberate: the lock glyph is navy (a vault), never red
 * (a warning); reassurance lives AT the sensitive field, not in a footer; and the
 * security claims are specific ("soft check, won't affect your score") because
 * specificity is what reads as legitimate to a wary owner.
 */

import { useId, useRef, useState } from "react";

import { Checkbox } from "@/components/prequal/Fields";
import { formatSsn, maskSsnDisplay } from "@/lib/application";

/* ── Tiny inline icon set (currentColor, no new deps) ───────────────────── */

type IconProps = { className?: string };
const base = "h-4 w-4";

export const IconLock = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
export const IconShield = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const IconEye = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconEyeOff = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.6 3.6M6.6 6.6A18 18 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 4.1-.8" />
    <path d="m2 2 20 20" />
  </svg>
);
export const IconUpload = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);
export const IconDoc = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);
export const IconCheck = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="m20 6-11 11-5-5" />
  </svg>
);
export const IconX = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const IconPhone = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
export const IconArrowRight = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ── SecureSection — the per-step shell ─────────────────────────────────── */

export function SecureSection({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-brand-900">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{subtitle}</p>}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/* ── Stepper ────────────────────────────────────────────────────────────── */

export function Stepper({
  steps,
  current,
  progress,
}: {
  steps: readonly { id: string; label: string }[];
  current: number;
  progress: number;
}) {
  const active = steps[current];
  return (
    <div>
      {/* Mobile: compact label + progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="font-semibold text-brand-900">{active?.label}</span>
          <span>
            Step {current + 1} of {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-accent-600 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application progress"
          />
        </div>
      </div>

      {/* Desktop: vertical rail */}
      <ol className="hidden sm:flex sm:flex-col sm:gap-1" aria-label="Application steps">
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={s.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <span
                aria-hidden
                className={`grid h-7 w-7 flex-none place-items-center rounded-full text-xs font-semibold transition ${
                  state === "done"
                    ? "bg-brand-700 text-white"
                    : state === "active"
                      ? "bg-accent-600 text-white ring-4 ring-accent-100"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {state === "done" ? <IconCheck className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-sm ${
                  state === "active"
                    ? "font-semibold text-brand-900"
                    : state === "done"
                      ? "font-medium text-brand-700"
                      : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── TrustPanel — quiet, specific, human ────────────────────────────────── */

export function TrustPanel({ phone }: { phone?: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "rgb(var(--secure-ring))", backgroundColor: "rgb(var(--secure-bg))" }}
    >
      <p className="lock-note">
        <IconShield className="h-4 w-4" /> Your information is protected
      </p>
      <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
        <li className="flex gap-2">
          <IconLock className="mt-px h-3.5 w-3.5 flex-none text-accent-600" />
          Encrypted in transit and at rest
        </li>
        <li className="flex gap-2">
          <IconEyeOff className="mt-px h-3.5 w-3.5 flex-none text-accent-600" />
          Reviewed only by our funding team — never sold
        </li>
        <li className="flex gap-2">
          <IconCheck className="mt-px h-3.5 w-3.5 flex-none text-accent-600" />
          No obligation, and no hard credit pull from this form
        </li>
      </ul>
      {phone && (
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900"
        >
          <IconPhone className="h-3.5 w-3.5" /> Questions? Call {phone}
        </a>
      )}
    </div>
  );
}

/* ── Tooltip — "why we ask" (tap/click, keyboard-safe) ──────────────────── */

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-label="Why we ask for this"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="ml-1.5 inline-grid h-4 w-4 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 hover:bg-brand-100 hover:text-brand-700"
      >
        {label}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-6 z-30 block w-60 rounded-lg bg-brand-900 px-3 py-2 text-xs leading-relaxed text-white shadow-lift"
        >
          {children}
        </span>
      )}
    </span>
  );
}

/* ── MaskedInput — generic formatted field (EIN, currency, …) ───────────── */

export function MaskedInput({
  label,
  value,
  onChange,
  format,
  placeholder,
  inputMode = "numeric",
  help,
  error,
  why,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  format: (raw: string) => string;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel";
  help?: string;
  error?: string;
  why?: React.ReactNode;
}) {
  const id = useId();
  return (
    <label className="block" htmlFor={id}>
      <span className="flex items-center text-sm font-semibold text-brand-900">
        {label}
        {why && <Tooltip label="?">{why}</Tooltip>}
      </span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(format(e.target.value))}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        aria-invalid={!!error}
        className={`mt-1.5 w-full appearance-none rounded-lg border px-4 py-3 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm ${
          error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
        }`}
      />
      {help && !error && <span className="mt-1 block text-xs text-slate-500">{help}</span>}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

/* ── SsnField — the make-or-break field ─────────────────────────────────── */

export function SsnField({
  value,
  onChange,
  onFocusOnce,
  error,
  deferred,
  onDefer,
}: {
  value: string;
  onChange: (formatted: string) => void;
  onFocusOnce?: () => void;
  error?: string;
  deferred?: boolean;
  onDefer?: (deferred: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [focused, setFocused] = useState(false);
  const firedFocus = useRef(false);
  const id = useId();

  if (deferred) {
    return (
      <div className="secure-surface p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-brand-900">
          <IconCheck className="h-4 w-4 text-accent-600" /> A specialist will take your SSN by phone.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          We&apos;ll verify your identity on the call — nothing to enter here.{" "}
          <button type="button" onClick={() => onDefer?.(false)} className="font-semibold text-brand-700 underline">
            Enter it here instead
          </button>
        </p>
      </div>
    );
  }

  const shown = revealed || focused ? formatSsn(value) : maskSsnDisplay(value);

  return (
    <label className="block" htmlFor={id}>
      <span className="flex items-center justify-between">
        <span className="flex items-center text-sm font-semibold text-brand-900">
          Social Security Number
          <Tooltip label="?">
            Funders confirm your identity to release funds (KYC). It&apos;s used to verify you, not to decline you.
          </Tooltip>
        </span>
        <span className="lock-note">
          <IconLock className="h-3.5 w-3.5" /> Encrypted
        </span>
      </span>

      <div
        className={`mt-1.5 flex items-center rounded-lg border bg-white shadow-sm transition focus-within:ring-2 ${
          error ? "border-red-400 focus-within:ring-red-200" : "border-slate-300 focus-within:border-brand-500 focus-within:ring-brand-100"
        }`}
      >
        {/* Navy lock = vault, never red = danger */}
        <IconLock className="ml-3.5 h-4 w-4 flex-none text-brand-400" />
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          maxLength={11}
          value={shown}
          onFocus={() => {
            setFocused(true);
            if (!firedFocus.current) {
              firedFocus.current = true;
              onFocusOnce?.();
            }
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(formatSsn(e.target.value))}
          aria-label="Social Security Number"
          aria-invalid={!!error}
          placeholder="•••-••-••••"
          className="w-full bg-transparent px-3 py-3 text-base tabular-nums tracking-[0.08em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-pressed={revealed}
          aria-label={revealed ? "Hide SSN" : "Show SSN"}
          className="mr-1 grid h-9 w-9 flex-none place-items-center rounded-md text-slate-400 hover:text-brand-600"
        >
          {revealed ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>

      {/* Specific, calm, benefit-framed — reconciles the prequal's "no credit check" promise */}
      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
        <IconShield className="mt-px h-3.5 w-3.5 flex-none text-accent-600" />
        Earlier we checked with no credit pull — that was real. This step only verifies your identity. It does{" "}
        <strong className="font-semibold text-slate-600">not</strong> trigger a hard pull and won&apos;t affect your score.
      </p>

      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}

      {onDefer && (
        <button
          type="button"
          onClick={() => onDefer(true)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900"
        >
          <IconPhone className="h-3.5 w-3.5" /> Rather give it by phone? A specialist can take it
        </button>
      )}
    </label>
  );
}

/* ── FileUpload — bank statements (drag/drop + mobile camera) ────────────── */

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  items,
  onPick,
  onRemove,
  deferred,
  onToggleDefer,
}: {
  items: UploadItem[];
  onPick: (files: File[]) => void;
  onRemove: (id: string) => void;
  deferred: boolean;
  onToggleDefer: (deferred: boolean) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const accepted = items.filter((i) => i.status !== "error");

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onPick(Array.from(e.dataTransfer.files));
        }}
        className={`secure-surface relative flex flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition ${
          dragging ? "border-accent-500 bg-accent-50" : "border-slate-300"
        } ${deferred ? "opacity-50" : ""}`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50">
          <IconUpload className="h-6 w-6 text-brand-600" />
        </span>
        <p className="mt-3 text-sm font-semibold text-brand-900">
          <span className="hidden sm:inline">Drag &amp; drop, or </span>choose your statements
        </p>
        <p className="mt-1 text-xs text-slate-500">PDF, JPG or PNG · up to 15 MB each</p>

        <div className="mt-4 flex w-full max-w-xs flex-col gap-2 sm:flex-row sm:justify-center">
          <label className="btn-secondary flex-1 cursor-pointer sm:hidden">
            Take photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="sr-only"
              disabled={deferred}
              onChange={(e) => onPick(Array.from(e.target.files ?? []))}
              aria-label="Take a photo of a bank statement"
            />
          </label>
          <label className="btn-primary flex-1 cursor-pointer">
            Choose file
            <input
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="sr-only"
              disabled={deferred}
              onChange={(e) => onPick(Array.from(e.target.files ?? []))}
              aria-label="Choose bank statement files"
            />
          </label>
        </div>

        <p className="lock-note mt-4">
          <IconLock className="h-3.5 w-3.5" /> Files are encrypted the moment they leave your device
        </p>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Uploaded statements">
          {items.map((f) => (
            <li
              key={f.id}
              className={`flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 ${
                f.status === "error" ? "border-red-300 bg-red-50" : "border-slate-200"
              }`}
            >
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-md ${
                  f.status === "error"
                    ? "bg-red-100 text-red-600"
                    : f.status === "done"
                      ? "bg-accent-50 text-accent-700"
                      : "bg-brand-50 text-brand-600"
                }`}
              >
                {f.status === "done" ? <IconLock className="h-4 w-4" /> : <IconDoc className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-900">{f.name}</p>
                {f.status === "error" ? (
                  <p className="text-xs text-red-700">{f.error}</p>
                ) : f.status === "done" ? (
                  <p className="lock-note">Encrypted · {formatBytes(f.size)}</p>
                ) : (
                  <p className="text-xs text-slate-500">Uploading…</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                aria-label={`Remove ${f.name}`}
                className="grid h-8 w-8 flex-none place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-red-600"
              >
                <IconX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          {accepted.length >= 3 ? (
            <span className="lock-note">
              <IconCheck className="h-4 w-4" /> 3+ months received — you&apos;re set.
            </span>
          ) : (
            `${accepted.length} of 3 months uploaded`
          )}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={deferred}
            onChange={(e) => onToggleDefer(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          I&apos;ll send these to my specialist instead
        </label>
      </div>
    </div>
  );
}

/* ── SignatureBlock — consent + typed e-signature ───────────────────────── */

export function SignatureBlock({
  disclosure,
  consentCredit,
  onConsentCredit,
  consentEsign,
  onConsentEsign,
  signatureName,
  onSignatureName,
  errors,
}: {
  disclosure?: React.ReactNode;
  consentCredit: boolean;
  onConsentCredit: (v: boolean) => void;
  consentEsign: boolean;
  onConsentEsign: (v: boolean) => void;
  signatureName: string;
  onSignatureName: (v: string) => void;
  errors: Record<string, string>;
}) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-600">
          {disclosure ?? (
            <p>
              By signing, you authorize <strong className="text-brand-900">FundVella</strong> and its funding partners to
              verify the information you provided and review the bank statements you shared, for the sole purpose of
              evaluating this application. Submitting does not obligate you to accept any offer. This electronic signature
              has the same effect as a written one.
            </p>
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-xl bg-gradient-to-t from-white to-transparent"
          aria-hidden
        />
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <Checkbox
          checked={consentCredit}
          onChange={onConsentCredit}
          label="I authorize FundVella and its funding partners to verify my identity and the information in this application."
        />
        {errors.creditAuthConsent && <p className="text-sm text-red-700">{errors.creditAuthConsent}</p>}
        <Checkbox
          checked={consentEsign}
          onChange={onConsentEsign}
          label="I agree to sign electronically and certify that the information I provided is accurate."
        />
        {errors.esignConsent && <p className="text-sm text-red-700">{errors.esignConsent}</p>}
      </div>

      <div className="secure-surface p-4">
        <label className="block text-sm font-semibold text-brand-900" htmlFor="sig-name">
          Type your full legal name to sign
        </label>
        <input
          id="sig-name"
          value={signatureName}
          onChange={(e) => onSignatureName(e.target.value)}
          autoComplete="name"
          placeholder="Jane Q. Owner"
          aria-invalid={!!errors.signatureName}
          className={`mt-1.5 w-full appearance-none rounded-lg border px-4 py-3 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm ${
            errors.signatureName ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
          }`}
        />
        {signatureName.trim() && (
          <p
            className="mt-3 select-none border-b border-slate-300 pb-1 text-3xl text-brand-900"
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
          >
            {signatureName}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Electronic signature</span>
          <span className="lock-note">{today}</span>
        </div>
        {errors.signatureName && <p className="mt-1 text-sm text-red-700">{errors.signatureName}</p>}
      </div>
    </div>
  );
}
