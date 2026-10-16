import "server-only";
import { headers } from "next/headers";

/**
 * With SITE_TOKEN set (= FRONTEND_SITE_TOKEN in uptms-ad), form posts carry
 * the visitor's IP and user agent so Laravel's rate limit and Turnstile check
 * apply per visitor rather than to this server.
 */
export async function visitorHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  const forwarded: Record<string, string> = {};
  const token = process.env.SITE_TOKEN;

  if (token) {
    const ip = (incoming.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || incoming.get("x-real-ip") || "";
    forwarded["X-Uptms-Site-Token"] = token;
    if (ip) forwarded["X-Uptms-Client-Ip"] = ip;
    const agent = incoming.get("user-agent");
    if (agent) forwarded["X-Uptms-Client-Agent"] = agent.slice(0, 512);
  }

  return forwarded;
}
