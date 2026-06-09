import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ApplicationWizard from "@/components/apply/ApplicationWizard";
import { getVerticalBySlug, getActiveVerticals, generalFunding } from "@/content/landingPagesConfig";
import { accentCssVars } from "@/lib/themes";

// Only the configured verticals (plus the general funding page) exist; unknown
// slugs 404 (mirrors the landing route).
export const dynamicParams = false;

/** Resolve a vertical OR the general small-business funding page by slug. */
function resolveVertical(slug: string) {
  return getVerticalBySlug(slug) ?? (slug === generalFunding.slug ? generalFunding : undefined);
}

export function generateStaticParams(): { vertical: string }[] {
  return [...getActiveVerticals(), generalFunding].map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: slug } = await params;
  const v = resolveVertical(slug);
  if (!v) return {};
  return {
    title: { absolute: `Apply — ${v.title} | FundVella` },
    description: `Complete your ${v.title} funding application.`,
    // Application pages are private; keep them out of the index.
    robots: { index: false, follow: false },
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const v = resolveVertical(slug);
  if (!v) notFound();

  // The application shell pins ONE calm accent (default emerald) regardless of the
  // referring vertical — a loud color on an SSN screen reads as marketing, not a vault.
  return (
    <div style={accentCssVars()} className="min-h-screen bg-slate-50/40">
      <ApplicationWizard slug={v.slug} verticalTitle={v.title} />
    </div>
  );
}
