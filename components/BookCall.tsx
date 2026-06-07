"use client";

import { track } from "@/lib/analytics";
import { CALCOM_LINK } from "@/lib/site";

/**
 * Cal.com booking, config-driven. Set NEXT_PUBLIC_CALCOM_LINK in Netlify (or
 * CALCOM_LINK in lib/site.ts) to your booking handle (e.g.
 * "fundvella/fundvella-discovery-call" or a full https URL) to switch it on.
 * Opens the booking page prefilled with the lead's name + email, so they only
 * pick a time. When unset, CALCOM_ENABLED is false and the parent shows the
 * "we'll call you" fallback. Link-based on purpose: zero deps, no SSR risk.
 */
const RAW = process.env.NEXT_PUBLIC_CALCOM_LINK || CALCOM_LINK;
export const CALCOM_ENABLED = Boolean(RAW);

export default function BookCall({
  vertical,
  name,
  email,
  notes,
  label = "Grab a time now",
  className = "",
}: {
  vertical: string;
  name?: string;
  email?: string;
  notes?: string;
  label?: string;
  className?: string;
}) {
  if (!RAW) return null;
  const base = RAW.startsWith("http") ? RAW : `https://cal.com/${RAW}`;
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (notes) params.set("notes", notes);
  const href = params.toString() ? `${base}?${params.toString()}` : base;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("booking_opened", { vertical })}
      className={`btn-primary ${className}`}
    >
      {label}
    </a>
  );
}
