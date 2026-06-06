import type { ReactNode } from "react";

/**
 * Inline-SVG icon registry — no image files, no network cost (matches the
 * "system stack, no web-font fetch" philosophy). Add a key + path to extend.
 */
const PATHS: Record<string, ReactNode> = {
  // Trust signals
  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  "user-check": (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 12.5l2 2 3.5-3.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16" />
      <path d="M6 8h12" />
      <path d="M6 8l-3 6h6l-3-6z" />
      <path d="M18 8l-3 6h6l-3-6z" />
      <path d="M8 20h8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  // Use cases
  tools: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z" />,
  inventory: (
    <>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </>
  ),
  payroll: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M9.5 9.7c0-1 1-1.6 2.5-1.6s2.5.6 2.5 1.6-1 1.5-2.5 1.5-2.5.6-2.5 1.6 1 1.6 2.5 1.6 2.5-.6 2.5-1.6" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
    </>
  ),
  marketing: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </>
  ),
  vehicle: (
    <>
      <path d="M3 13l1.5-5h10l3 4h2.5v5H19" />
      <path d="M3 13v4h2" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
      <path d="M9.3 17.5h5.4" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M3 4h2l2.3 11h10l2-8H6.2" />
    </>
  ),
  spark: <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />,
};

export default function Icon({
  name,
  className = "h-6 w-6",
}: {
  name?: string;
  className?: string;
}) {
  const path = name ? PATHS[name] : null;
  if (!path) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
