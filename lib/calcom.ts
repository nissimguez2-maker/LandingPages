/**
 * Shared cal.com embed loader, namespaced to the booking event exactly like the
 * snippet cal.com generates (Cal.ns["discover-call"], origin app.cal.com). One
 * bootstrap, reused by the on-page inline calendar (the payoff) and the floating
 * popup bubble (the fallback). Configure with NEXT_PUBLIC_CALCOM_LINK in Netlify
 * or CALCOM_LINK in lib/site.ts. When unset, CALCOM_ENABLED is false and every
 * cal.com surface stays hidden.
 */
import { CALCOM_LINK } from "@/lib/site";

const RAW = process.env.NEXT_PUBLIC_CALCOM_LINK || CALCOM_LINK;

export const CALCOM_ENABLED = Boolean(RAW);
/** Booking handle without the host, e.g. "fundvella-specialist/discover-call". */
export const CALCOM_HANDLE = RAW.replace(/^https?:\/\/(app\.)?cal\.com\//, "").replace(/^\/+/, "");
/** Origin the booking iframe is served from (matches cal.com's generated snippet). */
export const CALCOM_ORIGIN = "https://app.cal.com";
/** Namespace = the event slug (last path segment), matching cal.com's snippet. */
export const CALCOM_NAMESPACE = CALCOM_HANDLE.split("/").filter(Boolean).pop() || "default";

// Official cal.com bootstrap. Queues Cal() calls until embed.js finishes loading.
const SNIPPET = `(function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)}})(window,"https://app.cal.com/embed/embed.js","init");`;

type CalFn = (...a: unknown[]) => void;
interface CalGlobal extends CalFn {
  ns?: Record<string, CalFn>;
  loaded?: boolean;
}

/**
 * Inject the bootstrap once, init the booking namespace, and return its
 * namespaced Cal API (Cal.ns[namespace]). Returns null on the server or when no
 * booking link is configured. Call ("inline" | "floatingButton" | "ui" | "on")
 * on the returned function, exactly like cal.com's snippet does.
 */
export function getCalNs(): CalFn | null {
  if (typeof window === "undefined" || !RAW) return null;
  const w = window as unknown as { Cal?: CalGlobal };
  if (!w.Cal) {
    const s = document.createElement("script");
    s.textContent = SNIPPET;
    document.head.appendChild(s);
  }
  const Cal = (window as unknown as { Cal?: CalGlobal }).Cal;
  if (!Cal) return null;
  Cal("init", CALCOM_NAMESPACE, { origin: CALCOM_ORIGIN });
  return Cal.ns?.[CALCOM_NAMESPACE] ?? null;
}

/** Direct booking URL (used for the "open it here" fallback link), prefilled. */
export function buildCalUrl(name?: string, email?: string, notes?: string): string {
  const base = RAW.startsWith("http") ? RAW : `https://cal.com/${CALCOM_HANDLE}`;
  const p = new URLSearchParams();
  if (name) p.set("name", name);
  if (email) p.set("email", email);
  if (notes) p.set("notes", notes);
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}
