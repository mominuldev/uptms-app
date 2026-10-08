import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ConditionDetail } from "@/components/conditions/ConditionDetail";
import { getCondition, getConditions } from "@/lib/cms";
import { getSiteSettings } from "@/lib/site";

/** Condition pages, one per published condition (uptms-ad Conditions, Figma 13). */
export async function generateStaticParams() {
  const conditions = await getConditions();

  // Cache Components needs at least one entry to validate the route at build time.
  return conditions.length > 0 ? conditions.map((condition) => ({ slug: condition.slug })) : [{ slug: "depression" }];
}

export async function generateMetadata({ params }: PageProps<"/conditions/[slug]">): Promise<Metadata> {
  const condition = await getCondition((await params).slug);

  return condition ? toMetadata(condition.seo) : { title: "Not found" };
}

export default async function ConditionPage({ params }: PageProps<"/conditions/[slug]">) {
  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  const [condition, all, settings] = await Promise.all([getCondition(slug), getConditions(), getSiteSettings()]);

  if (!condition) {
    notFound();
  }

  return (
    <>
      <ConditionDetail condition={condition} others={all.filter((item) => item.slug !== slug)} settings={settings} />
      <JsonLd graph={condition.seo.json_ld} />
    </>
  );
}
