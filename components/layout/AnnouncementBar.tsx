import Link from "next/link";
import type { SiteSettings } from "@/lib/site";
import { fillHref, fillTokens, isExternal } from "@/lib/tokens";

/**
 * Clinic settings → Announcement bar (uptms-ad admin preview): a short notice
 * above the header on every page, at every width. Royal so it reads apart
 * from the navy utility bar beneath it. Laravel only allows site paths,
 * https:, tel: and mailto: links; `{phone}` and `tel:clinic` tokens resolve here.
 */
export function AnnouncementBar({ settings }: { settings: SiteSettings }) {
  const { announcement } = settings;
  if (!announcement) return null;

  const link = announcement.link
    ? {
        label: fillTokens(announcement.link.label, settings),
        href: fillHref(announcement.link.href, settings),
      }
    : null;
  const linkClasses =
    "shrink-0 rounded-sm font-display font-bold text-sky underline underline-offset-2 hover:text-white";

  return (
    <aside aria-label="Announcement" className="bg-royal text-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-caption px-5 md:px-10 lg:text-body-s xl:px-[120px]">
        <MegaphoneIcon />
        <p className="min-w-0 [overflow-wrap:anywhere]">
          {fillTokens(announcement.text, settings)}
        </p>
        {link &&
          (link.href.startsWith("/") && !link.href.startsWith("//") ? (
            <Link href={link.href} className={linkClasses}>
              {link.label} →
            </Link>
          ) : (
            <a
              href={link.href}
              className={linkClasses}
              {...(isExternal(link.href)
                ? { target: "_blank", rel: "noopener" }
                : {})}
            >
              {link.label} →
            </a>
          ))}
      </div>
    </aside>
  );
}

function MegaphoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-sky"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
