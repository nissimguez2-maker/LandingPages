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
        // Accent is per-vertical: the scale resolves against CSS variables set
        // by `accentCssVars()` (lib/themes.ts). Defaults live in globals.css :root.
        accent: {
          50: "rgb(var(--accent-50) / <alpha-value>)",
          100: "rgb(var(--accent-100) / <alpha-value>)",
          200: "rgb(var(--accent-200) / <alpha-value>)",
          300: "rgb(var(--accent-300) / <alpha-value>)",
          400: "rgb(var(--accent-400) / <alpha-value>)",
          500: "rgb(var(--accent-500) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
          700: "rgb(var(--accent-700) / <alpha-value>)",
          800: "rgb(var(--accent-800) / <alpha-value>)",
          900: "rgb(var(--accent-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Self-hosted via next/font (app/layout.tsx). Falls back to system stack.
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
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
