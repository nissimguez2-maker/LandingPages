import "server-only";
import { createHmac } from "crypto";
import type { LeadData } from "./types";
import { scoreLead } from "./leadScoring";

/**
 * App -> n8n event emitter. After each lead capture the app fires one signed,
 * fire-and-forget "lead.captured" event to the n8n automation hub. This is a
 * NO-OP until N8N_INGEST_URL is set, so it ships dormant and turns on the moment
 * the hub exists. n8n verifies x-fundvella-signature = HMAC-SHA256(`${ts}.${body}`)
 * with N8N_INGEST_SECRET and rejects timestamps older than a few minutes.
 */
const INGEST_URL = process.env.N8N_INGEST_URL || "";
// Falls back to NURTURE_SECRET so a single secret still works pre-split.
const INGEST_SECRET = process.env.N8N_INGEST_SECRET || process.env.NURTURE_SECRET || "";

export async function emitLeadCaptured(lead: LeadData): Promise<void> {
  if (!INGEST_URL) return; // dormant until the hub is configured
  try {
    const { score, band } = scoreLead(lead);
    const ts = Date.now().toString();
    const eventId = createHmac("sha256", INGEST_SECRET || "fundvella")
      .update(`${lead.email || lead.phone || "anon"}|${ts}`)
      .digest("hex")
      .slice(0, 32);
    const body = JSON.stringify({
      type: "lead.captured",
      eventId,
      occurredAt: new Date().toISOString(),
      partial: Boolean(lead.partial),
      score,
      band,
      lead,
    });
    const signature = INGEST_SECRET
      ? createHmac("sha256", INGEST_SECRET).update(`${ts}.${body}`).digest("hex")
      : "";
    await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-fundvella-timestamp": ts,
        "x-fundvella-signature": signature,
      },
      body,
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[n8n] lead.captured emit failed:", err instanceof Error ? err.message : err);
  }
}
