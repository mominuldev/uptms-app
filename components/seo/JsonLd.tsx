import { jsonLd } from "@/lib/seo";

/**
 * The page's structured data, built in Laravel from Clinic settings and the
 * page content. The JSON is escaped (lib/seo.ts), so this is the one place
 * the site writes a script body.
 */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  if (graph.length === 0) return null;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />;
}
