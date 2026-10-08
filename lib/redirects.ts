/**
 * Redirect rules from uptms-ad (Figma 20), applied by proxy.ts before any
 * page renders. Matching mirrors Laravel's RedirectRules: paths are
 * lower-cased without a trailing slash; a rule ending in /* matches
 * everything under it and puts the rest in $1.
 */
export interface RedirectRule {
  id: number;
  from: string;
  to: string | null;
  status: 301 | 302 | 307 | 410;
  wildcard: boolean;
}

export interface SiteRouting {
  rules: RedirectRule[];
  paths: string[];
}

export function normalisePath(path: string): string {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // Malformed escapes stay as they are.
  }
  const lower = ("/" + decoded.replace(/^\/+/, "")).toLowerCase();

  return lower === "/" ? "/" : lower.replace(/\/+$/, "");
}

export function matchRedirect(routing: SiteRouting, pathname: string): { rule: RedirectRule; to: string | null } | null {
  const path = normalisePath(pathname);
  const exact = routing.rules.find((rule) => !rule.wildcard && rule.from === path);

  if (exact) return { rule: exact, to: exact.to };

  const wildcards = routing.rules.filter((rule) => rule.wildcard).sort((a, b) => b.from.length - a.from.length);

  for (const rule of wildcards) {
    const prefix = rule.from.slice(0, -1).replace(/\/+$/, "");

    if (path === prefix || path.startsWith(prefix + "/")) {
      const rest = path.slice(prefix.length).replace(/^\/+/, "");

      return { rule, to: rule.to === null ? null : rule.to.replace("$1", rest) };
    }
  }

  return null;
}

/** Addresses served without a CMS record: app routes, files and framework paths. */
const OPEN_PREFIXES = ["/_next", "/api", "/preview", "/resources", "/.well-known"];

/** True when the site has nothing at this address (so the proxy answers 404 itself). */
export function isUnknown(routing: SiteRouting, pathname: string): boolean {
  const path = normalisePath(pathname);

  if (OPEN_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + "/"))) {
    // /resources/{slug} is a CMS post: it must be one of the known paths.
    return path.startsWith("/resources/") ? !routing.paths.includes(path) : false;
  }

  // Files (robots.txt, sitemap.xml, images) are served or 404ed by Next.js itself.
  if (/\.[a-z0-9]{2,5}$/.test(path)) return false;

  return !routing.paths.includes(path);
}
