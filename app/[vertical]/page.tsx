import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LandingPageTemplate from "@/components/LandingPageTemplate";
import { getVerticalBySlug, getActiveVerticals } from "@/content/landingPagesConfig";
import { getSiteUrl } from "@/lib/site";

// Only the configured verticals exist; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams(): { vertical: string }[] {
  return getActiveVerticals().map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: slug } = await params;
  const v = getVerticalBySlug(slug);
  if (!v) return {};
  const url = `${getSiteUrl()}/${v.slug}`;
  return {
    title: { absolute: v.seoTitle },
    description: v.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: v.seoTitle,
      description: v.seoDescription,
      url,
      type: "website",
      siteName: "Merchant Capital Review",
    },
    twitter: { card: "summary_large_image", title: v.seoTitle, description: v.seoDescription },
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const v = getVerticalBySlug(slug);
  if (!v) notFound();

  // FAQ structured data for rich results.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPageTemplate vertical={v} />
    </>
  );
}
