"use client";

import type { ReactNode } from "react";

/** Presentational wrapper for a single step: heading + fields + footer nav. */
export default function FormStep({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold tracking-tight text-brand-900">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      <div className="mt-6 space-y-6">{children}</div>
      <div className="mt-8 flex items-center justify-between gap-3">{footer}</div>
    </div>
  );
}
