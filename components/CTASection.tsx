import type { VerticalConfig } from "@/lib/types";
import CTAButton from "./CTAButton";

/** Mid/late-page conversion band. Uses the third approved CTA label. */
export default function CTASection({ vertical }: { vertical: VerticalConfig }) {
  return (
    <section className="bg-brand-900">
      <div className="container-content py-14 text-center sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          See what you may qualify for
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          Start a quick prequalification based on your revenue and bank activity.
        </p>
        <div className="mt-7 flex justify-center">
          <CTAButton label="See What You May Qualify For" location="cta_band" vertical={vertical.slug} />
        </div>
      </div>
    </section>
  );
}
