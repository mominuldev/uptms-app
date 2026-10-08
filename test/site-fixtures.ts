import type { SiteMenus, SiteSettings } from "@/lib/site";

/** The seeded Figma values, for component tests that don't call the API. */
export const settings: SiteSettings = {
  clinicName: "University Place TMS Clinic & General Psychiatry",
  tagline: "Deep TMS and general psychiatric care for University Place and Greater Tacoma.",
  serviceArea: "University Place & Greater Tacoma",
  phone: { display: "253-234-4199", href: "tel:+12532344199" },
  email: "contact@uptms.com",
  address: { street: "4007 Bridgeport Way W, Suite B", locality: "University Place", region: "WA", postalCode: "98466" },
  hours: { short: "Mon–Fri, 8am–5pm", long: "Mon–Fri · 8:00 AM–5:00 PM" },
  mainSiteUrl: "https://uptms.com",
  social: [],
  legal: {
    copyright: "© 2026 University Place TMS Clinic & General Psychiatry",
    crisis: "This site is not a crisis service. In the U.S., call or text 988 for crisis support; call 911 for an immediate emergency.",
    crisisShort: "Not a crisis service. Call or text 988 for crisis support; call 911 for an immediate emergency.",
  },
};

const primary = [
  { label: "Home", href: "/" },
  { label: "TMS", href: "/tms" },
  { label: "Contact", href: "/contact" },
  { label: "Quiz", href: "/quiz" },
];

export const menus: SiteMenus = {
  primary,
  mobile: primary,
  footer: [
    { label: "Home", href: "/" },
    { label: "TMS", href: "/tms" },
    { label: "Contact", href: "/contact" },
    { label: "Free self-check", href: "/quiz" },
    { label: "Care team", href: "/#care-team" },
    { label: "Insurance", href: "/#insurance" },
    { label: "Location & directions", href: "/#location" },
  ],
  legal: [],
  cta: { selfCheck: { label: "Free TMS Self-Check", href: "/quiz" }, selfCheckShort: { label: "Free Self-Check", href: "/quiz" } },
};
