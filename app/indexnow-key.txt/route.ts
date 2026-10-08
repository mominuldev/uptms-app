import { getRobots } from "@/lib/cms";

/**
 * IndexNow's key file: search engines fetch it to confirm that a URL
 * submission (uptms-ad Uptms\Seo\Services\IndexNow) came from this site.
 * Laravel shares the key only while IndexNow is on and the site is live.
 */
export async function GET() {
  const { indexnow_key: key } = await getRobots();

  if (!key) return new Response("Not found.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
