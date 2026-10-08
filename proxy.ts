import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isUnknown, matchRedirect, type SiteRouting } from "@/lib/redirects";

/**
 * Runs before every page: applies the redirects managed in the admin
 * (Figma 20), answers a real 404 for addresses the site doesn't have —
 * a page that 404s after streaming starts would otherwise send status 200
 * — and reports both to Laravel (hit counts, the 404 monitor). If the API
 * can't be reached the request simply continues.
 *
 * The routing table is memoised for 30 s per server instance; an unknown
 * address triggers one early refresh, so a page published seconds ago is
 * never answered with 404.
 */
const TTL_MS = 30_000;
const REFRESH_MIN_MS = 5_000;

let memo: { at: number; routing: SiteRouting } | null = null;
let lastForced = 0;

async function routing(force = false): Promise<SiteRouting | null> {
  const now = Date.now();

  if (!force && memo && now - memo.at < TTL_MS) return memo.routing;
  if (force && now - lastForced < REFRESH_MIN_MS) return memo?.routing ?? null;
  if (force) lastForced = now;

  const base = process.env.API_URL;
  if (!base) return null;

  try {
    const response = await fetch(`${base.replace(/\/+$/, "")}/public/redirects`, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(2500) });
    const payload = (await response.json()) as { data?: SiteRouting };

    if (!response.ok || !payload.data) return memo?.routing ?? null;
    memo = { at: now, routing: payload.data };

    return payload.data;
  } catch {
    return memo?.routing ?? null;
  }
}

/** Fire-and-forget report to Laravel, carrying the visitor's address under the site token. */
function report(request: NextRequest, path: string, body?: Record<string, unknown>): Promise<unknown> {
  const base = process.env.API_URL;
  if (!base) return Promise.resolve();

  const headers: Record<string, string> = { Accept: "application/json", "Content-Type": "application/json" };
  const token = process.env.SITE_TOKEN;
  if (token) {
    headers["X-Uptms-Site-Token"] = token;
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim();
    if (ip) headers["X-Uptms-Client-Ip"] = ip;
  }

  return fetch(`${base.replace(/\/+$/, "")}/${path}`, { method: "POST", headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store", signal: AbortSignal.timeout(2500) }).catch(() => undefined);
}

/**
 * The site's own not-found page with a real status. A rewrite can't set the
 * status (Next.js decides it while rendering), so the page is fetched from
 * this server, marked internal so the proxy lets it through.
 */
async function errorPage(request: NextRequest, status: 404 | 410): Promise<NextResponse> {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

  try {
    const page = await fetch(new URL("/_missing", request.url), { headers: { [INTERNAL]: "1", Accept: "text/html" }, cache: "no-store", signal: AbortSignal.timeout(5000) });

    return new NextResponse(request.method === "HEAD" ? null : page.body, { status, headers: { ...headers, "Content-Type": page.headers.get("content-type") ?? "text/html; charset=utf-8" } });
  } catch {
    return new NextResponse(status === 410 ? "This page is no longer available." : "Page not found.", { status, headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" } });
  }
}

const INTERNAL = "x-uptms-internal";

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if ((request.method !== "GET" && request.method !== "HEAD") || request.headers.get(INTERNAL) === "1") return NextResponse.next();

  const table = await routing();
  if (!table) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const match = matchRedirect(table, pathname);

  if (match) {
    event.waitUntil(report(request, `public/redirects/${match.rule.id}/hit`));

    if (match.rule.status === 410 || match.to === null) {
      return errorPage(request, 410);
    }

    const target = new URL(match.to, request.url);
    // Campaign tags and other query strings survive the move.
    if (search && !match.to.includes("?")) target.search = search;

    return NextResponse.redirect(target, match.rule.status);
  }

  if (isUnknown(table, pathname)) {
    const fresh = await routing(true);

    if (!fresh || isUnknown(fresh, pathname)) {
      event.waitUntil(report(request, "public/not-found", { path: pathname, referrer: request.headers.get("referer") }));

      return errorPage(request, 404);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: not framework files, API routes, the revalidation webhook or files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]{2,5}$).*)"],
};
