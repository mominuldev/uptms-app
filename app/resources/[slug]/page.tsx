import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/posts/Article";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPost, getPosts } from "@/lib/cms";
import { toMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site";

/** Every published guide is prerendered; one published later renders on its first visit and is cached. */
export async function generateStaticParams() {
  const first = await getPosts();
  const pages = await Promise.all(Array.from({ length: Math.max(0, first.last_page - 1) }, (_, i) => getPosts(null, i + 2)));
  const slugs = [first, ...pages].flatMap((page) => page.posts.map((post) => ({ slug: post.slug })));

  // Cache Components needs at least one entry to validate the route at build time.
  return slugs.length > 0 ? slugs : [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);

  return post ? toMetadata(post.seo) : { title: "Not found" };
}

export default async function PostPage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Article post={post} settings={settings} />
      <JsonLd graph={post.seo.json_ld} />
    </>
  );
}
