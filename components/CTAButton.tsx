"use client";

import { track } from "@/lib/analytics";

interface CTAButtonProps {
  label: string;
  /** Anchor to scroll to (default: the Cash-Flow Stress Test). */
  target?: string;
  /** Where on the page this CTA lives (for analytics). */
  location: string;
  vertical: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Primary conversion element. Fires `cta_clicked`, then smooth-scrolls to the
 * prequalification form (Fogg: keep the prompt one tap from the action).
 */
export default function CTAButton({
  label,
  target = "#estimate",
  location,
  vertical,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const onClick = () => {
    track("cta_clicked", { label, location, vertical });
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const input = el.querySelector<HTMLElement>("input, button, [tabindex]");
      window.setTimeout(() => input?.focus({ preventScroll: true }), 500);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {label}
    </button>
  );
}
