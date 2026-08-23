import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/seo";
import { getSupabaseRawVillas } from "@/lib/supabase/villas";

const publicRoutes = [
  "",
  "bandingkan",
  "cari",
  "help",
  "peta",
  "privacy",
  "privacy-policy",
  "terms",
  "terms-of-service",
  "untuk-pemilik",
  "wishlist",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const villas = await getSupabaseRawVillas();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: localizedPath(locale, route),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.6,
      });
    }
    for (const villa of villas) {
      entries.push({
        url: localizedPath(locale, `villa/${villa.id}`),
        changeFrequency: "hourly",
        priority: 0.8,
      });
    }
  }

  return entries;
}