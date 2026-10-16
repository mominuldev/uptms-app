import "server-only";
import { getMenus, getSettings } from "./cms";
import type { ApiMenus, ApiSettings, MenuLink } from "./content";

/**
 * The shell's view of clinic settings and menus. Components receive
 * `SiteSettings` / `SiteMenus` (camelCase, only what the shell needs); the
 * API payloads are mapped here, in one place.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  network: "facebook" | "instagram" | "linkedin" | "youtube" | "x";
  label: string;
  href: string;
}

export interface SiteSettings {
  clinicName: string;
  tagline: string;
  /** Short line in the desktop utility bar. */
  serviceArea: string;
  phone: { display: string; href: string };
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
  };
  hours: {
    /** "Mon–Fri, 8am–5pm" (utility bar, footer). */
    short: string;
    /** "Mon–Fri · 8:00 AM–5:00 PM" (menu "Visit or call" card). */
    long: string;
  };
  mainSiteUrl: string;
  social: SocialLink[];
  legal: {
    copyright: string;
    crisis: string;
    crisisShort: string;
  };
  /** Clinic settings → Announcement bar; null while switched off. */
  announcement: { text: string; link: NavItem | null } | null;
}

export interface SiteMenus {
  /** Header pills and menu sheet: Home / TMS / Contact / Quiz. */
  primary: NavItem[];
  /** Tablet sheet and phone menu (falls back to `primary`). */
  mobile: NavItem[];
  /** Footer "Explore" list. */
  footer: NavItem[];
  /** Footer bottom-bar links (privacy, accessibility). */
  legal: NavItem[];
  /** Primary calls to action used across the shell. */
  cta: { selfCheck: NavItem; selfCheckShort: NavItem };
}

/** Shell settings from `GET /public/settings` (Clinic settings, Figma 24). */
export async function getSiteSettings(): Promise<SiteSettings> {
  return toSiteSettings(await getSettings());
}

/** Shell menus from `GET /public/menus` (Navigation menus, Figma 17). */
export async function getSiteMenus(): Promise<SiteMenus> {
  return toSiteMenus(await getMenus());
}

const SOCIAL = new Set<SocialLink["network"]>([
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "x",
]);

export function toSiteSettings(api: ApiSettings): SiteSettings {
  const { clinic } = api;

  return {
    clinicName: clinic.name,
    tagline: clinic.tagline,
    serviceArea: clinic.service_area_label,
    phone: clinic.phone,
    email: clinic.email,
    address: {
      street: clinic.address.street,
      locality: clinic.address.locality,
      region: clinic.address.region,
      postalCode: clinic.address.postal_code,
    },
    hours: { short: api.hours.short, long: api.hours.long },
    mainSiteUrl: clinic.main_site_url ?? "/",
    social: clinic.social
      .filter((item): item is { network: SocialLink["network"]; url: string } =>
        SOCIAL.has(item.network as SocialLink["network"])
      )
      .map((item) => ({
        network: item.network,
        label:
          item.network === "x"
            ? "X"
            : item.network[0]!.toUpperCase() + item.network.slice(1),
        href: item.url,
      })),
    legal: {
      copyright: api.legal.copyright,
      crisis: api.legal.crisis,
      crisisShort: api.legal.crisis_short,
    },
    announcement: api.announcement
      ? {
          text: api.announcement.text,
          link:
            api.announcement.link_label && api.announcement.link_url
              ? {
                  label: api.announcement.link_label,
                  href: api.announcement.link_url,
                }
              : null,
        }
      : null,
  };
}

const flat = (items: MenuLink[] | undefined): NavItem[] =>
  (items ?? []).map(({ label, href }) => ({ label, href }));

export function toSiteMenus(api: ApiMenus): SiteMenus {
  const primary = flat(api.header);
  const selfCheck =
    primary.find((item) => item.href === "/quiz")?.href ?? "/quiz";

  return {
    primary,
    mobile: api.mobile && api.mobile.length > 0 ? flat(api.mobile) : primary,
    footer: flat(api["footer-explore"]),
    legal: flat(api["footer-legal"]),
    cta: {
      selfCheck: { label: "Free TMS Self-Check", href: selfCheck },
      selfCheckShort: { label: "Free Self-Check", href: selfCheck },
    },
  };
}
