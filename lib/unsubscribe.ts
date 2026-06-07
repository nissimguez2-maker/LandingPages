import "server-only";
import { createHmac } from "crypto";

/**
 * HMAC-signed unsubscribe tokens so links can't be forged to opt out arbitrary
 * emails. Token = base64url(email).<sig>. Signed/verified server-side only.
 */
function secret(): string {
  return process.env.NURTURE_SECRET || process.env.HUBSPOT_PRIVATE_APP_TOKEN || "dev-unsub-secret";
}

function sig(email: string): string {
  return createHmac("sha256", secret()).update(email).digest("base64url").slice(0, 24);
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
  if (s !== sig(email)) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
