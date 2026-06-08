import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";

/**
 * HMAC-signed unsubscribe tokens so links can't be forged to opt out arbitrary
 * emails. Token = base64url(email).<sig>. Signed/verified server-side only.
 *
 * If no real secret is configured the fallback is process-ephemeral random (not a
 * known constant), so a misconfigured deploy produces unverifiable tokens rather
 * than forgeable ones. Set NURTURE_SECRET in production.
 */
const FALLBACK_SECRET = randomBytes(32).toString("hex");

function secret(): string {
  return process.env.NURTURE_SECRET || process.env.HUBSPOT_PRIVATE_APP_TOKEN || FALLBACK_SECRET;
}

function sig(email: string): string {
  return createHmac("sha256", secret()).update(email).digest("base64url");
}

export function signUnsub(email: string): string {
  return `${Buffer.from(email).toString("base64url")}.${sig(email)}`;
}

export function verifyUnsub(token: string | null): string | null {
  if (!token) return null;
  const [enc, s] = token.split(".");
  if (!enc || !s) return null;
  let email: string;
  try {
    email = Buffer.from(enc, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const provided = Buffer.from(s);
  const expected = Buffer.from(sig(email));
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
