import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// AEO: explicitly welcome search-augmented + browsing AI crawlers (they drive
// citations and answer-engine visibility). /api/ stays blocked. /thank-you is
// noindex at the page level, so it is intentionally NOT robots-blocked here (a
// robots block would stop crawlers from ever reading that noindex). Bytespider
// is an aggressive scraper with no citation value, so it is blocked.
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const aiAllow = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "CCBot",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...aiAllow.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
