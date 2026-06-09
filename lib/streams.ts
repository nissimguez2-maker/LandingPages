/**
 * Stream registry — the single source of truth for a "lead stream".
 *
 * The engine runs ONCE over multiple DISTINCT streams. Everything that varies
 * per stream (its brand tag, where it originates, whether we self-generate it)
 * lives here — so adding a future client/stream is a config addition, not a
 * code change threaded through routes. `leadBrand` is the tag carried on every
 * event + CRM record, and the axis all per-stream attribution is measured on.
 */

export type StreamId = "fundvella" | "finbiz";

export interface Stream {
  id: StreamId;
  /** Tag stamped on every event + CRM record (HubSpot `lead_brand`). The attribution axis. */
  leadBrand: string;
  /** Human-facing label. */
  label: string;
  /** Origin app / ingest channel, recorded on the event envelope's `source`. */
  source: string;
  /** True when we generate the lead ourselves (own funnel); false when it's handed to us. */
  selfGenerated: boolean;
}

export const STREAMS: Record<StreamId, Stream> = {
  fundvella: { id: "fundvella", leadBrand: "FundVella", label: "FundVella", source: "fundvella-web", selfGenerated: true },
  finbiz: { id: "finbiz", leadBrand: "FinBiz", label: "FinBiz", source: "finbiz-import", selfGenerated: false },
};

/** The default stream for self-generated web captures. */
export const DEFAULT_STREAM_ID: StreamId = "fundvella";

/** Resolve a stream by id, falling back to the default (never returns undefined). */
export function streamFor(id?: string): Stream {
  return (id && id in STREAMS && STREAMS[id as StreamId]) || STREAMS[DEFAULT_STREAM_ID];
}
