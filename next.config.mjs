/** @type {import('next').NextConfig} */

// Enforced Content-Security-Policy. netlify.toml sets the same header for static
// assets; this applies it to the Next-rendered HTML pages, which netlify.toml
// [[headers]] do NOT reach on Netlify's Next runtime. Validated against the
// site's integrations: PostHog, Microsoft Clarity, cal.com. Add any NEW external
// origin to the matching directive below or the browser will block it.
const ContentSecurityPolicy =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://www.clarity.ms https://*.clarity.ms https://us-assets.i.posthog.com; " +
  "style-src 'self' 'unsafe-inline' https://app.cal.com; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://*.clarity.ms https://app.cal.com https://cal.com; " +
  "frame-src https://app.cal.com https://cal.com; " +
  "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Marketing copy is apostrophe/quote heavy; we rely on TypeScript (not ESLint)
  // to gate the Netlify build so legitimate copy never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
