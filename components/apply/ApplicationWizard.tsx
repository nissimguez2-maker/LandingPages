"use client";

/**
 * The deep application — a 5-step, autosaving, resumable wizard that a qualified
 * prequal lead is handed off to. Ordered by ascending sensitivity × sunk cost:
 * business facts → funding ask + EIN → owner identity (SSN last) → bank
 * statements (last, never a gate) → review + e-sign.
 *
 * Raw SSN + signature image live only in local component state and the single
 * final submit POST; they are never written to the autosave/draft/analytics.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import {
  RadioCards,
  Select,
  TextField,
} from "@/components/prequal/Fields";
import {
  FileUpload,
  IconArrowRight,
  IconCheck,
  IconLock,
  IconMail,
  MaskedInput,
  SecureSection,
  SignatureBlock,
  SsnField,
  Stepper,
  TrustPanel,
  type UploadItem,
} from "@/components/apply/Fields";
import { PlaidLink } from "@/components/apply/PlaidLink";
import { track } from "@/lib/analytics";
import {
  APPLICATION_STEPS,
  type ApplicationSubmission,
  computeApplicationProgress,
  formatCurrency,
  formatEin,
  formatZip,
  isValidSsn,
  parseCurrency,
  readApplicationDraft,
  readApplicationPrefill,
  saveApplicationDraft,
  clearApplicationStorage,
  ssnLast4,
  validateStep,
} from "@/lib/application";
import {
  CREDIT_SCORE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  US_STATES,
  USE_OF_FUNDS_OPTIONS,
  YES_NO_OPTIONS,
  type CreditScoreValue,
  type EntityTypeValue,
  type LeadData,
  type UseOfFundsValue,
  type YesNoValue,
} from "@/lib/types";

type Phase = "form" | "submitting" | "done";

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `f_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/** Render the typed signature to a PNG for the signed record. */
function makeSignatureImage(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f2a4a";
  ctx.font = "48px 'Brush Script MT', 'Segoe Script', cursive";
  ctx.fillText(name, 24, 96);
  return canvas.toDataURL("image/png");
}

export default function ApplicationWizard({
  slug,
  verticalTitle,
}: {
  slug: string;
  verticalTitle: string;
}) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "funding@fundvella.com";
  const [lead, setLead] = useState<LeadData>({ industry: slug, applicationStatus: "started" });
  const [ssn, setSsn] = useState(""); // formatted, kept out of LeadData
  const [stepIdx, setStepIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [phase, setPhase] = useState<Phase>("form");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = APPLICATION_STEPS[stepIdx];
  const progress = useMemo(() => computeApplicationProgress(lead), [lead]);

  // Refs for the unload handler (always-current without re-binding listeners).
  const leadRef = useRef(lead);
  const stepRef = useRef(stepIdx);
  const phaseRef = useRef(phase);
  useEffect(() => {
    leadRef.current = lead;
  }, [lead]);
  useEffect(() => {
    stepRef.current = stepIdx;
  }, [stepIdx]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const furthestRef = useRef(0);
  useEffect(() => {
    if (stepIdx > furthestRef.current) furthestRef.current = stepIdx;
  }, [stepIdx]);

  const setField = <K extends keyof LeadData>(k: K, v: LeadData[K]) =>
    setLead((l) => ({ ...l, [k]: v }));

  /* ── Mount: hydrate from a resume token, the prequal handoff, or a draft ─ */
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const prefill = readApplicationPrefill();
      const draft = readApplicationDraft();
      let merged: LeadData = { industry: slug, applicationStatus: "in_progress", ...prefill, ...(draft ?? {}) };
      let resumed = Boolean(draft);

      const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("app") : null;
      if (token) {
        try {
          const res = await fetch(`/api/application?app=${encodeURIComponent(token)}`);
          if (res.ok) {
            const data = (await res.json()) as { lead?: LeadData };
            if (data?.lead) {
              merged = { ...merged, ...data.lead, applicationId: token };
              resumed = true;
            }
          }
        } catch {
          /* fall back to local prefill/draft */
        }
      }

      if (cancelled) return;
      if (!merged.ownerFullName && (merged.firstName || merged.lastName)) {
        merged.ownerFullName = [merged.firstName, merged.lastName].filter(Boolean).join(" ");
      }
      if (!merged.businessLegalName && merged.businessName) merged.businessLegalName = merged.businessName;
      setLead(merged);
      track(resumed ? "deepapp_resumed" : "deepapp_started", { vertical: slug });
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* ── Local draft autosave on every change (never includes raw SSN) ────── */
  useEffect(() => {
    saveApplicationDraft(lead);
  }, [lead]);

  /* ── Step view analytics ──────────────────────────────────────────────── */
  useEffect(() => {
    track("deepapp_step_viewed", { vertical: slug, step: step.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  /* ── Save partial on the way out (parity with the prequal beacon) ─────── */
  useEffect(() => {
    const handler = () => {
      if (phaseRef.current === "done") return;
      try {
        const l = leadRef.current;
        const signals = {
          ssnProvided: !!l.ssnProvided,
          ssnDeferred: !!l.ssnDeferred,
          bankConnected: !!l.bankConnected,
          bankStatementsDeferred: !!l.bankStatementsDeferred,
          hasUploads: Array.isArray(l.bankStatementFiles) && l.bankStatementFiles.length > 0,
        };
        navigator.sendBeacon(
          "/api/application",
          new Blob(
            [
              JSON.stringify({
                ...l,
                partial: true,
                abandoned: true,
                dropStep: APPLICATION_STEPS[stepRef.current].id,
                furthestStep: APPLICATION_STEPS[furthestRef.current].id,
                signals,
              }),
            ],
            { type: "application/json" },
          ),
        );
      } catch {
        /* best effort */
      }
      track("deepapp_abandoned", { vertical: slug, step: APPLICATION_STEPS[stepRef.current].id });
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [slug]);

  /* ── Server autosave on step advance (LeadData only, no raw SSN) ──────── */
  async function autosave(next: LeadData) {
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { id?: string };
        if (data?.id && !next.applicationId) setField("applicationId", data.id);
        track("deepapp_saved", { vertical: slug });
      }
    } catch {
      /* non-fatal — the local draft still holds progress */
    }
  }

  /* ── SSN ──────────────────────────────────────────────────────────────── */
  function onSsnChange(formatted: string) {
    setSsn(formatted);
    const valid = isValidSsn(formatted);
    const wasValid = !!lead.ssnProvided;
    setLead((l) => ({
      ...l,
      ssnProvided: valid,
      ssnLast4: valid ? ssnLast4(formatted) : undefined,
      ssnDeferred: false,
    }));
    if (valid && !wasValid) track("deepapp_ssn_completed", { vertical: slug });
    if (errors.ssn && valid) setErrors((e) => ({ ...e, ssn: "" }));
  }

  function onSsnDefer(deferred: boolean) {
    setSsn("");
    setLead((l) => ({ ...l, ssnDeferred: deferred, ssnProvided: false, ssnLast4: undefined }));
    if (deferred) setErrors((e) => ({ ...e, ssn: "" }));
  }

  /* ── Bank statements ──────────────────────────────────────────────────── */
  async function uploadOne(file: File): Promise<{ storageKey?: string }> {
    // Ask the server for a signed upload URL. If storage isn't configured yet,
    // we keep the metadata locally and a specialist collects the file.
    try {
      const res = await fetch("/api/application/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, type: file.type, applicationId: leadRef.current.applicationId }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; key?: string; configured?: boolean };
      if (data?.url) {
        await fetch(data.url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        return { storageKey: data.key };
      }
    } catch {
      /* fall through to metadata-only */
    }
    return {};
  }

  async function handlePick(picked: File[]) {
    const tooBig = (f: File) => f.size > 15 * 1024 * 1024;
    const wrongType = (f: File) => !(f.type === "application/pdf" || f.type.startsWith("image/"));
    for (const file of picked) {
      if (tooBig(file) || wrongType(file)) {
        setFiles((fs) => [
          ...fs,
          { id: uid(), name: file.name, size: file.size, status: "error", error: "Use a PDF/JPG/PNG under 15 MB." },
        ]);
        continue;
      }
      const id = uid();
      setFiles((fs) => [...fs, { id, name: file.name, size: file.size, status: "uploading" }]);
      track("deepapp_upload_started", { vertical: slug });
      const meta = await uploadOne(file);
      setFiles((fs) => fs.map((x) => (x.id === id ? { ...x, status: "done" } : x)));
      setLead((l) => ({
        ...l,
        bankStatementsDeferred: false,
        bankStatementFiles: [
          ...(l.bankStatementFiles ?? []),
          { name: file.name, size: file.size, type: file.type, storageKey: meta.storageKey },
        ],
      }));
      track("deepapp_upload_succeeded", { vertical: slug });
    }
  }

  function removeFile(id: string) {
    const target = files.find((f) => f.id === id);
    setFiles((fs) => fs.filter((f) => f.id !== id));
    if (target && target.status !== "error") {
      setLead((l) => ({
        ...l,
        bankStatementFiles: (l.bankStatementFiles ?? []).filter((f) => f.name !== target.name),
      }));
    }
  }

  function toggleDocsDefer(deferred: boolean) {
    setField("bankStatementsDeferred", deferred);
    if (deferred) track("deepapp_docs_deferred", { vertical: slug });
  }

  /* ── Navigation ───────────────────────────────────────────────────────── */
  function goNext() {
    const errs = validateStep(step.id, lead);
    if (Object.keys(errs).length) {
      setErrors(errs);
      track("deepapp_field_error", { vertical: slug, step: step.id, fields: Object.keys(errs) });
      return;
    }
    setErrors({});
    track("deepapp_step_completed", { vertical: slug, step: step.id });
    void autosave(lead);
    setStepIdx((i) => Math.min(APPLICATION_STEPS.length - 1, i + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStepIdx((i) => Math.max(0, i - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Submit ───────────────────────────────────────────────────────────── */
  async function submit() {
    const errs = validateStep("review", lead);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setPhase("submitting");
    setSubmitError(null);
    track("deepapp_signed", { vertical: slug });

    const submission: ApplicationSubmission = {
      ...lead,
      // Normalize capitalRequested to a clean dollar string and add a numeric
      // companion so automations receive a number without parsing "$" strings.
      capitalRequested: lead.capitalRequested,
      capitalRequestedAmount: lead.capitalRequested ? parseCurrency(lead.capitalRequested) : undefined,
      applicationStatus: "submitted",
      signedAt: new Date().toISOString(),
      ssn: ssn || undefined,
      signatureDataUrl: lead.signatureName ? makeSignatureImage(lead.signatureName) : undefined,
    } as ApplicationSubmission & { capitalRequestedAmount?: number };

    try {
      const res = await fetch("/api/application/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!res.ok) throw new Error("submit_failed");
      track("deepapp_submitted", { vertical: slug });
      clearApplicationStorage();
      setPhase("done");
    } catch {
      setPhase("form");
      setSubmitError("Something went wrong sending your application. Please try again, or call us and we'll finish it together.");
    }
  }

  /* ── Done screen (honest reward — no fabricated numbers) ──────────────── */
  if (phase === "done") {
    return (
      <div className="container-content py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-50 text-accent-700">
            <IconCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-brand-900">
            You&apos;re in underwriting{lead.firstName ? `, ${lead.firstName}` : ""}.
          </h1>
          <p className="mt-2 text-slate-600">
            Your application for <strong className="text-brand-900">{lead.businessLegalName || lead.businessName || "your business"}</strong>{" "}
            is complete and with our funding team. A specialist reviews it and reaches out{" "}
            {lead.urgency === "immediately" || lead.urgency === "this_week" ? "today" : "shortly"} with your real options.
          </p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-left text-sm text-slate-600">
            <p className="font-semibold text-brand-900">What happens next</p>
            <ul className="mt-2 space-y-1.5">
              <li className="flex gap-2"><IconCheck className="mt-px h-4 w-4 flex-none text-accent-600" /> We verify your details and statements.</li>
              <li className="flex gap-2"><IconCheck className="mt-px h-4 w-4 flex-none text-accent-600" /> A specialist matches you to funder options.</li>
              <li className="flex gap-2"><IconCheck className="mt-px h-4 w-4 flex-none text-accent-600" /> You review terms — no obligation to accept.</li>
            </ul>
          </div>
          <a href={`mailto:${contactEmail}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900">
            <IconMail className="h-4 w-4" /> Questions? {contactEmail}
          </a>
        </div>
      </div>
    );
  }

  /* ── Step body ────────────────────────────────────────────────────────── */
  function renderStep() {
    switch (step.id) {
      case "business":
        return (
          <SecureSection eyebrow={`Step 1 of 5`} title={step.title} subtitle={step.subtitle}>
            <TextField label="Legal business name" value={lead.businessLegalName ?? ""} onChange={(v) => setField("businessLegalName", v)} autoComplete="organization" error={errors.businessLegalName} />
            <TextField label="Doing business as (optional)" value={lead.businessDba ?? ""} onChange={(v) => setField("businessDba", v)} />
            <RadioCards<EntityTypeValue> legend="Business type" options={ENTITY_TYPE_OPTIONS} value={lead.entityType} onChange={(v) => setField("entityType", v)} columns={3} error={errors.entityType} />
            <TextField label="Nature of business (optional)" value={lead.natureOfBusiness ?? ""} onChange={(v) => setField("natureOfBusiness", v)} placeholder="e.g. Auto repair shop" />
            <TextField label="Business street address" value={lead.businessStreet ?? ""} onChange={(v) => setField("businessStreet", v)} autoComplete="street-address" error={errors.businessStreet} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-3"><TextField label="City" value={lead.businessCity ?? ""} onChange={(v) => setField("businessCity", v)} autoComplete="address-level2" error={errors.businessCity} /></div>
              <div className="sm:col-span-1"><Select label="State" value={lead.businessState ?? ""} onChange={(v) => setField("businessState", v)} options={US_STATES} placeholder="State" autoComplete="address-level1" error={errors.businessState} /></div>
              <div className="sm:col-span-2"><TextField label="ZIP" value={lead.businessZip ?? ""} onChange={(v) => setField("businessZip", formatZip(v))} inputMode="numeric" autoComplete="postal-code" error={errors.businessZip} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Years under current ownership" value={lead.ownershipLengthYears ?? ""} onChange={(v) => setField("ownershipLengthYears", v)} inputMode="numeric" />
              <TextField label="Date of incorporation" type="date" value={lead.dateOfIncorporation ?? ""} onChange={(v) => setField("dateOfIncorporation", v)} />
            </div>
          </SecureSection>
        );

      case "funding":
        return (
          <SecureSection eyebrow={`Step 2 of 5`} title={step.title} subtitle={step.subtitle}>
            <MaskedInput
              label="How much capital are you looking for?"
              value={lead.capitalRequested ?? ""}
              onChange={(v) => setField("capitalRequested", v)}
              format={formatCurrency}
              placeholder="$50,000"
              error={errors.capitalRequested}
              why="A specific figure helps us match the right funder amount. It's a request, not a commitment."
            />
            <RadioCards<UseOfFundsValue> legend="What will you use it for?" options={USE_OF_FUNDS_OPTIONS} value={lead.useOfFunds} onChange={(v) => setField("useOfFunds", v)} columns={2} />
            <MaskedInput
              label="EIN / Tax ID (optional now)"
              value={lead.ein ?? ""}
              onChange={(v) => setField("ein", v)}
              format={formatEin}
              placeholder="12-3456789"
              help="9-digit Tax ID from your IRS letter. Don't have it handy? Skip it — a specialist can confirm it."
              error={errors.ein}
              why="Funders use your EIN to confirm the business entity. It's a business identifier, not personal."
            />
            <RadioCards<YesNoValue> legend="Do you accept credit cards?" options={YES_NO_OPTIONS} value={lead.acceptsCreditCards} onChange={(v) => setField("acceptsCreditCards", v)} columns={2} />
            <RadioCards<YesNoValue> legend="Any open advances or MCA positions?" options={YES_NO_OPTIONS} value={lead.openMcaPositions} onChange={(v) => setField("openMcaPositions", v)} columns={2} />
            {lead.openMcaPositions === "yes" && (
              <TextField label="How many open positions?" value={lead.openMcaPositionsCount ?? ""} onChange={(v) => setField("openMcaPositionsCount", v)} inputMode="numeric" />
            )}
          </SecureSection>
        );

      case "owner":
        return (
          <SecureSection eyebrow={`Step 3 of 5`} title={step.title} subtitle={step.subtitle}>
            <TextField label="Full legal name" value={lead.ownerFullName ?? ""} onChange={(v) => setField("ownerFullName", v)} autoComplete="name" error={errors.ownerFullName} />
            <TextField label="Date of birth" type="date" value={lead.ownerDob ?? ""} onChange={(v) => setField("ownerDob", v)} error={errors.ownerDob} />
            <TextField label="Home street address" value={lead.ownerStreet ?? ""} onChange={(v) => setField("ownerStreet", v)} autoComplete="street-address" error={errors.ownerStreet} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-3"><TextField label="City" value={lead.ownerCity ?? ""} onChange={(v) => setField("ownerCity", v)} autoComplete="address-level2" error={errors.ownerCity} /></div>
              <div className="sm:col-span-1"><Select label="State" value={lead.ownerState ?? ""} onChange={(v) => setField("ownerState", v)} options={US_STATES} placeholder="State" autoComplete="address-level1" error={errors.ownerState} /></div>
              <div className="sm:col-span-2"><TextField label="ZIP" value={lead.ownerZip ?? ""} onChange={(v) => setField("ownerZip", formatZip(v))} inputMode="numeric" autoComplete="postal-code" error={errors.ownerZip} /></div>
            </div>
            <TextField label="Your ownership %" value={lead.ownershipPercent ?? ""} onChange={(v) => setField("ownershipPercent", v)} inputMode="numeric" placeholder="100" />
            <RadioCards<CreditScoreValue> legend="Roughly, your personal credit range" options={CREDIT_SCORE_OPTIONS} value={lead.creditScoreBand} onChange={(v) => setField("creditScoreBand", v)} columns={2} error={errors.creditScoreBand} />
            <SsnField value={ssn} onChange={onSsnChange} onFocusOnce={() => track("deepapp_ssn_focused", { vertical: slug })} error={errors.ssn} deferred={lead.ssnDeferred} onDefer={onSsnDefer} />
          </SecureSection>
        );

      case "documents":
        return (
          <SecureSection eyebrow="Step 4 of 5" title={step.title} subtitle={step.subtitle}>
            {lead.bankConnected ? (
              <div className="secure-surface flex items-center gap-2 p-4 text-sm font-medium text-brand-900">
                <IconCheck className="h-4 w-4 flex-none text-accent-600" /> Bank connected securely. You&apos;re set for this step.
              </div>
            ) : (
              <>
                <PlaidLink
                  applicationId={lead.applicationId}
                  onConnected={(itemId) => {
                    setLead((l) => ({ ...l, bankConnected: true, plaidItemId: itemId, bankStatementsDeferred: false }));
                    track("deepapp_upload_succeeded", { vertical: slug, method: "plaid" });
                  }}
                />
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" /> or upload <span className="h-px flex-1 bg-slate-200" />
                </div>
                <FileUpload items={files} onPick={handlePick} onRemove={removeFile} deferred={!!lead.bankStatementsDeferred} onToggleDefer={toggleDocsDefer} />
              </>
            )}
          </SecureSection>
        );

      case "review":
        return (
          <SecureSection eyebrow={`Step 5 of 5`} title={step.title} subtitle={step.subtitle}>
            <ReviewSummary lead={lead} ssn={ssn} files={files} onJump={setStepIdx} />
            <SignatureBlock
              consentCredit={!!lead.creditAuthConsent}
              onConsentCredit={(v) => setField("creditAuthConsent", v)}
              consentEsign={!!lead.esignConsent}
              onConsentEsign={(v) => setField("esignConsent", v)}
              signatureName={lead.signatureName ?? ""}
              onSignatureName={(v) => setField("signatureName", v)}
              errors={errors}
            />
            {submitError && <p className="text-sm text-red-700">{submitError}</p>}
          </SecureSection>
        );
    }
  }

  const isLast = stepIdx === APPLICATION_STEPS.length - 1;

  return (
    <div className="container-content py-8 lg:py-12">
      {/* Continuity bridge — the route changed, the brand did not */}
      <p className="mb-4 text-sm text-slate-500">
        You&apos;re still with <strong className="font-semibold text-brand-900">FundVella</strong> — finishing your{" "}
        {verticalTitle} application{lead.businessLegalName || lead.businessName ? ` for ${lead.businessLegalName || lead.businessName}` : ""}.
      </p>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,640px)] lg:gap-12">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Stepper steps={APPLICATION_STEPS} current={stepIdx} progress={progress} />
          <div className="hidden lg:block">
            <TrustPanel email={contactEmail} />
          </div>
        </aside>

        <main>
          {renderStep()}

          {/* Sticky CTA — reassurance rides with the button */}
          <div className="sticky bottom-0 z-20 -mx-5 mt-8 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <div className="flex items-center gap-3">
              {stepIdx > 0 && (
                <button type="button" onClick={goBack} className="btn-secondary flex-none sm:min-w-[120px]">
                  Back
                </button>
              )}
              {isLast ? (
                <button type="button" onClick={submit} disabled={phase === "submitting"} className="btn-primary flex-1 sm:flex-none sm:min-w-[220px]">
                  {phase === "submitting" ? "Sending…" : "Submit application securely"}
                  <IconLock className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={goNext} className="btn-primary flex-1 sm:flex-none sm:min-w-[180px]">
                  Continue
                  <IconArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="lock-note mt-2 justify-center sm:hidden">
              <IconLock className="h-3.5 w-3.5" /> Secured with bank-level encryption
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Review summary ─────────────────────────────────────────────────────── */

function ReviewSummary({
  lead,
  ssn,
  files,
  onJump,
}: {
  lead: LeadData;
  ssn: string;
  files: UploadItem[];
  onJump: (i: number) => void;
}) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Business", value: lead.businessLegalName || lead.businessName || "—", step: 0 },
    { label: "Capital requested", value: lead.capitalRequested || "—", step: 1 },
    { label: "Owner", value: lead.ownerFullName || "—", step: 2 },
    { label: "SSN", value: lead.ssnDeferred ? "By phone with specialist" : ssn ? `•••-••-${ssn.replace(/\D/g, "").slice(-4)}` : "—", step: 2 },
    { label: "Bank statements", value: lead.bankStatementsDeferred ? "Sending to specialist" : `${files.filter((f) => f.status !== "error").length} uploaded`, step: 3 },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {rows.map((r, i) => (
        <div key={r.label} className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${i % 2 ? "bg-white" : "bg-slate-50/60"}`}>
          <span className="text-slate-500">{r.label}</span>
          <span className="flex items-center gap-3">
            <span className="font-medium text-brand-900">{r.value}</span>
            <button type="button" onClick={() => onJump(r.step)} className="text-xs font-semibold text-brand-700 underline">
              Edit
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
