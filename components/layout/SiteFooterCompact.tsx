import Link from "next/link";
import type { SiteMenus, SiteSettings } from "@/lib/site";
import { compactGutter } from "./CompactBars";
import { FooterBrand, FooterLegal, FooterVisit } from "./SiteFooter";

/**
 * Tablet / mobile footer (Figma "Site footer · Compact", 39:554), below
 * 1024px. Tablet sets Visit and Explore side by side; mobile stacks them.
 * Explore always splits into two columns (4 + 3 links).
 */
export function SiteFooterCompact({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  const rows = Math.ceil(menus.footer.length / 2);

  return (
    <footer className={`flex flex-col gap-9 bg-navy pt-12 pb-8 text-white md:pt-14 lg:hidden ${compactGutter}`}>
      <FooterBrand settings={settings} compact />
      <div className="flex flex-col gap-7 md:flex-row md:gap-10">
        <div className="md:min-w-0 md:flex-1">
          <FooterVisit settings={settings} compact />
        </div>
        <nav aria-labelledby="footer-explore-compact" className="flex flex-col gap-2.5 md:min-w-0 md:flex-1">
          <h2 id="footer-explore-compact" className="text-base leading-[1.35] font-bold">
            Explore
          </h2>
          <ul
            className="grid grid-flow-col grid-cols-2 gap-x-6 gap-y-2.5 text-body-s"
            style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
          >
            {menus.footer.map((item) => (
              <li key={item.href} className="min-w-0">
                <Link href={item.href} className="rounded-sm text-white/86 underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <FooterLegal settings={settings} stacked />
    </footer>
  );
}
