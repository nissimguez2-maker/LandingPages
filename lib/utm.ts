/**
 * UTM capture + persistence.
 *
 * Captures utm_* from the URL on first load and persists them for the whole
 * session, so attribution survives multi-step form navigation and is attached
 * to both partial and full lead submissions.
 */

import type { UtmData } from "./types";

const KEYS: (keyof UtmData)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const STORAGE_KEY = "mca_utm";

/** Read utm_* from the current URL (client only). */
export function readUtmFromUrl(): UtmData {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmData = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

/**
 * Capture UTM on load: prefer values already stored for this session, fall back
 * to whatever is on the URL, then persist. Returns the resolved UTM object.
 */
export function captureUtm(): UtmData {
  if (typeof window === "undefined") return {};
  const fromUrl = readUtmFromUrl();
  const stored = getStoredUtm();
  // First-touch wins: keep the original source unless this is the first visit.
  const resolved: UtmData = Object.keys(stored).length ? stored : fromUrl;

  if (Object.keys(resolved).length) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }
  return resolved;
}

export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}
