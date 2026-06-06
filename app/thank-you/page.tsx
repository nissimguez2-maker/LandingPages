import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";

export const metadata: Metadata = {
  title: "Thank you",
  // Thank-you pages should not be indexed.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
