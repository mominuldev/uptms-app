import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import type { SiteMenus, SiteSettings } from "@/lib/site";
import { CompactBar, CompactTopbar } from "./CompactBars";
import { MenuToggleFallback, SiteMenu } from "./SiteMenu";

/**
 * Tablet / mobile header (Figma "Site header · Compact", 39:501), shown
 * below 1024px. Tablet keeps the self-check CTA beside the menu button;
 * mobile moves it into the menu and the sticky MobileCtaBar.
 */
export function SiteHeaderCompact({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  return (
    <header className="lg:hidden">
      <CompactTopbar settings={settings} />
      <CompactBar
        settings={settings}
        actions={
          <>
            <Button href={menus.cta.selfCheck.href} className="hidden md:inline-flex">
              {menus.cta.selfCheck.label}
            </Button>
            <Suspense fallback={<MenuToggleFallback />}>
              <SiteMenu settings={settings} menus={menus} />
            </Suspense>
          </>
        }
      />
    </header>
  );
}
