import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { getPage, getPages } from "@/lib/cms";
import { toMetadata } from "@/lib/seo";

/**
 * Every other CMS page (/tms, /contact, /quiz, and pages staff create).
 * Published pages are prerendered; a page published or moved later gets
 * the App Shell at once, renders on its first visit and is cached from
 * then on. That needs `params` awaited inside <Suspense>: awaited above
 * it, an unlisted path fails with NEXT_STATIC_GEN_BAILOUT (a 500).
 */
export async function generateStaticParams() {
  const pages = await getPages();
  const params = pages.filter((page) => page.path !== "/").map((page) => ({ path: page.path.replace(/^\//, "").split("/") }));

  // Cache Components needs at least one entry to validate the route at build time.
  return params.length > 0 ? params : [{ path: ["tms"] }];
}

function toPath(segments: string[]): string {
  return "/" + segments.map((segment) => decodeURIComponent(segment)).join("/");
}

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const page = await getPage(toPath((await params).path));

  return page ? toMetadata(page.seo) : { title: "Not found" };
}

export default function CmsPage({ params }: PageProps<"/[...path]">) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <CmsPageContent params={params} />
    </Suspense>
  );
}

async function CmsPageContent({ params }: Pick<PageProps<"/[...path]">, "params">) {
  const path = toPath((await params).path);

  if (!/^\/[a-z0-9\-/]+$/.test(path)) {
    notFound();
  }

  const page = await getPage(path);

  if (!page) {
    notFound();
  }

  return <PageView page={page} />;
}
