"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { CALCOM_LINK } from "@/lib/site";

const RAW = process.env.NEXT_PUBLIC_CALCOM_LINK || CALCOM_LINK;
const handle = (v: string) => v.replace(/^https?:\/\/(app\.)?cal\.com\//, "").replace(/^\/+/, "");

// Official Cal.com embed bootstrap (queues calls until embed.js loads).
const SNIPPET = `(function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)}})(window,"https://app.cal.com/embed/embed.js","init");`;

/**
 * Cal.com INLINE embed. Renders the booking calendar on our own page (no
 * redirect), prefilled with the lead's name + email, and fires booking_confirmed
 * on a successful booking. Client-only; only mounts in the unlocked payoff so it
 * never weighs on the initial load. A small fallback link covers the rare case
 * where the embed script is blocked.
 */
export default function BookCallInline({
  vertical,
  name,
  email,
  notes,
}: {
  vertical: string;
  name?: string;
  email?: string;
  notes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!RAW || !ref.current) return;
    const el = ref.current;
    const w = window as unknown as { Cal?: (...a: unknown[]) => void };
    if (!w.Cal) {
      const s = document.createElement("script");
      s.textContent = SNIPPET;
      document.head.appendChild(s);
    }
    const Cal = (window as unknown as { Cal?: (...a: unknown[]) => void }).Cal;
    if (!Cal) return;
    try {
      Cal("init", { origin: "https://cal.com" });
      el.innerHTML = "";
      Cal("inline", {
        elementOrSelector: el,
        calLink: handle(RAW),
        config: { name: name || "", email: email || "", notes: notes || "", layout: "month_view" },
      });
      Cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
      Cal("on", { action: "bookingSuccessful", callback: () => track("booking_confirmed", { vertical }) });
      track("booking_opened", { vertical });
    } catch {
      /* ignore */
    }
    return () => {
      el.innerHTML = "";
    };
  }, [name, email, notes, vertical]);

  if (!RAW) return null;
  const base = RAW.startsWith("http") ? RAW : `https://cal.com/${handle(RAW)}`;
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (notes) params.set("notes", notes);
  const fallbackUrl = params.toString() ? `${base}?${params.toString()}` : base;

  return (
    <div>
      <div className="relative min-h-[560px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Loading the calendar&hellip;
        </div>
        {/* Cal.com renders its booking iframe into this node, painting over the loader. */}
        <div ref={ref} className="relative h-full min-h-[560px] w-full" />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Trouble loading the calendar?{" "}
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
          Open it here
        </a>
        .
      </p>
    </div>
  );
}
