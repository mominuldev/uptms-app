import { Button } from "@/components/ui/Button";
import type { SiteMenus, SiteSettings } from "@/lib/site";

/**
 * Sticky bottom bar on mobile (Figma "Mobile CTA bar", 39:555): Call Us and
 * Free Self-Check. It is the last element of <body> and `position: sticky`,
 * so it rides the bottom of the viewport while scrolling and comes to rest
 * below the footer instead of covering it. Hidden from 768px.
 */
export function MobileCtaBar({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  return (
    <nav
      aria-label="Quick actions"
      className="sticky bottom-0 z-40 flex gap-2.5 border-t border-line bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_12px_rgba(14,48,79,0.1)] md:hidden"
    >
      <Button href={settings.phone.href} variant="secondary" size="sm" className="min-w-0 flex-1 whitespace-nowrap">
        Call Us
      </Button>
      <Button href={menus.cta.selfCheckShort.href} size="sm" className="min-w-0 flex-1 whitespace-nowrap">
        {menus.cta.selfCheckShort.label}
      </Button>
    </nav>
  );
}
