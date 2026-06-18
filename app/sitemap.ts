import type { MetadataRoute } from "next";
import { getActiveVerticals } from "@/content/landingPagesConfig";
import { getAllResources } from "@/content/articlesConfig";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/credit-runway`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...getActiveVerticals().map((v) => ({
      url: `${base}/${v.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    ...getAllResources().map((a) => ({
      url: `${base}/resources/${a.slug}`,
      lastModified: new Date(a.updatedAt ?? a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: a.kind === "pillar" ? 0.6 : 0.5,
    })),
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
  ];
}
