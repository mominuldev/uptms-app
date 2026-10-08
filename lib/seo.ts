import type { Metadata, MetadataRoute } from "next";
import type { Seo, SitemapEntry } from "./content";

/**
 * Indexing is switched on at launch (ALLOW_INDEXING=true). Until then every
 * page is noindex whatever its SEO settings say, and robots.txt disallows
 * everything, so staging never ends up in Google.
 */
export function indexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING === "true";
}

/** This site's public origin, without a trailing slash. */
export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

/** Laravel's sitemap entries (relative paths) as Next.js sitemap rows. */
export function toSitemap(entries: SitemapEntry[], origin = siteOrigin()): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: origin + (entry.path === "/" ? "/" : "/" + entry.path.replace(/^\/+/, "")),
    lastModified: entry.lastmod ?? undefined,
    priority: entry.priority,
    images: entry.images.length > 0 ? entry.images.map((image) => image.url) : undefined,
  }));
}

/**
 * robots.txt: the text staff edit in the admin, plus a Sitemap line when
 * they left it out. `null` (before launch) shuts every crawler out.
 */
export function robotsTxt(text: string | null, origin = siteOrigin()): string {
  if (text === null) return "User-agent: *\nDisallow: /\n";

  const body = text.replace(/\r\n?/g, "\n").trimEnd();
  const sitemap = /^\s*sitemap\s*:/im.test(body) ? "" : `\n\nSitemap: ${origin}/sitemap.xml`;

  return `${body}${sitemap}\n`;
}

/** Laravel's resolved SEO (titles already templated) as Next.js metadata. */
export function toMetadata(seo: Seo, options: { preview?: boolean } = {}): Metadata {
  const index = seo.robots.index && indexingAllowed() && !options.preview;
  const follow = seo.robots.follow && indexingAllowed() && !options.preview;
  const image = seo.open_graph.image;
  const images = image ? [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.alt }] : undefined;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": seo.robots.max_image_preview,
        ...(seo.robots.max_snippet !== null ? { "max-snippet": seo.robots.max_snippet } : {}),
      },
    },
    openGraph: {
      type: seo.open_graph.type,
      title: seo.open_graph.title,
      description: seo.open_graph.description,
      url: seo.open_graph.url,
      siteName: seo.open_graph.site_name,
      locale: "en_US",
      images,
      ...(seo.open_graph.type === "article"
        ? { publishedTime: seo.open_graph.published_time ?? undefined, modifiedTime: seo.open_graph.modified_time ?? undefined }
        : {}),
    },
    twitter: {
      card: seo.twitter.card,
      site: seo.twitter.site ?? undefined,
      title: seo.open_graph.title,
      description: seo.open_graph.description,
      images: image ? [image.url] : undefined,
    },
  };
}

/**
 * JSON for a <script type="application/ld+json">. `<` is escaped so text
 * from the CMS can never close the script element.
 */
export function jsonLd(graph: Record<string, unknown>[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
