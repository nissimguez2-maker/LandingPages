import type { Config } from "tailwindcss";

/**
 * Serious-finance design tokens.
 * - `brand`  = deep, trustworthy navy/blue (authority, stability)
 * - `accent` = confident emerald (finance "go", used sparingly for CTAs)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5fc",
          100: "#d7e6f6",
          200: "#b0cdec",
          300: "#82acdd",
          400: "#5187c8",
          500: "#326aae",
          600: "#27548c",
          700: "#234674",
          800: "#223c61",
          900: "#0f2a4a",
          950: "#0a1c33",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      fontFamily: {
        // System stack — fast (no web-font fetch), clean, and trustworthy.
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 42, 74, 0.04), 0 8px 24px rgba(15, 42, 74, 0.06)",
        lift: "0 8px 30px rgba(15, 42, 74, 0.12)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
