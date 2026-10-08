import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { getPage } from "@/lib/cms";

/** Home: the CMS page at "/" (uptms-ad, Pages). */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");

  // Phase 4 brings per-page SEO; the root layout's default title stands in.
  return page ? {} : { title: "Not found" };
}

export default async function Home() {
  const page = await getPage("/");

  if (!page) {
    notFound();
  }

  return <PageView page={page} />;
}
