/**
 * Site-wide constants. Edit SITE_NAME to your brand. NEXT_PUBLIC_SITE_URL is read
 * from the environment and used for canonical tags, OpenGraph, sitemap, robots.
 */

export const SITE_NAME = "FundVella";

export const SITE_TAGLINE = "Fast working-capital reviews for real operating businesses.";

/**
 * Analytics (all free). Leave a value empty to keep that tool off.
 * PostHog host: US = https://us.i.posthog.com, EU = https://eu.i.posthog.com.
 * Clarity id comes from clarity.microsoft.com -> Get tracking code.
 */
export const POSTHOG_KEY = "phc_nHPq7EJxXC6aCybaqS3o3xj3L4HfA5VNgWti3GnM9PVu";
export const POSTHOG_HOST = "https://us.i.posthog.com";
export const CLARITY_ID = "x3cnn1jpad";

export function getSiteUrl(): string {
  // Priority: explicit override -> Netlify's automatic build URL -> localhost.
  // Netlify sets `URL` (and `DEPLOY_PRIME_URL`) automatically to the site's
  // primary URL — including a custom domain once configured — so
  // NEXT_PUBLIC_SITE_URL is OPTIONAL. Set it only to force a specific canonical.
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}
