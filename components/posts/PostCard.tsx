import Link from "next/link";
import { Headline } from "@/components/content/Headline";
import { Picture } from "@/components/content/Picture";
import type { PostCard as Card } from "@/lib/content";

export function publishedLabel(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }) : "";
}

/** A guide on /resources: image, category, accent headline, introduction, reading time. */
export function PostCard({ post, priority = false }: { post: Card; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sheet border border-line bg-white transition-shadow hover:shadow-[0_24px_48px_rgba(14,48,78,0.10)]">
      <div className="aspect-[16/10] overflow-hidden bg-sky-soft">
        <Picture image={post.cover} sizes="(min-width: 1024px) 420px, (min-width: 768px) 46vw, 92vw" priority={priority} className="block size-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
        {post.category && <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">{post.category.name}</p>}
        <h3 className="font-serif text-[24px] leading-[1.2] tracking-[-0.01em] text-ink">
          <Link href={post.path} className="after:absolute after:inset-0 focus-visible:outline-none">
            <Headline as="span" text={post.title} />
          </Link>
        </h3>
        {post.dek && <p className="line-clamp-3 text-body-m text-ink-soft">{post.dek}</p>}
        <p className="mt-auto pt-2 text-body-s text-ink-soft">
          {publishedLabel(post.published_at)} · {post.reading_minutes} min read
        </p>
      </div>
    </article>
  );
}
