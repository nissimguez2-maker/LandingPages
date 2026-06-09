import { ImageResponse } from "next/og";

// Default OG / Twitter card. Next auto-wires this for every page (metadataBase is
// set in app/layout.tsx); individual pages can still override og:image.
export const alt = "FundVella — working capital, reviewed on revenue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1c33",
          fontFamily: "sans-serif",
        }}
      >
        {/* Monogram — white knockout on navy, emerald growth arrow + bars */}
        <svg width="120" height="120" viewBox="0 0 48 48" style={{ marginBottom: 36 }}>
          <rect x="3.5" y="3.5" width="41" height="41" rx="11" fill="none" stroke="#ffffff" strokeWidth="3" />
          <path
            d="M16 14 L16 34 M16 14 L27 14 M16 23 L24 23"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="22,34 22,31 28,34 28,27 34,34 34,22"
            fill="none"
            stroke="#10b981"
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

        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ color: "#ffffff" }}>Fund</span>
          <span style={{ color: "#34d399" }}>Vella</span>
        </div>

        <div style={{ width: 96, height: 4, background: "#10b981", borderRadius: 2, margin: "28px 0" }} />

        <div style={{ fontSize: 34, color: "#d7e6f6", fontWeight: 500 }}>
          Working capital, reviewed on revenue.
        </div>
      </div>
    ),
    { ...size }
  );
}
