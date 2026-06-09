import Link from "next/link";

/**
 * FundVella brand lockup: monogram (navy frame + F, emerald bar chart + growth
 * arrow) and the two-tone wordmark. Colors are hard-pinned so the mark stays
 * on-brand regardless of a page's per-vertical accent.
 */
export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold" aria-label="FundVella, home">
      <svg viewBox="0 0 48 48" aria-hidden="true" role="img" className="h-9 w-9 shrink-0">
        <defs>
          <linearGradient id="fvFrameHdr" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0f2a4a" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <rect x="3.5" y="3.5" width="41" height="41" rx="11" fill="none" stroke="url(#fvFrameHdr)" strokeWidth="3" />
        <path
          d="M16 14 L16 34 M16 14 L27 14 M16 23 L24 23"
          fill="none"
          stroke="#0f2a4a"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="22,34 22,31 28,34 28,27 34,34 34,22"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 27 L26 33 L37 19 M31.5 19 L37 19 L37 24.5"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-lg leading-none tracking-tight">
        <span className="text-brand-900">Fund</span>
        <span className="text-[#047857]">Vella</span>
      </span>
    </Link>
  );
}
