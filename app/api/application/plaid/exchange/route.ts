import { NextResponse } from "next/server";

import { exchangePublicToken, isPlaidConfigured } from "@/lib/server/plaid";
import { encryptSecret } from "@/lib/server/secure";
import { patchApplication } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  if (!isPlaidConfigured()) return NextResponse.json({ ok: false, configured: false }, { status: 400 });
  let body: { public_token?: string; applicationId?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body.public_token) return NextResponse.json({ ok: false, error: "missing_public_token" }, { status: 400 });

  try {
    const { accessToken, itemId } = await exchangePublicToken(body.public_token);
    if (body.applicationId) {
      // Access token encrypted at rest, same as the SSN; never returned to the client.
      await patchApplication(body.applicationId, {
        plaid_item_id: itemId,
        plaid_access_token_ciphertext: encryptSecret(accessToken),
      });
    }
    return NextResponse.json({ ok: true, itemId });
  } catch {
    return NextResponse.json({ ok: false, error: "exchange_failed" }, { status: 502 });
  }
}
