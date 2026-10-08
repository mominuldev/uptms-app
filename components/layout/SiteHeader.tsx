import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import type { SiteMenus, SiteSettings } from "@/lib/site";
import { Logo } from "./Logo";
import { ActivePrimaryNav, PrimaryNav } from "./PrimaryNav";

/** Desktop gutter: 40px from 1024, 120px at the 1440 design width. */
export const desktopGutter = "px-10 xl:px-[120px]";

/**
 * Desktop header (Figma "Site header", 25:104): navy utility bar, then logo,
 * pill navigation with the active page, and the self-check CTA. Shown from
 * 1024px; below that SiteHeaderCompact takes over.
 */
export function SiteHeader({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  return (
    <header className="hidden bg-white lg:block">
      <div className="bg-navy text-white">
        <div className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 py-2.5 ${desktopGutter}`}>
          <p className="text-body-s">
            {settings.serviceArea} · {settings.hours.short}
          </p>
          <a
            href={settings.phone.href}
            className="rounded-sm font-display text-sm leading-[1.3] font-bold text-sky hover:text-white"
          >
            Free phone consultation: {settings.phone.display}
          </a>
        </div>
      </div>

      <div className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 py-4 ${desktopGutter}`}>
        <Logo size="desktop" clinicName={settings.clinicName} eager />
        <nav aria-label="Primary">
          {/* usePathname suspends on routes with unknown dynamic params (Cache Components). */}
          <Suspense fallback={<PrimaryNav items={menus.primary} />}>
            <ActivePrimaryNav items={menus.primary} />
          </Suspense>
        </nav>
        <Button href={menus.cta.selfCheck.href} className="shrink-0">
          {menus.cta.selfCheck.label}
        </Button>
      </div>
    </header>
  );
}
