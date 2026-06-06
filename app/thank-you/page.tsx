import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";
import { getVerticalBySlug } from "@/content/landingPagesConfig";

export const metadata: Metadata = {
  title: "Thank you",
  // Thank-you pages should not be indexed.
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const vertical = v ? getVerticalBySlug(v) : undefined;
  return <ThankYou verticalTitle={vertical?.title} />;
}
