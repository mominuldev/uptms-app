/**
 * True when `href` is the page the visitor is on. Home matches only "/";
 * other items match their own path and anything below it ("/tms/faq"), but
 * never a sibling that merely shares a prefix ("/tmsx"). Hash and query
 * parts of `href` are ignored, so "/#care-team" is never "current".
 *
 * On a first load of the home page `usePathname()` reads "/index": the
 * prerender of `app/page.tsx` names the route after the file it writes, and
 * the client router starts from that same canonical URL, so without the
 * normalisation below the Home pill stays unlit until the first navigation.
 */
export function isActivePath(pathname: string | null | undefined, href: string): boolean {
  if (!pathname || !href.startsWith("/") || href.includes("#")) {
    return false;
  }

  const normalise = (path: string) => {
    const bare = path.split(/[?#]/)[0] ?? "/";
    const trimmed = bare.length > 1 ? bare.replace(/\/+$/, "") : bare;

    return trimmed === "/index" ? "/" : trimmed;
  };

  const current = normalise(pathname);
  const target = normalise(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}
