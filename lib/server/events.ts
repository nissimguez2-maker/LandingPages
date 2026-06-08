import "server-only";

import { createHash, randomUUID } from "crypto";

/**
 * Canonical event envelope for everything the site emits to n8n.
 * One envelope, four event types. `event` is the routing discriminator; the
 * `idempotencyKey` is what n8n dedupes on (so the client's 2-4 beacons per lead
 * collapse to one CRM record). `schemaVersion` lets `data` evolve independently.
 */

export type FvEventType =
  | "lead.captured"
  | "application.started"
  | "application.abandoned"
  | "application.submitted";

export interface FvEnvelope {
  event: FvEventType;
  eventId: string; // unique per delivery — audit handle
  occurredAt: string; // ISO-8601
  idempotencyKey: string; // stable per logical entity+stage — n8n dedup key
  source: "fundvella-web";
  env: "production" | "preview" | "dev";
  schemaVersion: 1;
  test: boolean; // true off-production, so n8n can branch to a test pipeline
  data: Record<string, unknown>;
}

function deployEnv(): FvEnvelope["env"] {
  const ctx = process.env.CONTEXT; // Netlify: production | deploy-preview | branch-deploy
  if (ctx === "production") return "production";
  if (!ctx) return process.env.NODE_ENV === "production" ? "production" : "dev";
  return "preview";
}

export function makeEnvelope(
  event: FvEventType,
  idempotencyKey: string,
  data: Record<string, unknown>,
): FvEnvelope {
  const env = deployEnv();
  return {
    event,
    eventId: randomUUID(),
    occurredAt: new Date().toISOString(),
    idempotencyKey,
    source: "fundvella-web",
    env,
    schemaVersion: 1,
    test: env !== "production",
    data,
  };
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Stable dedup key for a prequal lead. The same person (by email/phone) at the
 * same vertical+stage always produces the same key — so n8n collapses the
 * exit-intent beacon + contact POST + enrichment POST + booking POST into one.
 */
export function leadDedupeKey(
  email: string | undefined,
  phone: string | undefined,
  vertical: string | undefined,
  stage: string,
): string {
  const id = sha256(`${(email || "").trim().toLowerCase()}|${(phone || "").replace(/\D/g, "")}`);
  return `lead:${id}:${vertical || "na"}:${stage}`;
}

/** Funnel temperature from urgency — single source of truth, emitted so n8n's routing can't drift. */
export function temperatureFor(urgency?: string): "hot" | "warm" | "cold" {
  if (urgency === "immediately" || urgency === "this_week") return "hot";
  if (urgency === "this_month") return "warm";
  return "cold";
}
