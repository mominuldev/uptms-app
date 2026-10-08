import { getRobots } from "@/lib/cms";
import { indexingAllowed, robotsTxt } from "@/lib/seo";

/**
 * robots.txt as staff wrote it in the admin (Figma 22). A route handler
 * rather than robots.ts so the text is served exactly, comments included.
 * Before launch (ALLOW_INDEXING) the API isn't asked: everything is disallowed.
 */
export async function GET() {
  const text = robotsTxt(indexingAllowed() ? (await getRobots()).text : null);

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
