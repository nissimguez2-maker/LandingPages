import "server-only";

import { createHmac } from "crypto";

import { makeEnvelope, type FvEnvelope, type FvEventType } from "./events";

/**
 * Durable, signed event delivery to n8n.
 *
 * - HMAC-signs every event with NURTURE_SECRET (timestamp + body) so n8n can
 *   reject forged events and replays.
 * - Bounded retry + per-attempt timeout (kept well under the Netlify function
 *   wall-clock; the dead-letter is the real safety net, not the retry count).
 * - Dead-letters to Netlify Blobs on exhaustion OR when APPLICATION_WEBHOOK_URL
 *   is unset — so NOTHING is lost before n8n is wired. Replay the store later.
 */

const WEBHOOK = process.env.APPLICATION_WEBHOOK_URL;
const SECRET = process.env.NURTURE_SECRET;
const TIMEOUT_MS = Number(process.env.EVENT_FORWARD_TIMEOUT_MS || 2500);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function signedHeaders(body: string): Record<string, string> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (SECRET) {
    const ts = Date.now().toString();
    const sig = createHmac("sha256", SECRET).update(`${ts}.${body}`).digest("hex");
    headers["x-fundvella-timestamp"] = ts;
    headers["x-fundvella-signature"] = `v1=${sig}`;
  }
  return headers;
}

async function postOnce(body: string): Promise<{ ok: boolean; status: number }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(WEBHOOK as string, {
      method: "POST",
      headers: signedHeaders(body),
      body,
      signal: ctrl.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(t);
  }
}

async function deadLetter(envelope: FvEnvelope): Promise<void> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: "event-dead-letter", consistency: "strong" }) as unknown as {
      setJSON: (key: string, value: unknown) => Promise<void>;
    };
    await store.setJSON(envelope.eventId, { ...envelope, deadLetteredAt: new Date().toISOString() });
  } catch {
    // Last resort — log the redacted envelope identifiers only (data is already PII-safe).
    // eslint-disable-next-line no-console
    console.error("[event.deadletter]", envelope.event, envelope.idempotencyKey, envelope.eventId);
  }
}

/** Emit a domain event to n8n. Returns true on delivery; dead-letters otherwise. */
export async function emit(
  event: FvEventType,
  idempotencyKey: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const envelope = makeEnvelope(event, idempotencyKey, data);
  if (!WEBHOOK) {
    await deadLetter(envelope);
    return false;
  }
  const body = JSON.stringify(envelope);
  for (const delay of [0, 500]) {
    if (delay) await sleep(delay);
    const r = await postOnce(body);
    if (r.ok) return true;
    if (r.status >= 400 && r.status < 500 && r.status !== 429) break; // client error — don't retry
  }
  await deadLetter(envelope);
  return false;
}
