import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Headline } from "@/components/content/Headline";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { SectionRail } from "@/components/ui/SectionRail";
import { getPostCategories, getPosts } from "@/lib/cms";
import { indexingAllowed } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site";
import { ArrowLabel } from "@/components/ui/ArrowLabel";

/**
 * /resources: patient guides from the CMS (uptms-ad, Posts). No Figma frame
 * exists, so it reuses Version C's navy hero panel, cards and pills.
 */
export async function generateMetadata(): Promise<Metadata> {
  const index = indexingAllowed();

  return {
    title: { absolute: "Patient resources: guides to Deep TMS | UPTMS" },
    description: "Guides from University Place TMS Clinic: what a Deep TMS session feels like, preparing for an evaluation, and questions to ask your insurer.",
    alternates: { canonical: "/resources" },
    robots: { index, follow: index },
  };
}

async function Listing({ searchParams }: { searchParams: PageProps<"/resources">["searchParams"] }) {
  const query = await searchParams;
  const category = typeof query.category === "string" && /^[a-z0-9-]+$/.test(query.category) ? query.category : null;
  const page = typeof query.page === "string" && /^\d+$/.test(query.page) ? Math.max(1, Number(query.page)) : 1;
  const [list, categories] = await Promise.all([getPosts(category, page), getPostCategories()]);
  const pageHref = (target: number) => `/resources?${new URLSearchParams({ ...(category ? { category } : {}), ...(target > 1 ? { page: String(target) } : {}) }).toString()}`;

  return (
    <>
      <nav aria-label="Topics" className="flex flex-wrap gap-2.5">
        {[{ name: "All guides", slug: null as string | null }, ...categories.map((c) => ({ name: c.name, slug: c.slug as string | null }))].map((item) => {
          const active = item.slug === category;

          return (
            <Link
              key={item.slug ?? "all"}
              href={item.slug ? `/resources?category=${item.slug}` : "/resources"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border-[1.5px] px-5 py-2.5 font-display text-[15px] font-bold transition-colors ${active ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-ink"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {list.posts.length === 0 ? (
        <p className="rounded-card bg-sky-soft px-6 py-8 text-body-l text-ink">New guides are on their way. In the meantime, call the clinic with any question.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.posts.map((post, index) => (
            <li key={post.slug}>
              <PostCard post={post} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}

      {list.last_page > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-between gap-4">
          {list.page > 1 ? (
            <Button href={pageHref(list.page - 1)} variant="secondary">
              ← Newer guides
            </Button>
          ) : (
            <span />
          )}
          <span className="text-body-s text-ink-soft">
            Page {list.page} of {list.last_page}
          </span>
          {list.page < list.last_page ? (
            <Button href={pageHref(list.page + 1)} variant="secondary">
              <ArrowLabel>Older guides →</ArrowLabel>
            </Button>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default async function ResourcesPage({ searchParams }: PageProps<"/resources">) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col pb-6">
      <div className="pt-3 md:pt-4 lg:pt-6">
        <Panel tone="navy" aria-labelledby="resources-title">
          <div className="flex max-w-[760px] flex-col gap-6">
            <SectionRail number="01" label="Patient resources" tone="dark" />
            <Headline as="h1" id="resources-title" tone="dark" text="Guides for *your next step.*" className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-display-l" />
            <p className="max-w-[600px] text-body-l text-white/86">
              Plain-language guides to Deep TMS, insurance and getting started. Health guides are reviewed by the clinic’s providers before they are published.
            </p>
          </div>
        </Panel>
      </div>

      <Container as="section" aria-label="Guides" className="flex flex-col gap-10 py-14 md:py-20">
        <Suspense fallback={<div className="h-[480px] animate-pulse rounded-sheet bg-paper" aria-label="Loading guides" />}>
          <Listing searchParams={searchParams} />
        </Suspense>
      </Container>

      <Panel tone="sky" aria-labelledby="resources-cta">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[620px] flex-col gap-3">
            <Headline id="resources-cta" text="Prefer to *talk it through?*" className="font-serif text-[32px] leading-[1.1] tracking-[-0.02em] md:text-heading-m" />
            <p className="text-body-l text-ink-soft">Your initial phone consultation is free. Ask about Deep TMS, insurance, or care for someone you love.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Request a Phone Consultation</Button>
            <Button href={settings.phone.href} variant="secondary">
              Call {settings.phone.display}
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
