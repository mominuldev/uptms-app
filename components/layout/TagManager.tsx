"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import type { TagManagerContainer } from "@/lib/content";
import { tagsExcluded } from "@/lib/seo";

/** What the API is allowed to put inside the inline loader. */
const ID = /^GTM-[A-Z0-9]{5,12}$/;

/**
 * The one third-party container the site may load: Google Tag Manager, as
 * switched on in the admin (SEO → Settings → Analytics). `container` is null
 * while analytics are off, and then nothing is rendered at all.
 *
 * The clinic keeps whole paths tag-free (`exclude_paths`, by default the
 * consultation form and the self-check): there the container is never
 * injected, so nothing a patient types or answers reaches Google.
 *
 * It needs the current path, so the root layout renders it inside <Suspense>
 * (usePathname suspends while the shell is prerendered, as in SiteHeader) and
 * the container loads as soon as the path is known.
 */
export function TagManager({ container }: { container: TagManagerContainer | null }) {
  const pathname = usePathname();
  const id = container !== null && ID.test(container.id) ? container.id : null;
  const live = id !== null && !tagsExcluded(pathname, container?.exclude_paths ?? []);

  /**
   * gtm.js stays in memory once it has loaded, so a client-side navigation
   * into an excluded path would carry the container onto the form with it.
   * While a container is live, links into those paths leave the router and
   * reload the document, which starts it without the tag.
   */
  useEffect(() => {
    const excluded = container?.exclude_paths ?? [];

    if (!live || excluded.length === 0) {
      return;
    }

    const guard = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target instanceof Element ? event.target.closest("a") : null;

      if (!anchor || (anchor.target !== "" && anchor.target !== "_self") || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      // Same-site page links only: tel:, mailto: and other origins are left alone.
      if (url.origin !== window.location.origin || !tagsExcluded(url.pathname, excluded)) {
        return;
      }

      event.preventDefault();
      window.location.assign(url.href);
    };

    document.addEventListener("click", guard, true);

    return () => document.removeEventListener("click", guard, true);
  }, [live, container]);

  if (!live) {
    return null;
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
