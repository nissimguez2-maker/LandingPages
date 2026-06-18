"use client";

/**
 * Credit-runway interest form.
 *
 * Captures a light lead via the EXISTING /api/lead route (same wire shape as the
 * stress test / apply submit), tagged source:"credit-runway" so downstream can
 * route it to the credit-restoration path rather than a funding offer.
 *
 * CROA-safe: this is NOT a loan application and promises no outcome. The button
 * and copy reflect that. No upfront fees / 3-day cancel are stated on the page.
 */

import { useState } from "react";

import { PhoneField, TextField, Checkbox } from "@/components/prequal/Fields";
import { getStoredUtm } from "@/lib/utm";
import { track } from "@/lib/analytics";
import { CREDIT_RUNWAY } from "@/content/creditRunway";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 10;

export default function CreditRunwayForm() {
  const [firstName, setFirstName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Add your first name.";
    if (!phoneOk(phone) && !emailOk(email)) {
      e.contact = "Add a phone or email so a specialist can reach you.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting || done) return;
    if (!validate()) return;

    setSubmitting(true);
    track("cta_clicked", { location: "credit-runway", action: "credit_runway_submit" });

    const payload = {
      firstName: firstName.trim() || undefined,
      businessName: businessName.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      marketingConsent: consent,
      industry: "credit-runway",
      sourcePage: typeof window !== "undefined" ? window.location.href : undefined,
      source: CREDIT_RUNWAY.leadSource,
      utm: getStoredUtm(),
      partial: false,
      // Honeypot — bots fill this hidden field; the server acks but emits nothing.
      company_website: honeypot,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (res.ok) {
        track("partial_lead_saved", { location: "credit-runway" });
        setDone(true);
        return;
      }
    } catch {
      /* best effort */
    }
    // Even if the network hiccups, never leave the owner at a dead end.
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-brand-50/70 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-brand-900 font-display">{CREDIT_RUNWAY.formSuccessHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{CREDIT_RUNWAY.formSuccessBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-lift sm:p-8" noValidate>
      <h2 className="text-xl font-bold text-brand-900 font-display">{CREDIT_RUNWAY.formHeading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{CREDIT_RUNWAY.formIntro}</p>

      {/* honeypot */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          value={firstName}
          onChange={setFirstName}
          autoComplete="given-name"
          error={errors.firstName}
        />
        <TextField
          label="Business name (optional)"
          value={businessName}
          onChange={setBusinessName}
          autoComplete="organization"
        />
        <PhoneField label="Phone" value={phone} onChange={setPhone} />
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </div>

      {errors.contact && <p className="mt-3 text-sm text-red-700">{errors.contact}</p>}

      <div className="mt-4">
        <Checkbox
          label="It's okay to contact me about the credit runway and, when I'm fundable, my funding options."
          checked={consent}
          onChange={setConsent}
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto">
        {submitting ? "Sending…" : CREDIT_RUNWAY.formCta}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        This is not a loan application. Credit restoration disputes inaccurate or questionable items and promises
        no specific score, number of deletions, or outcome. There are no upfront fees, and you can cancel within
        three business days.
      </p>
    </form>
  );
}
