"use client";

import { useEffect, useState } from "react";
import CTAButton from "./CTAButton";

/**
 * Mobile-only sticky CTA. Appears after the user scrolls past the hero and hides
 * while the prequalification form is in view (so it never overlaps the form).
 */
export default function StickyCTA({ vertical, label }: { vertical: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let scrolled = false;
    let formInView = false;
    const update = () => setShow(scrolled && !formInView);

    const onScroll = () => {
      scrolled = window.scrollY > 600;
      update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.querySelector("#prequalify");
    let io: IntersectionObserver | undefined;
    if (target) {
      io = new IntersectionObserver(
        ([entry]) => {
          formInView = entry.isIntersecting;
          update();
        },
        { threshold: 0 },
      );
      io.observe(target);
    }

    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-lift backdrop-blur transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <CTAButton label={label} location="sticky_mobile" vertical={vertical} className="w-full" />
    </div>
  );
}
