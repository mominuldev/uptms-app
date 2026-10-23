import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/site";
import { Logo } from "./Logo";

/** Compact gutter: 20px on mobile, 40px on tablet. */
export const compactGutter = "px-5 md:px-10";

/** White logo row; `actions` is the right-hand cluster (CTA + menu/close button). */
export function CompactBar({ settings, actions }: { settings: SiteSettings; actions: ReactNode }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-line bg-white py-3 ${compactGutter}`}>
      <Logo size="compact" clinicName={settings.clinicName} eager />
      <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
    </div>
  );
}
