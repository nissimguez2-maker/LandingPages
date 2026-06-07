import type { VerticalConfig } from "@/lib/types";
import CTAButton from "./CTAButton";

/** Late-page conversion band. One canonical action, pointing to the stress test. */
export default function CTASection({ vertical }: { vertical: VerticalConfig }) {
  return (
    <section className="bg-brand-900">
      <div className="container-content py-14 text-center sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white font-display sm:text-3xl">
          The gap will not close on its own
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          Take the 2-minute check and see where your money runs short, before the next slow week.
        </p>
        <div className="mt-7 flex justify-center">
          <CTAButton label={vertical.cta.primary} target="#estimate" location="cta_band" vertical={vertical.slug} />
        </div>
      </div>
    </section>
  );
}
