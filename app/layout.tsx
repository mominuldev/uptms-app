import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Deep TMS Therapy in University Place, WA | UPTMS",
    template: "%s | UPTMS",
  },
  description:
    "Explore Deep TMS therapy for depression and OCD with University Place TMS Clinic & General Psychiatry, serving Greater Tacoma. Your initial phone consultation is free.",
  // Nothing is indexed until launch (docs/ROADMAP.md, Phase 5). Per-page SEO
  // comes from the API in Phase 4.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
