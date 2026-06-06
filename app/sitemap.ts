import type { MetadataRoute } from "next";
import { getActiveVerticals } from "@/content/landingPagesConfig";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...getActiveVerticals().map((v) => ({
      url: `${base}/${v.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
