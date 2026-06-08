/**
 * Per-vertical accent themes.
 *
 * The navy `brand` scale (trust anchor) is shared by every page and stays fixed.
 * Only the ACCENT ramp changes per vertical, injected as CSS variables on a
 * wrapper element. Tailwind's `accent-*` utilities resolve against these vars
 * (see tailwind.config.ts → `rgb(var(--accent-600) / <alpha-value>)`), so all
 * existing `bg-accent-600` / `text-accent-700` / `bg-accent-50/60` usages light
 * up in the vertical's color with zero component changes.
 *
 * Values are space-separated RGB triples (the form Tailwind's <alpha-value>
 * syntax requires). `cta` / `ctaHover` are hand-picked shades guaranteed to keep
 * white button text readable (≥4.5:1) — some accents (amber, yellow, teal, cyan,
 * sky) are too light at -600 for white text, so the CTA fill is pinned darker.
 */
import type { CSSProperties } from "react";

export type AccentName =
  | "emerald"
  | "amber"
  | "orange"
  | "yellow"
  | "red"
  | "teal"
  | "cyan"
  | "rose"
  | "violet"
  | "sky"
  | "blue"
  | "slate";

type Ramp = {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string;
};

export interface Theme {
  ramp: Ramp;
  /** AA-safe button fill (white text) + hover. */
  cta: string;
  ctaHover: string;
}

export const ACCENTS: Record<AccentName, Theme> = {
  emerald: {
    ramp: { 50: "236 253 245", 100: "209 250 229", 200: "167 243 208", 300: "110 231 183", 400: "52 211 153", 500: "16 185 129", 600: "5 150 105", 700: "4 120 87", 800: "6 95 70", 900: "6 78 59" },
    cta: "4 120 87", ctaHover: "6 95 70",
  },
  amber: {
    ramp: { 50: "255 251 235", 100: "254 243 199", 200: "253 230 138", 300: "252 211 77", 400: "251 191 36", 500: "245 158 11", 600: "217 119 6", 700: "180 83 9", 800: "146 64 14", 900: "120 53 15" },
    cta: "180 83 9", ctaHover: "146 64 14",
  },
  orange: {
    ramp: { 50: "255 247 237", 100: "255 237 213", 200: "254 215 170", 300: "253 186 116", 400: "251 146 60", 500: "249 115 22", 600: "234 88 12", 700: "194 65 12", 800: "154 52 18", 900: "124 45 18" },
    cta: "194 65 12", ctaHover: "154 52 18",
  },
  yellow: {
    ramp: { 50: "254 252 232", 100: "254 249 195", 200: "254 240 138", 300: "253 224 71", 400: "250 204 21", 500: "234 179 8", 600: "202 138 4", 700: "161 98 7", 800: "133 77 14", 900: "113 63 18" },
    cta: "133 77 14", ctaHover: "113 63 18",
  },
  red: {
    ramp: { 50: "254 242 242", 100: "254 226 226", 200: "254 202 202", 300: "252 165 165", 400: "248 113 113", 500: "239 68 68", 600: "220 38 38", 700: "185 28 28", 800: "153 27 27", 900: "127 29 29" },
    cta: "220 38 38", ctaHover: "185 28 28",
  },
  teal: {
    ramp: { 50: "240 253 250", 100: "204 251 241", 200: "153 246 228", 300: "94 234 212", 400: "45 212 191", 500: "20 184 166", 600: "13 148 136", 700: "15 118 110", 800: "17 94 89", 900: "19 78 74" },
    cta: "15 118 110", ctaHover: "17 94 89",
  },
  cyan: {
    ramp: { 50: "236 254 255", 100: "207 250 254", 200: "165 243 252", 300: "103 232 249", 400: "34 211 238", 500: "6 182 212", 600: "8 145 178", 700: "14 116 144", 800: "21 94 117", 900: "22 78 99" },
    cta: "14 116 144", ctaHover: "21 94 117",
  },
  rose: {
    ramp: { 50: "255 241 242", 100: "255 228 230", 200: "254 205 211", 300: "253 164 175", 400: "251 113 133", 500: "244 63 94", 600: "225 29 72", 700: "190 18 60", 800: "159 18 57", 900: "136 19 55" },
    cta: "225 29 72", ctaHover: "190 18 60",
  },
  violet: {
    ramp: { 50: "245 243 255", 100: "237 233 254", 200: "221 214 254", 300: "196 181 253", 400: "167 139 250", 500: "139 92 246", 600: "124 58 237", 700: "109 40 217", 800: "91 33 182", 900: "76 29 149" },
    cta: "124 58 237", ctaHover: "109 40 217",
  },
  sky: {
    ramp: { 50: "240 249 255", 100: "224 242 254", 200: "186 230 253", 300: "125 211 252", 400: "56 189 248", 500: "14 165 233", 600: "2 132 199", 700: "3 105 161", 800: "7 89 133", 900: "12 74 110" },
    cta: "3 105 161", ctaHover: "7 89 133",
  },
  blue: {
    ramp: { 50: "239 246 255", 100: "219 234 254", 200: "191 219 254", 300: "147 197 253", 400: "96 165 250", 500: "59 130 246", 600: "37 99 235", 700: "29 78 216", 800: "30 64 175", 900: "30 58 138" },
    cta: "37 99 235", ctaHover: "29 78 216",
  },
  slate: {
    ramp: { 50: "248 250 252", 100: "241 245 249", 200: "226 232 240", 300: "203 213 225", 400: "148 163 184", 500: "100 116 139", 600: "71 85 105", 700: "51 65 85", 800: "30 41 59", 900: "15 23 42" },
    cta: "71 85 105", ctaHover: "51 65 85",
  },
};

export const DEFAULT_ACCENT: AccentName = "emerald";

/** Inline `style` object that re-points the accent CSS vars for a subtree. */
export function accentCssVars(name: AccentName = DEFAULT_ACCENT): CSSProperties {
  const t = ACCENTS[name] ?? ACCENTS[DEFAULT_ACCENT];
  return {
    "--accent-50": t.ramp[50],
    "--accent-100": t.ramp[100],
    "--accent-200": t.ramp[200],
    "--accent-300": t.ramp[300],
    "--accent-400": t.ramp[400],
    "--accent-500": t.ramp[500],
    "--accent-600": t.ramp[600],
    "--accent-700": t.ramp[700],
    "--accent-800": t.ramp[800],
    "--accent-900": t.ramp[900],
    "--accent-cta": t.cta,
    "--accent-cta-hover": t.ctaHover,
  } as CSSProperties;
}
