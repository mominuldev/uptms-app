/**
 * Phase 1 placeholder for the clinic settings and menus the shell needs.
 * Copy is taken verbatim from Figma (Version C, node 25-2).
 *
 * Phase 2 replaces these constants with `GET /public/settings` and
 * `GET /public/menus` (uptms-ad). Keep the shapes below in step with those
 * payloads so the swap is a data-source change only: components receive
 * `SiteSettings` / `SiteMenus` and never import the constants directly
 * except through `getSiteSettings()` / `getSiteMenus()`.
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
  address: { street: string; locality: string; region: string; postalCode: string };
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
}

export interface SiteMenus {
  /** Header pills and menu sheet: Home / TMS / Contact / Quiz. */
  primary: NavItem[];
  /** Footer "Explore" list. */
  footer: NavItem[];
  /** Primary calls to action used across the shell. */
  cta: { selfCheck: NavItem; selfCheckShort: NavItem };
}

const settings: SiteSettings = {
  clinicName: "University Place TMS Clinic & General Psychiatry",
  tagline: "Deep TMS and general psychiatric care for University Place and Greater Tacoma.",
  serviceArea: "University Place & Greater Tacoma",
  phone: { display: "253-234-4199", href: "tel:+12532344199" },
  email: "contact@uptms.com",
  address: {
    street: "4007 Bridgeport Way W, Suite B",
    locality: "University Place",
    region: "WA",
    postalCode: "98466",
  },
  hours: { short: "Mon–Fri, 8am–5pm", long: "Mon–Fri · 8:00 AM–5:00 PM" },
  // Placeholder until the clinic confirms the main website URL (settings, Phase 2).
  mainSiteUrl: "https://uptms.com",
  social: [],
  legal: {
    copyright: "© 2026 University Place TMS Clinic & General Psychiatry",
    crisis:
      "This site is not a crisis service. In the U.S., call or text 988 for crisis support; call 911 for an immediate emergency.",
    crisisShort: "Not a crisis service. Call or text 988 for crisis support; call 911 for an immediate emergency.",
  },
};

const menus: SiteMenus = {
  primary: [
    { label: "Home", href: "/" },
    { label: "TMS", href: "/tms" },
    { label: "Contact", href: "/contact" },
    { label: "Quiz", href: "/quiz" },
  ],
  footer: [
    { label: "Home", href: "/" },
    { label: "TMS", href: "/tms" },
    { label: "Contact", href: "/contact" },
    { label: "Free self-check", href: "/quiz" },
    { label: "Care team", href: "/#care-team" },
    { label: "Insurance", href: "/#insurance" },
    { label: "Location & directions", href: "/#location" },
  ],
  cta: {
    selfCheck: { label: "Free TMS Self-Check", href: "/quiz" },
    selfCheckShort: { label: "Free Self-Check", href: "/quiz" },
  },
};

/** Phase 2: `getData<SiteSettings>("public/settings")` behind `'use cache'`. */
export function getSiteSettings(): SiteSettings {
  return settings;
}

/** Phase 2: `getData<SiteMenus>("public/menus")` behind `'use cache'`. */
export function getSiteMenus(): SiteMenus {
  return menus;
}
