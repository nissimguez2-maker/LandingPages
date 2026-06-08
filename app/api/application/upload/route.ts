/**
 * Bank-statement upload — signed-URL issuer.
 *
 * The client asks for a short-lived signed upload URL so large PDFs go straight
 * from the browser to a private bucket (never through this function). Until
 * Supabase Storage is configured, it reports `configured:false`, and the client
 * keeps the file metadata so a specialist collects the document.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let body: { name?: string; size?: number; type?: string; applicationId?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const allowed = body.type === "application/pdf" || (body.type ?? "").startsWith("image/");
  const tooBig = (body.size ?? 0) > 15 * 1024 * 1024;
  if (!allowed || tooBig) {
    return NextResponse.json({ ok: false, error: "unsupported_file" }, { status: 422 });
  }

  // TODO (Supabase Storage): create a signed upload URL into a PRIVATE bucket,
  // e.g. supabase.storage.from("bank-statements").createSignedUploadUrl(key)
  // and return { ok:true, url, key }. The bucket must not be public.
  return NextResponse.json({ ok: true, configured: false });
}
