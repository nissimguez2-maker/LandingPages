import "server-only";

/**
 * Application persistence via Supabase PostgREST (fetch-based — no SDK dependency).
 * Powers cross-device magic-link resume and the recovery email. Every function is
 * a safe no-op when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are unset, so the app
 * runs fine before storage is connected (resume then works same-device only).
 *
 * Only redacted lead data is stored here. The SSN lives as ciphertext in its own
 * column; the raw value is never written.
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

export function isStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function headers(extra?: Record<string, string>): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apikey: SERVICE_KEY as string,
    Authorization: `Bearer ${SERVICE_KEY}`,
    ...extra,
  };
}

/** Upsert by token. Returns false (no-op) when storage isn't configured. */
export async function upsertApplication(rec: ApplicationRecord): Promise<boolean> {
  if (!isStoreConfigured()) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=token`, {
      method: "POST",
      headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify({ ...rec, updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Patch a subset of columns by token (used by the Plaid exchange). */
export async function patchApplication(token: string, fields: Record<string, unknown>): Promise<boolean> {
  if (!isStoreConfigured()) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?token=eq.${encodeURIComponent(token)}`, {
      method: "PATCH",
      headers: headers({ Prefer: "return=minimal" }),
      body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getApplication(token: string): Promise<ApplicationRecord | null> {
  if (!isStoreConfigured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?token=eq.${encodeURIComponent(token)}&select=*`,
      { headers: headers() },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as ApplicationRecord[];
    return rows?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function markResumeEmailed(token: string): Promise<void> {
  await patchApplication(token, { resume_emailed_at: new Date().toISOString() });
}
