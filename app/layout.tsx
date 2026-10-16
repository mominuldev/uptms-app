import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteFooterCompact } from "@/components/layout/SiteFooterCompact";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteHeaderCompact } from "@/components/layout/SiteHeaderCompact";
import { getSeoSite } from "@/lib/cms";
import { indexingAllowed } from "@/lib/seo";
import { getSiteMenus, getSiteSettings } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Defaults every page refines with its own SEO (lib/seo.ts toMetadata).
 * Pages set absolute titles from the API's title templates. Nothing is
 * indexed until launch: ALLOW_INDEXING=true switches that on.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSite();
  const index = indexingAllowed();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Deep TMS Therapy in University Place, WA | UPTMS",
      template: `%s ${seo?.separator ?? "|"} ${seo?.site_name ?? "UPTMS"}`,
    },
    description:
      "Explore Deep TMS therapy for depression and OCD with University Place TMS Clinic & General Psychiatry, serving Greater Tacoma. Your initial phone consultation is free.",
    robots: { index, follow: index },
    verification: {
      google: seo?.verification.google,
      other: seo?.verification.bing ? { "msvalidate.01": seo.verification.bing } : undefined,
    },
    twitter: seo?.x_handle ? { site: seo.x_handle } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, menus] = await Promise.all([getSiteSettings(), getSiteMenus()]);

  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-full bg-royal px-5 py-3 font-display font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to main content
        </a>
        <AnnouncementBar settings={settings} />
        <SiteHeader settings={settings} menus={menus} />
        <SiteHeaderCompact settings={settings} menus={menus} />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
          {children}
        </main>
        <SiteFooter settings={settings} menus={menus} />
        <SiteFooterCompact settings={settings} menus={menus} />
        <MobileCtaBar settings={settings} menus={menus} />
      </body>
    </html>
  );
}
