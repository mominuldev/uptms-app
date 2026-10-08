import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { getPage, getPages } from "@/lib/cms";

/**
 * Every other CMS page (/tms, /contact, /quiz, and pages staff create).
 * Published pages are prerendered; a page published later renders on its
 * first visit and is cached from then on.
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

  return page ? { title: page.title } : { title: "Not found" };
}

export default async function CmsPage({ params }: PageProps<"/[...path]">) {
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
