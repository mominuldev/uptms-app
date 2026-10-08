import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { getPage } from "@/lib/cms";
import { toMetadata } from "@/lib/seo";

/** Home: the CMS page at "/" (uptms-ad, Pages). Titles, tags and JSON-LD come from its SEO tab. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");

  return page ? toMetadata(page.seo) : { title: "Not found" };
}

export default async function Home() {
  const page = await getPage("/");

  if (!page) {
    notFound();
  }

  return <PageView page={page} />;
}
