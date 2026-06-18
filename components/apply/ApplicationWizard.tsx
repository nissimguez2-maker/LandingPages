"use client";

/**
 * The deep application — a 3-step, autosaving, resumable wizard a qualified
 * prequal lead is handed off to. Ordered by ascending sensitivity × sunk cost:
 *   1) Business facts + the funding ask (merged — one screen, fewer taps)
 *   2) Owner identity (SSN + DOB are OPTIONAL; SSN never appears on screen 1)
 *   3) Documents + review + e-sign (statements folded in; never a gate)
 *
 * Friction cuts vs. the old 5-step flow:
 *   - One AddressAutocomplete fills street/city/state/zip from a single input;
 *     "owner address same as business" hides the second address entirely.
 *   - Entity type & credit band soft-advance focus on select.
 *   - Capital + state arrive prefilled from the prequal.
 *   - SSN, DOB and signature are optional — they never block submit.
 *
 * Raw SSN + signature image live only in local component state and the single
 * final submit POST; they are never written to the autosave/draft/analytics.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AddressAutocomplete,
  CheckCards,
  Combobox,
  RadioCards,
  TextField,
  type AddressValue,
} from "@/components/prequal/Fields";
import {
  FileUpload,
  IconArrowRight,
  IconCheck,
  IconLock,
  IconMail,
  MaskedInput,
  OptionalDocUpload,
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
  capitalFromAmountBand,
  computeApplicationProgress,
  PROGRESS_BASELINE,
  formatCurrency,
  formatEin,
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
  NATURE_OF_BUSINESS_OPTIONS,
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
  const [voidedCheckUploads, setVoidedCheckUploads] = useState<UploadItem[]>([]);
  const [ownerIdUploads, setOwnerIdUploads] = useState<UploadItem[]>([]);
  const [phase, setPhase] = useState<Phase>("form");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = APPLICATION_STEPS[stepIdx];
  const totalSteps = APPLICATION_STEPS.length;
  const progress = useMemo(() => computeApplicationProgress(lead), [lead]);
  const formRef = useRef<HTMLElement>(null);

  /**
   * After a failed Continue/Submit, move the user's attention to the first
   * field that needs fixing. Non-destructive: it only scrolls/focuses what's
   * already flagged (every field sets aria-invalid="true" on error). RadioCards
   * mark a non-focusable <fieldset>, so we fall back to its first focusable child.
   */
  function focusFirstError() {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const root = formRef.current;
      if (!root) return;
      const flagged = root.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (!flagged) return;
      flagged.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusTarget =
        typeof flagged.focus === "function" && flagged.tabIndex >= 0
          ? flagged
          : flagged.querySelector<HTMLElement>("input, select, textarea, button, [tabindex]");
      try {
        focusTarget?.focus({ preventScroll: true });
      } catch {
        /* focus is best-effort */
      }
    });
  }

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

  /**
   * Soft "auto-advance" for a radio choice that isn't the last field on its
   * screen (entity type, credit band): set the value, clear any error, then
   * smooth-scroll the next field group into view so the owner doesn't hunt for
   * it. This is the per-field analogue of the prequal's chooseAndAdvance — the
   * selection itself moves the form forward — without skipping required fields.
   */
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  }, []);
  /**
   * `groupName` is the radio group's name (RadioCards uses slug(legend)). After
   * selecting, we locate that group's <fieldset> and move focus/scroll to the
   * next focusable form control after it — robust to generated field ids.
   */
  function chooseAndAdvance<K extends keyof LeadData>(k: K, v: LeadData[K], groupName: string) {
    setField(k, v);
    setErrors((e) => ({ ...e, [k as string]: "" }));
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      const root = formRef.current;
      if (!root) return;
      const radio = root.querySelector<HTMLElement>(`input[name="${groupName}"]`);
      const fieldset = radio?.closest("fieldset");
      if (!fieldset) return;
      // Find the first focusable control that comes after this fieldset in DOM order.
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>("input:not([type=hidden]), select, textarea, [role=combobox]"),
      );
      const after = focusables.find(
        (el) => !fieldset.contains(el) && fieldset.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      if (!after) return;
      after.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        after.focus({ preventScroll: true });
      } catch {
        /* best effort */
      }
    }, 350);
  }

  /* ── Mount: hydrate from a resume token, the prequal handoff, or a draft ─ */
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const prefill = readApplicationPrefill();
      const draft = readApplicationDraft();
      const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("app") : null;

      // Continuation-only: /apply is the room you enter AFTER the funding check, not a cold
      // front door. A direct hit with no prequal prefill, no saved draft, and no resume token
      // is sent through the one front door (the quiz), where the lead is captured before the
      // heavy application — so we never show a blank "you're 60% done" form. (Plan Phase 3.)
      // The route stays alive for ?app= resume links and ad/bookmark edge cases.
      const hasPrefill = Object.keys(prefill).length > 0;
      const hasDraft = !!draft && Object.keys(draft).length > 0;
      if (!hasPrefill && !hasDraft && !token) {
        if (typeof window !== "undefined") window.location.replace(`/${slug}#estimate`);
        return;
      }

      let merged: LeadData = { industry: slug, applicationStatus: "in_progress", ...prefill, ...(draft ?? {}) };
      let resumed = Boolean(draft);

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

      // ── Prequal → apply bridge: carry over what we already know ───────────
      if (!merged.ownerFullName && (merged.firstName || merged.lastName)) {
        merged.ownerFullName = [merged.firstName, merged.lastName].filter(Boolean).join(" ");
      }
      if (!merged.businessLegalName && merged.businessName) merged.businessLegalName = merged.businessName;

      // Use-of-funds: the prequal captured a single value; fold it into the
      // deep-apply multi-select so the owner sees their choice pre-checked.
      if ((!merged.useOfFundsList || merged.useOfFundsList.length === 0) && merged.useOfFunds) {
        merged.useOfFundsList = [merged.useOfFunds];
      }
      // Seed business + owner state from the single prequal `state`.
      if (merged.state) {
        if (!merged.businessState) merged.businessState = merged.state;
        if (!merged.ownerState) merged.ownerState = merged.state;
      }
      // Seed a starting capital figure from the prequal amount band (editable).
      if (!merged.capitalRequested) {
        const seeded = capitalFromAmountBand(merged.amountNeeded);
        if (seeded) merged.capitalRequested = seeded;
      }
      // Default "owner address same as business" ON for sole proprietors (their
      // home and business address are usually the same), unless already set or
      // an owner address was already captured.
      if (
        typeof merged.ownerAddressSameAsBusiness !== "boolean" &&
        !merged.ownerStreet &&
        merged.entityType === "sole_prop"
      ) {
        merged.ownerAddressSameAsBusiness = true;
      }

      setLead(merged);
      const source = token ? "resume" : hasPrefill ? "stresstest" : hasDraft ? "draft" : "direct";
      track(resumed ? "deepapp_resumed" : "deepapp_started", { vertical: slug, source });
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
                formCompletionPercentage: computeApplicationProgress(l),
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

  /* ── SSN (optional) ───────────────────────────────────────────────────── */
  function onSsnChange(formatted: string) {
    setSsn(formatted);
    const valid = isValidSsn(formatted);
    const wasValid = !!lead.ssnProvided;
    setLead((l) => ({
      ...l,
      ssnProvided: valid,
      ssnLast4: valid ? ssnLast4(formatted) : undefined,
      ssnDeferred: false,
      // Clearing the SSN withdraws the soft-pull authorization automatically.
      creditAuthConsent: valid ? l.creditAuthConsent : false,
    }));
    if (valid && !wasValid) track("deepapp_ssn_completed", { vertical: slug });
    if (errors.ssn && valid) setErrors((e) => ({ ...e, ssn: "" }));
  }

  function onSsnDefer(deferred: boolean) {
    setSsn("");
    setLead((l) => ({ ...l, ssnDeferred: deferred, ssnProvided: false, ssnLast4: undefined, creditAuthConsent: false }));
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

  /* ── Optional core-file docs (voided check, owner ID) ─────────────────────
   * Same upload-or-defer pattern as bank statements, parameterized so each slot
   * writes to its own LeadData list + deferred flag. Always optional, never gates. */
  function makeDocSlot(
    setUploads: React.Dispatch<React.SetStateAction<UploadItem[]>>,
    filesKey: "voidedCheckFiles" | "ownerIdFiles",
    deferredKey: "voidedCheckDeferred" | "ownerIdDeferred",
    docKind: string,
  ) {
    const onPick = async (picked: File[]) => {
      const tooBig = (f: File) => f.size > 15 * 1024 * 1024;
      const wrongType = (f: File) => !(f.type === "application/pdf" || f.type.startsWith("image/"));
      for (const file of picked) {
        if (tooBig(file) || wrongType(file)) {
          setUploads((fs) => [
            ...fs,
            { id: uid(), name: file.name, size: file.size, status: "error", error: "Use a PDF/JPG/PNG under 15 MB." },
          ]);
          continue;
        }
        const id = uid();
        setUploads((fs) => [...fs, { id, name: file.name, size: file.size, status: "uploading" }]);
        track("deepapp_upload_started", { vertical: slug, doc: docKind });
        const meta = await uploadOne(file);
        setUploads((fs) => fs.map((x) => (x.id === id ? { ...x, status: "done" } : x)));
        setLead((l) => ({
          ...l,
          [deferredKey]: false,
          [filesKey]: [
            ...(l[filesKey] ?? []),
            { name: file.name, size: file.size, type: file.type, storageKey: meta.storageKey },
          ],
        }));
        track("deepapp_upload_succeeded", { vertical: slug, doc: docKind });
      }
    };
    const onRemove = (id: string) => {
      let target: UploadItem | undefined;
      setUploads((fs) => {
        target = fs.find((f) => f.id === id);
        return fs.filter((f) => f.id !== id);
      });
      if (target && target.status !== "error") {
        const name = target.name;
        setLead((l) => ({
          ...l,
          [filesKey]: (l[filesKey] ?? []).filter((f) => f.name !== name),
        }));
      }
    };
    const onToggleDefer = (deferred: boolean) => {
      setField(deferredKey, deferred);
      if (deferred) track("deepapp_docs_deferred", { vertical: slug, doc: docKind });
    };
    return { onPick, onRemove, onToggleDefer };
  }

  const voidedCheckSlot = makeDocSlot(setVoidedCheckUploads, "voidedCheckFiles", "voidedCheckDeferred", "voided_check");
  const ownerIdSlot = makeDocSlot(setOwnerIdUploads, "ownerIdFiles", "ownerIdDeferred", "owner_id");

  /* ── Address bridges (one input fills street/city/state/zip) ──────────── */
  const businessAddress: AddressValue = {
    street: lead.businessStreet ?? "",
    city: lead.businessCity ?? "",
    state: lead.businessState ?? "",
    zip: lead.businessZip ?? "",
  };
  function setBusinessAddress(a: AddressValue) {
    setLead((l) => ({ ...l, businessStreet: a.street, businessCity: a.city, businessState: a.state, businessZip: a.zip }));
    setErrors((e) => ({ ...e, businessStreet: "", businessCity: "", businessState: "", businessZip: "" }));
  }
  const ownerAddress: AddressValue = {
    street: lead.ownerStreet ?? "",
    city: lead.ownerCity ?? "",
    state: lead.ownerState ?? "",
    zip: lead.ownerZip ?? "",
  };
  function setOwnerAddress(a: AddressValue) {
    setLead((l) => ({ ...l, ownerStreet: a.street, ownerCity: a.city, ownerState: a.state, ownerZip: a.zip }));
    setErrors((e) => ({ ...e, ownerStreet: "", ownerCity: "", ownerState: "", ownerZip: "" }));
  }
  function setOwnerSameAsBusiness(checked: boolean) {
    setLead((l) => {
      if (checked) {
        // Copy business → owner immediately so review + submit reflect it.
        return {
          ...l,
          ownerAddressSameAsBusiness: true,
          ownerStreet: l.businessStreet,
          ownerCity: l.businessCity,
          ownerState: l.businessState ?? l.ownerState,
          ownerZip: l.businessZip,
        };
      }
      return { ...l, ownerAddressSameAsBusiness: false };
    });
    if (checked) setErrors((e) => ({ ...e, ownerStreet: "", ownerCity: "", ownerState: "", ownerZip: "" }));
  }

  /* ── Use of funds (multi-select) ──────────────────────────────────────── */
  const usesSelected = lead.useOfFundsList ?? [];
  function setUses(next: UseOfFundsValue[]) {
    setLead((l) => ({
      ...l,
      useOfFundsList: next,
      // Drop the free-text note if "other" is no longer selected.
      useOfFundsOther: next.includes("other") ? l.useOfFundsOther : "",
    }));
    if (next.length) setErrors((e) => ({ ...e, useOfFundsList: "" }));
  }

  /* ── Navigation ───────────────────────────────────────────────────────── */
  function goNext() {
    const errs = validateStep(step.id, lead);
    if (Object.keys(errs).length) {
      setErrors(errs);
      track("deepapp_field_error", { vertical: slug, step: step.id, fields: Object.keys(errs) });
      focusFirstError();
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
      focusFirstError();
      return;
    }
    setPhase("submitting");
    setSubmitError(null);
    track("deepapp_signed", { vertical: slug });

    // If "owner address same as business" is on, copy at submit too (covers a late
    // business-address edit). Mirror the first selected use-of-funds back to the
    // scalar `useOfFunds` so scoring/automations that read a single value keep working.
    const sameAddr = lead.ownerAddressSameAsBusiness
      ? {
          ownerStreet: lead.businessStreet,
          ownerCity: lead.businessCity,
          ownerState: lead.businessState,
          ownerZip: lead.businessZip,
        }
      : {};

    const submission: ApplicationSubmission = {
      ...lead,
      ...sameAddr,
      useOfFunds: lead.useOfFundsList?.[0] ?? lead.useOfFunds,
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
          <SecureSection eyebrow={`Step 1 of ${totalSteps}`} title={step.title} subtitle={step.subtitle}>
            <TextField label="Legal business name" value={lead.businessLegalName ?? ""} onChange={(v) => setField("businessLegalName", v)} autoComplete="organization" error={errors.businessLegalName} />
            <TextField
              label="Trade name / DBA (if different from legal name)"
              value={lead.businessDba ?? ""}
              onChange={(v) => setField("businessDba", v)}
              help="The name customers see, if different from your legal name."
            />
            <RadioCards<EntityTypeValue>
              legend="Business type"
              options={ENTITY_TYPE_OPTIONS}
              value={lead.entityType}
              onChange={(v) => chooseAndAdvance("entityType", v, "business-type")}
              columns={3}
              error={errors.entityType}
            />
            <Combobox
              label="What your business does"
              value={lead.natureOfBusiness ?? ""}
              onChange={(v) => setField("natureOfBusiness", v)}
              groups={NATURE_OF_BUSINESS_OPTIONS}
              placeholder="e.g. Auto repair shop"
              help="Type it or pick the closest — whatever you enter is fine."
            />

            <AddressAutocomplete
              legend="Business address"
              value={businessAddress}
              onChange={setBusinessAddress}
              usStates={US_STATES}
              streetAutoComplete="street-address"
              errors={{ street: errors.businessStreet, city: errors.businessCity, state: errors.businessState, zip: errors.businessZip }}
            />
            <TextField label="Business start date" type="date" value={lead.dateOfIncorporation ?? ""} onChange={(v) => setField("dateOfIncorporation", v)} help="When the business started operating. A specialist can confirm the exact date later." />

            {/* ── Funding ask (merged from the old separate step) ─────────── */}
            <div className="space-y-5 border-t border-slate-200 pt-5">
              <MaskedInput
                label="How much capital are you looking for?"
                value={lead.capitalRequested ?? ""}
                onChange={(v) => setField("capitalRequested", v)}
                format={formatCurrency}
                placeholder="$50,000"
                error={errors.capitalRequested}
                why="A specific figure helps us match the right funder amount. It's a request, not a commitment."
              />
              <CheckCards<UseOfFundsValue>
                legend="What will you use it for?"
                help="Pick all that apply."
                options={USE_OF_FUNDS_OPTIONS}
                values={usesSelected}
                onChange={setUses}
                columns={2}
                error={errors.useOfFundsList}
              />
              {usesSelected.includes("other") && (
                <TextField
                  label="Tell us a bit more (optional)"
                  value={lead.useOfFundsOther ?? ""}
                  onChange={(v) => setField("useOfFundsOther", v)}
                  placeholder="What you'd put the funds toward"
                />
              )}
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
            </div>
          </SecureSection>
        );

      case "owner":
        return (
          <SecureSection eyebrow={`Step 2 of ${totalSteps}`} title={step.title} subtitle={step.subtitle}>
            <TextField label="Full legal name" value={lead.ownerFullName ?? ""} onChange={(v) => setField("ownerFullName", v)} autoComplete="name" error={errors.ownerFullName} />

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={!!lead.ownerAddressSameAsBusiness}
                  onChange={(e) => setOwnerSameAsBusiness(e.target.checked)}
                  className="mt-0.5 h-5 w-5 flex-none rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  Owner address same as business address
                  <span className="mt-0.5 block text-xs text-slate-400">
                    We&apos;ll use{" "}
                    {lead.businessStreet ? (
                      <span className="text-slate-500">
                        {[lead.businessStreet, lead.businessCity, lead.businessState].filter(Boolean).join(", ")}
                      </span>
                    ) : (
                      "your business address"
                    )}
                    .
                  </span>
                </span>
              </label>
            </div>

            {!lead.ownerAddressSameAsBusiness && (
              <AddressAutocomplete
                legend="Home address"
                value={ownerAddress}
                onChange={setOwnerAddress}
                usStates={US_STATES}
                streetAutoComplete="street-address"
                errors={{ street: errors.ownerStreet, city: errors.ownerCity, state: errors.ownerState, zip: errors.ownerZip }}
              />
            )}

            <TextField label="Your ownership %" value={lead.ownershipPercent ?? ""} onChange={(v) => setField("ownershipPercent", v)} inputMode="numeric" placeholder="100" />
            <RadioCards<CreditScoreValue>
              legend="Roughly, your personal credit range"
              options={CREDIT_SCORE_OPTIONS}
              value={lead.creditScoreBand}
              onChange={(v) => chooseAndAdvance("creditScoreBand", v, "roughly-your-personal-credit-range")}
              columns={2}
              error={errors.creditScoreBand}
            />
            <TextField
              label="Date of birth (optional)"
              type="date"
              value={lead.ownerDob ?? ""}
              onChange={(v) => setField("ownerDob", v)}
              help="Optional — your specialist can confirm this on the call."
            />
            <SsnField
              value={ssn}
              onChange={onSsnChange}
              onFocusOnce={() => track("deepapp_ssn_focused", { vertical: slug })}
              error={errors.ssn}
              deferred={lead.ssnDeferred}
              onDefer={onSsnDefer}
              consentSoftPull={!!lead.creditAuthConsent}
              onConsentSoftPull={(v) => setField("creditAuthConsent", v)}
            />
          </SecureSection>
        );

      case "review":
        return (
          <SecureSection eyebrow={`Step 3 of ${totalSteps}`} title={step.title} subtitle={step.subtitle}>
            {/* ── Documents folded into review (never a gate) ─────────────── */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-brand-900">Recent bank statements</p>
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
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="h-px flex-1 bg-slate-200" /> or upload <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <FileUpload items={files} onPick={handlePick} onRemove={removeFile} deferred={!!lead.bankStatementsDeferred} onToggleDefer={toggleDocsDefer} />
                </>
              )}

              {/* Optional core-file extras (§3) — never required, fully deferrable. */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Optional — speeds up funding if you have them handy
                </p>
                <OptionalDocUpload
                  title="Voided business check"
                  hint="A voided check from your business account confirms where funds get deposited. No worries if you don't have one now."
                  items={voidedCheckUploads}
                  onPick={voidedCheckSlot.onPick}
                  onRemove={voidedCheckSlot.onRemove}
                  deferred={!!lead.voidedCheckDeferred}
                  onToggleDefer={voidedCheckSlot.onToggleDefer}
                />
                <OptionalDocUpload
                  title="Owner ID / driver's license"
                  hint="A photo of your driver's license or state ID helps verify your identity faster. You can also send it to a specialist later."
                  items={ownerIdUploads}
                  onPick={ownerIdSlot.onPick}
                  onRemove={ownerIdSlot.onRemove}
                  deferred={!!lead.ownerIdDeferred}
                  onToggleDefer={ownerIdSlot.onToggleDefer}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <p className="mb-3 text-sm font-semibold text-brand-900">Review your application</p>
              <ReviewSummary lead={lead} ssn={ssn} files={files} onJump={setStepIdx} />
            </div>

            <SignatureBlock
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
          <Stepper steps={APPLICATION_STEPS} current={stepIdx} progress={progress} baseline={PROGRESS_BASELINE} />
          <div className="block">
            <TrustPanel email={contactEmail} />
          </div>
        </aside>

        <main ref={formRef}>
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
  const useLabels = (lead.useOfFundsList ?? [])
    .map((v) => USE_OF_FUNDS_OPTIONS.find((o) => o.value === v)?.label ?? v)
    .join(", ");
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Business", value: lead.businessLegalName || lead.businessName || "—", step: 0 },
    { label: "Capital requested", value: lead.capitalRequested || "—", step: 0 },
    { label: "Use of funds", value: useLabels || "—", step: 0 },
    { label: "Owner", value: lead.ownerFullName || "—", step: 1 },
    {
      label: "SSN",
      value: lead.ssnDeferred
        ? "By phone with specialist"
        : ssn
          ? `•••-••-${ssn.replace(/\D/g, "").slice(-4)}`
          : "Optional — skipped",
      step: 1,
    },
    { label: "Bank statements", value: lead.bankStatementsDeferred ? "Sending to specialist" : `${files.filter((f) => f.status !== "error").length} uploaded`, step: 2 },
    {
      label: "Voided check",
      value: (lead.voidedCheckFiles?.length ?? 0) > 0 ? "Uploaded" : lead.voidedCheckDeferred ? "Sending later" : "Optional — not added",
      step: 2,
    },
    {
      label: "Owner ID",
      value: (lead.ownerIdFiles?.length ?? 0) > 0 ? "Uploaded" : lead.ownerIdDeferred ? "Sending later" : "Optional — not added",
      step: 2,
    },
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
