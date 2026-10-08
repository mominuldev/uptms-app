"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, CloseIcon, DotIcon, MenuIcon } from "@/components/ui/icons";
import { isActivePath } from "@/lib/navigation";
import type { NavItem, SiteMenus, SiteSettings } from "@/lib/site";
import { CompactBar, CompactTopbar } from "./CompactBars";

const toggleClasses =
  "flex size-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line text-ink transition-colors hover:bg-sky-soft";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Focusable elements in order; skips copies hidden at the current breakpoint. */
function focusableIn(root: HTMLElement): HTMLElement[] {
  const all = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest("[hidden]"));
  const rendered = all.filter((el) => el.getClientRects().length > 0);

  // No layout engine (jsdom): treat everything as rendered.
  return rendered.length > 0 ? rendered : all;
}

/** Server-rendered stand-in while the pathname is unknown (Cache Components prerender). */
export function MenuToggleFallback() {
  return (
    <button type="button" className={toggleClasses} aria-label="Menu" aria-expanded={false} disabled>
      <MenuIcon />
    </button>
  );
}

/**
 * Compact-header menu (Figma "Site menu · Open", 49:1531): full-screen sheet
 * on mobile, a drop-down sheet over a scrim on tablet. A modal dialog with a
 * focus trap, Escape to close, focus returned to the toggle, and the page
 * scroll locked while open. It closes on navigation and from 1024px up,
 * where the desktop header takes over.
 */
export function SiteMenu({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  const pathname = usePathname();
  const id = useId();
  const dialogId = `site-menu-${id.replace(/:/g, "")}`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Open state belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;

  const close = useCallback((returnFocus: boolean) => {
    setOpenOn(null);
    if (returnFocus) {
      toggleRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const sheet = sheetRef.current;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }

      if (event.key !== "Tab" || !sheet) {
        return;
      }

      const items = focusableIn(sheet);
      const first = items[0];
      const last = items[items.length - 1];

      if (!first || !last) {
        return;
      }

      const active = document.activeElement;
      const outside = !sheet.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = typeof window.matchMedia === "function" ? window.matchMedia("(min-width: 1024px)") : null;
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) {
        close(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    desktop?.addEventListener("change", onBreakpoint);

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop?.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  // Any link in the sheet (including one to the current page) closes it.
  const onSheetClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      close(false);
    }
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={toggleClasses}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpenOn(pathname)}
      >
        <MenuIcon />
      </button>

      <div id={dialogId} role="dialog" aria-modal="true" aria-label="Site menu" hidden={!open} className="fixed inset-0 z-50 lg:hidden">
        <div aria-hidden="true" className="absolute inset-0 hidden bg-navy/55 md:block" onClick={() => close(true)} />

        <div
          ref={sheetRef}
          onClick={onSheetClick}
          className="relative flex h-dvh flex-col overflow-y-auto overscroll-contain bg-white md:h-auto md:max-h-dvh md:rounded-b-panel md:shadow-[0_16px_40px_rgba(14,48,78,0.18)]"
        >
          <CompactTopbar settings={settings} centred />
          <CompactBar
            settings={settings}
            actions={
              <>
                <Button href={menus.cta.selfCheck.href} className="hidden md:inline-flex">
                  {menus.cta.selfCheck.label}
                </Button>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={() => close(true)}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-soft text-ink transition-colors hover:bg-sky"
                >
                  <CloseIcon />
                </button>
              </>
            }
          />

          <div className="flex flex-1 flex-col gap-6 p-5 md:grid md:flex-none md:grid-cols-[minmax(0,1fr)_280px] md:items-start md:gap-8 md:px-10 md:pt-7 md:pb-10">
            <nav aria-labelledby={`${dialogId}-label`} className="flex flex-col gap-2">
              <p id={`${dialogId}-label`} className="pl-4 font-display text-eyebrow font-bold tracking-[0.1em] text-ink-soft uppercase">
                Menu
              </p>
              <ul className="flex flex-col gap-1">
                {menus.primary.map((item) => (
                  <li key={item.href}>
                    <MenuLink item={item} current={isActivePath(pathname, item.href)} />
                  </li>
                ))}
              </ul>
            </nav>

            <Button href={menus.cta.selfCheck.href} className="w-full md:hidden">
              {menus.cta.selfCheck.label}
            </Button>

            {/* Mobile: these join the column above (display: contents); tablet: the side column. */}
            <div className="contents md:flex md:flex-col md:gap-4">
              <Button href={settings.phone.href} variant="secondary" className="-mt-3 w-full md:hidden">
                Call {settings.phone.display}
              </Button>
              <VisitCard settings={settings} />
              <Button href={settings.phone.href} variant="secondary" className="hidden w-full md:inline-flex">
                Call {settings.phone.display}
              </Button>
              <p className="-mx-5 -mb-5 mt-auto border-t border-line px-5 pt-3.5 pb-5 text-caption text-ink-soft md:m-0 md:border-0 md:p-0">
                {settings.legal.crisisShort}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Row in the open menu (Figma "Menu link", 49:1431): Default / Current. */
export function MenuLink({ item, current }: { item: NavItem; current: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors ${
        current ? "bg-sky-soft text-royal-deep" : "text-ink hover:bg-paper"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {current && <DotIcon className="shrink-0 text-royal" />}
        <span className="font-serif text-heading-s">{item.label}</span>
      </span>
      <ArrowIcon className={`shrink-0 ${current ? "text-royal-deep" : "text-ink-soft"}`} />
    </Link>
  );
}

function VisitCard({ settings }: { settings: SiteSettings }) {
  const { address } = settings;

  return (
    <div className="flex flex-col gap-2.5 rounded-card bg-paper p-5 text-body-s">
      <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal-deep uppercase">Visit or call</p>
      <p className="text-ink">{settings.hours.long}</p>
      <address className="text-ink-soft not-italic">
        {address.street}
        <br />
        {address.locality}, {address.region} {address.postalCode}
      </address>
      <a href={`mailto:${settings.email}`} className="self-start rounded-sm font-display text-base leading-[1.3] font-bold break-all text-royal hover:text-royal-deep">
        {settings.email}
      </a>
    </div>
  );
}
