"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * Floating "Back to top" button, bottom-right. It appears once a full
 * viewport has scrolled past, so short pages never show it, and sits above
 * the sticky MobileCtaBar on phones (which is hidden from 768px, where the
 * button drops to the usual gutter). Fades out of the accessibility tree and
 * the tab order while it is away; the scroll itself honours reduced motion,
 * which the base stylesheet cannot reach.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`fixed right-4 bottom-[calc(90px+env(safe-area-inset-bottom))] z-30 flex size-12 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-royal shadow-[0_8px_20px_rgba(14,48,78,0.18)] transition-[opacity,translate,background-color] duration-200 hover:bg-sky-soft md:right-6 md:bottom-6 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowIcon className="-rotate-90" />
    </button>
  );
}
