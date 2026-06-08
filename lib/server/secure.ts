import "server-only";

import { createCipheriv, randomBytes, scryptSync } from "crypto";

/**
 * Symmetric encryption for the one field that must never sit in the open: the SSN.
 *
 * Set APPLICATION_ENC_KEY to a 32-byte key (64-char hex or base64), or any
 * passphrase (it's stretched with scrypt). If it's unset, encryptSecret returns
 * null and the caller MUST NOT persist the raw value — collecting without a key
 * configured means the SSN is used for the immediate hand-off only, never stored.
 */

const KEY_ENV = process.env.APPLICATION_ENC_KEY;

function getKey(): Buffer | null {
  if (!KEY_ENV) return null;
  try {
    if (/^[0-9a-fA-F]{64}$/.test(KEY_ENV)) return Buffer.from(KEY_ENV, "hex");
    const b = Buffer.from(KEY_ENV, "base64");
    if (b.length === 32) return b;
  } catch {
    /* fall through to derivation */
  }
  return scryptSync(KEY_ENV, "fundvella-application", 32);
}

/** AES-256-GCM → "iv:tag:ciphertext" (all base64). Null when no key is configured. */
export function encryptSecret(plaintext: string): string | null {
  const key = getKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function isEncryptionConfigured(): boolean {
  return getKey() !== null;
}
