import Link from "next/link";
import { Headline } from "@/components/content/Headline";
import { Picture } from "@/components/content/Picture";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { SectionRail } from "@/components/ui/SectionRail";
import type { PostArticle } from "@/lib/content";
import type { SiteSettings } from "@/lib/site";
import { PostCard, publishedLabel } from "./PostCard";
import { RichText } from "./RichText";

const day = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** /resources/{slug}: navy hero with byline and clinical review, readable body, related guides. */
export function Article({ post, settings }: { post: PostArticle; settings: SiteSettings }) {
  const person = (p: { name: string; credentials: string | null }) => (p.credentials ? `${p.name}, ${p.credentials}` : p.name);

  return (
    <article className="flex flex-col pb-6">
      {post.preview && (
        <p role="status" className="sticky top-0 z-40 bg-royal px-5 py-2 text-center font-display text-[15px] font-bold text-white">
          Preview of unpublished changes · visitors still see the published guide
        </p>
      )}
      <div className="pt-3 md:pt-4 lg:pt-6">
        <Panel tone="navy" aria-labelledby="article-title">
          <div className="flex max-w-[860px] flex-col gap-6">
            <nav aria-label="Breadcrumb" className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">
              <Link href="/resources" className="rounded-sm hover:text-white">
                Resources
              </Link>
              {post.category && (
                <>
                  <span aria-hidden="true"> · </span>
                  <Link href={`/resources?category=${post.category.slug}`} className="rounded-sm hover:text-white">
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>
            <Headline as="h1" id="article-title" tone="dark" text={post.title} className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-display-l" />
            {post.dek && <p className="max-w-[680px] text-body-l text-white/86">{post.dek}</p>}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-body-s text-white/80">
              {post.author && <span>By {person(post.author)}</span>}
              {post.published_at && <span>{publishedLabel(post.published_at)}</span>}
              <span>{post.reading_minutes} min read</span>
            </div>
            {post.review?.by && (
              <p className="flex items-center gap-2.5 self-start rounded-full bg-white/10 px-4 py-2 text-body-s text-white">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sky" />
                Clinically reviewed by {person(post.review.by)} · {day(post.review.at)}
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Container className="flex flex-col items-center gap-10 py-12 md:py-16">
        {post.cover && (
          <div className="aspect-[16/9] w-full max-w-[1040px] overflow-hidden rounded-sheet bg-sky-soft">
            <Picture image={post.cover} sizes="(min-width: 1088px) 1040px, 94vw" priority className="block size-full" />
          </div>
        )}
        <RichText doc={post.body} className="flex w-full max-w-[720px] flex-col gap-5 text-[18px] leading-[1.75] text-ink-soft" />
        <div className="flex w-full max-w-[720px] flex-col gap-5 border-t border-line pt-8">
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-paper px-4 py-1.5 text-body-s text-ink">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <p className="rounded-card bg-sky-soft px-6 py-5 text-body-s text-ink">
            This guide is educational and is not medical advice. A provider reviews your history and safety considerations before recommending treatment. If you are in crisis, call or text 988.
          </p>
        </div>
      </Container>

      {post.related.length > 0 && (
        <Container as="section" aria-labelledby="related-title" className="flex flex-col gap-8 pb-16 md:pb-20">
          <div className="flex flex-col gap-5">
            <SectionRail number="02" label="Keep reading" />
            <h2 id="related-title" className="font-serif text-heading-m">
              More guides for you.
            </h2>
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {post.related.map((related) => (
              <li key={related.slug}>
                <PostCard post={related} />
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Panel tone="sky" aria-labelledby="article-cta">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[620px] flex-col gap-3">
            <Headline id="article-cta" text="Questions about *your situation?*" className="font-serif text-[32px] leading-[1.1] tracking-[-0.02em] md:text-heading-m" />
            <p className="text-body-l text-ink-soft">Your initial phone consultation is free. The team can explain what an evaluation involves.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Request a Phone Consultation</Button>
            <Button href={settings.phone.href} variant="secondary">
              Call {settings.phone.display}
            </Button>
          </div>
        </div>
      </Panel>
    </article>
  );
}
