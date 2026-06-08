import "server-only";

/**
 * Minimal Plaid client (fetch-based — no SDK dependency). Lets a lead connect a
 * bank read-only instead of uploading statements. No-ops cleanly when the keys
 * are absent, so the UI falls back to file upload.
 */

const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const SECRET = process.env.PLAID_SECRET;
const ENV = (process.env.PLAID_ENV || "sandbox").toLowerCase();
const PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function baseUrl(): string {
  if (ENV === "production") return "https://production.plaid.com";
  if (ENV === "development") return "https://development.plaid.com";
  return "https://sandbox.plaid.com";
}

export function isPlaidConfigured(): boolean {
  return Boolean(CLIENT_ID && SECRET);
}

async function call(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, secret: SECRET, ...body }),
  });
  if (!res.ok) throw new Error(`plaid_${path}_${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

export async function createLinkToken(userId: string): Promise<string> {
  const data = await call("/link/token/create", {
    user: { client_user_id: userId },
    client_name: "FundVella",
    products: PRODUCTS,
    country_codes: ["US"],
    language: "en",
  });
  return String(data.link_token ?? "");
}

export async function exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }> {
  const data = await call("/item/public_token/exchange", { public_token: publicToken });
  return { accessToken: String(data.access_token ?? ""), itemId: String(data.item_id ?? "") };
}
