/**
 * True when `href` is the page the visitor is on. Home matches only "/";
 * other items match their own path and anything below it ("/tms/faq"), but
 * never a sibling that merely shares a prefix ("/tmsx"). Hash and query
 * parts of `href` are ignored, so "/#care-team" is never "current".
 */
export function isActivePath(pathname: string | null | undefined, href: string): boolean {
  if (!pathname || !href.startsWith("/") || href.includes("#")) {
    return false;
  }

  const normalise = (path: string) => {
    const bare = path.split(/[?#]/)[0] ?? "/";
    return bare.length > 1 ? bare.replace(/\/+$/, "") : bare;
  };

  const current = normalise(pathname);
  const target = normalise(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}
