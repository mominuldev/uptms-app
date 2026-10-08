import { revalidateTag } from "next/cache";
import { verifySignature } from "@/lib/revalidate";

/**
 * Laravel's publish webhook (uptms-ad Uptms\Publishing\Jobs\RevalidateFrontend).
 * The body is signed with HMAC-SHA256 over `{timestamp}.{body}` using
 * REVALIDATE_SECRET; requests older than five minutes are refused so a
 * captured request can't be replayed. Tags expire immediately: an edit
 * published in the admin shows on the very next visit.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return Response.json({ revalidated: false, error: "REVALIDATE_SECRET is not set." }, { status: 503 });
  }

  const body = await request.text();

  if (!verifySignature(secret, request.headers.get("x-uptms-timestamp"), request.headers.get("x-uptms-signature"), body)) {
    return Response.json({ revalidated: false, error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(body) as { tags?: unknown };
  const tags = Array.isArray(payload.tags) ? payload.tags.filter((tag): tag is string => typeof tag === "string" && tag.length <= 256).slice(0, 50) : [];

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: true, tags });
}
