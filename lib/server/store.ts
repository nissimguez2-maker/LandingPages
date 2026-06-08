import "server-only";

/**
 * Application persistence with graceful driver fallback:
 *   1. Supabase  — when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
 *      (service role bypasses RLS; PostgREST, no SDK).
 *   2. Netlify Blobs — native to the deploy, zero config, used otherwise.
 *   3. In-memory — last-resort dev fallback (single instance only).
 *
 * Powers cross-device magic-link resume + recovery. Only redacted lead data is
 * stored; the SSN lives as ciphertext in its own field, never the raw value.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "applications";

export interface ApplicationRecord {
  token: string;
  vertical?: string;
  status?: string;
  email?: string;
  lead: Record<string, unknown>; // redacted — never the raw SSN/signature
  ssn_ciphertext?: string | null;
  plaid_item_id?: string | null;
  plaid_access_token_ciphertext?: string | null;
  resume_emailed_at?: string | null;
}

/** A store is always available (Blobs or in-memory), so this is always true. */
export function isStoreConfigured(): boolean {
  return true;
}

function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/* ── Driver: Supabase (service role) ────────────────────────────────────── */

function sbHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apikey: SERVICE_KEY as string,
    Authorization: `Bearer ${SERVICE_KEY}`,
    ...extra,
  };
}

/* ── Driver: Netlify Blobs (dynamic import; absent outside Netlify) ──────── */

type BlobStore = {
  get(key: string, opts?: { type?: "json" }): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<void>;
};

async function blobStore(): Promise<BlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: "applications", consistency: "strong" }) as unknown as BlobStore;
  } catch {
    return null;
  }
}

/* ── Driver: in-memory ──────────────────────────────────────────────────── */

const mem = new Map<string, ApplicationRecord>();

/* ── Public API ─────────────────────────────────────────────────────────── */

export async function upsertApplication(rec: ApplicationRecord): Promise<boolean> {
  if (supabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=token`, {
        method: "POST",
        headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
        body: JSON.stringify({ ...rec, updated_at: new Date().toISOString() }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  const store = await blobStore();
  if (store) {
    try {
      const existing = (await store.get(rec.token, { type: "json" })) as ApplicationRecord | null;
      await store.setJSON(rec.token, { ...(existing ?? {}), ...rec });
      return true;
    } catch {
      /* fall through to memory */
    }
  }

  mem.set(rec.token, { ...(mem.get(rec.token) ?? ({} as ApplicationRecord)), ...rec });
  return true;
}

export async function patchApplication(token: string, fields: Record<string, unknown>): Promise<boolean> {
  if (supabaseConfigured()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?token=eq.${encodeURIComponent(token)}`, {
        method: "PATCH",
        headers: sbHeaders({ Prefer: "return=minimal" }),
        body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  const store = await blobStore();
  if (store) {
    try {
      const existing = ((await store.get(token, { type: "json" })) as ApplicationRecord | null) ?? null;
      if (existing) {
        await store.setJSON(token, { ...existing, ...fields });
        return true;
      }
    } catch {
      /* fall through */
    }
  }

  const cur = mem.get(token);
  if (cur) mem.set(token, { ...cur, ...fields } as ApplicationRecord);
  return true;
}

export async function getApplication(token: string): Promise<ApplicationRecord | null> {
  if (supabaseConfigured()) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?token=eq.${encodeURIComponent(token)}&select=*`,
        { headers: sbHeaders() },
      );
      if (!res.ok) return null;
      const rows = (await res.json()) as ApplicationRecord[];
      return rows?.[0] ?? null;
    } catch {
      return null;
    }
  }

  const store = await blobStore();
  if (store) {
    try {
      return ((await store.get(token, { type: "json" })) as ApplicationRecord | null) ?? null;
    } catch {
      /* fall through */
    }
  }

  return mem.get(token) ?? null;
}

export async function markResumeEmailed(token: string): Promise<void> {
  await patchApplication(token, { resume_emailed_at: new Date().toISOString() });
}
