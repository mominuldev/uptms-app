import type { MetadataRoute } from "next";
import { getSitemap } from "@/lib/cms";
import { toSitemap } from "@/lib/seo";

/**
 * /sitemap.xml from SEO → Sitemap & robots (Figma 22): every published page,
 * condition and post that may be indexed. Publishing anything refreshes it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return toSitemap(await getSitemap());
}
