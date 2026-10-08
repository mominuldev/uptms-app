import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/site";
import { Logo } from "./Logo";

/** Compact gutter: 20px on mobile, 40px on tablet. */
export const compactGutter = "px-5 md:px-10";

/**
 * Navy utility bar of the compact header (Figma "Site header · Compact").
 * Mobile shows the phone line centred; tablet adds the service area and
 * hours on the left. `centred` keeps the single phone line on tablet too,
 * as in the menu-open frames.
 */
export function CompactTopbar({ settings, centred = false }: { settings: SiteSettings; centred?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 bg-navy py-2.5 text-caption ${compactGutter} ${
        centred ? "justify-center" : "justify-center md:justify-between"
      }`}
    >
      {!centred && (
        <p className="hidden text-white md:block">
          {settings.serviceArea} · {settings.hours.short}
        </p>
      )}
      <a
        href={settings.phone.href}
        className="rounded-sm text-center font-display leading-[1.3] font-bold text-sky hover:text-white"
      >
        <span className="md:hidden">Free phone consult · </span>
        <span className="hidden md:inline">Free phone consultation: </span>
        {settings.phone.display}
      </a>
    </div>
  );
}

/** White logo row; `actions` is the right-hand cluster (CTA + menu/close button). */
export function CompactBar({ settings, actions }: { settings: SiteSettings; actions: ReactNode }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-line bg-white py-3 ${compactGutter}`}>
      <Logo size="compact" clinicName={settings.clinicName} eager />
      <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
    </div>
  );
}
