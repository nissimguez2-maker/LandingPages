// Scheduled Netlify function — runs hourly and triggers the nurture engine.
// The engine itself lives in the Next.js route /api/nurture/run (so it can be
// tested over HTTP). This just calls it on a schedule with the shared secret.

export default async () => {
  const base = (process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "https://fundvella.com").replace(/\/+$/, "");
  const secret = process.env.NURTURE_SECRET || "";
  try {
    const res = await fetch(`${base}/api/nurture/run`, {
      method: "POST",
      headers: { "x-nurture-secret": secret },
    });
    // eslint-disable-next-line no-console
    console.log("[nurture-cron]", res.status, (await res.text()).slice(0, 300));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[nurture-cron] error", err);
  }
  return new Response("ok");
};

// Every 15 minutes so the partial win-back (first offset = 15 min) is timely.
export const config = { schedule: "*/15 * * * *" };
