/**
 * Site-wide constants. Edit SITE_NAME to your brand. NEXT_PUBLIC_SITE_URL is read
 * from the environment and used for canonical tags, OpenGraph, sitemap, robots.
 */

export const SITE_NAME = "Merchant Capital Review";

export const SITE_TAGLINE = "Fast working-capital reviews for real operating businesses.";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
