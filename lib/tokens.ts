import type { Link } from "./content";
import type { SiteSettings } from "./site";

/**
 * Placeholders editors may use in labels and links (uptms-ad admin:
 * CONTENT_TOKENS_HELP). They keep the phone number, hours and email in one
 * place — Clinic settings — instead of copied into every button.
 */
export function fillTokens(text: string, settings: Pick<SiteSettings, "phone" | "hours" | "email">): string {
  return text
    .replaceAll("{phone}", settings.phone.display)
    .replaceAll("{hours}", settings.hours.long)
    .replaceAll("{email}", settings.email);
}

export function fillHref(href: string, settings: Pick<SiteSettings, "phone" | "email">): string {
  if (href === "tel:clinic") return settings.phone.href;
  if (href === "mailto:clinic") return `mailto:${settings.email}`;

  return href;
}

/** A link worth rendering: both parts filled in, tokens resolved. */
export function resolveLink(link: Link | null | undefined, settings: Pick<SiteSettings, "phone" | "hours" | "email">): Link | null {
  if (!link || link.label.trim() === "" || link.href.trim() === "") {
    return null;
  }

  return { label: fillTokens(link.label, settings), href: fillHref(link.href, settings) };
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
