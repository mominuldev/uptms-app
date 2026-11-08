import Link from "next/link";
import type { NavItem, SiteMenus, SiteSettings } from "@/lib/site";
import { FooterLogo } from "./Logo";
import { desktopGutter } from "./SiteHeader";

const linkClasses = "rounded-sm text-white/86 transition-colors hover:text-white hover:underline underline-offset-4";

/** Shared pieces of both footers. */
export function FooterBrand({ settings, compact = false }: { settings: SiteSettings; compact?: boolean }) {
  return (
    <div className={`flex flex-col items-start ${compact ? "gap-3.5" : "gap-4"}`}>
      <FooterLogo clinicName={settings.clinicName} compact={compact} />
      <p className="max-w-[340px] text-body-s text-white/86">{settings.tagline}</p>
    </div>
  );
}

export function FooterVisit({ settings, compact = false }: { settings: SiteSettings; compact?: boolean }) {
  const { address } = settings;

  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-3"}`}>
      <h2 className={`font-bold ${compact ? "text-base leading-[1.35]" : "text-title"}`}>Visit or call</h2>
      <address className="text-body-s text-white/86 not-italic">
        {address.street}
        <br />
        {address.locality}, {address.region} {address.postalCode}
      </address>
      <p className="flex flex-col items-start text-body-s text-white/86">
        <span>{settings.hours.short}</span>
        <a href={settings.phone.href} className={linkClasses}>
          {settings.phone.display}
        </a>
        <a href={`mailto:${settings.email}`} className={linkClasses}>
          {settings.email}
        </a>
      </p>
    </div>
  );
}

/** The bottom bar: copyright, the legal menu (privacy, accessibility) and the crisis line. */
export function FooterLegal({ settings, links = [], stacked = false }: { settings: SiteSettings; links?: NavItem[]; stacked?: boolean }) {
  return (
    <div
      className={`flex border-t border-white/20 text-caption text-white/72 ${
        stacked ? "flex-col gap-2 pt-5" : "flex-wrap justify-between gap-x-10 gap-y-2 pt-6"
      }`}
    >
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <span>{settings.legal.copyright}</span>
        {links.map((item, index) => (
          <Link key={`${item.href}-${index}`} href={item.href} className="rounded-sm text-white/72 underline-offset-4 hover:text-white hover:underline">
            {item.label}
          </Link>
        ))}
      </p>
      <p>{settings.legal.crisis}</p>
    </div>
  );
}

/**
 * Desktop footer (Figma "Site footer", 25:105), from 1024px: brand, visit,
 * explore columns over a legal row.
 */
export function SiteFooter({ settings, menus }: { settings: SiteSettings; menus: SiteMenus }) {
  return (
    <footer className="hidden bg-navy text-white lg:block">
      <div className={`mx-auto flex max-w-[1440px] flex-col gap-12 pt-[72px] pb-10 ${desktopGutter}`}>
        <div className="grid grid-cols-3 gap-16">
          <FooterBrand settings={settings} />
          <FooterVisit settings={settings} />
          <nav aria-labelledby="footer-explore" className="flex flex-col gap-2.5">
            <h2 id="footer-explore" className="text-title font-bold">
              Explore
            </h2>
            <ul className="flex flex-col gap-2.5 text-body-s">
              {menus.footer.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <Link href={item.href} className={linkClasses}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <FooterLegal settings={settings} links={menus.legal} />
      </div>
    </footer>
  );
}
