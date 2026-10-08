import Link from "next/link";
import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { Picture } from "@/components/content/Picture";
import { resolveLink } from "@/lib/tokens";
import type { AreasOfCareData, BlockProps, ConditionsSources } from "../types";
import { Rail, Surface, TextLink, sectionHeading } from "./parts";

/** TMS 02 "Our areas of care" (Figma 32:279): a long-form card per published condition. */
export function AreasOfCare({ data, sources, number, anchor, ctx }: BlockProps<AreasOfCareData, ConditionsSources>) {
  const conditions = sources.conditions ?? [];
  const headingId = anchor ? `${anchor}-title` : "areas-of-care-title";

  return (
    <Surface id={anchor ?? undefined} labelledBy={headingId} innerClassName="bg-paper">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-5">
          <Rail number={number} label={data.rail} />
          {data.headline && <Headline id={headingId} text={data.headline} className={sectionHeading} />}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {conditions.map((condition) => {
            const cta = resolveLink(condition.cta, ctx.settings);

            return (
              <article id={condition.slug} key={condition.id} className="flex scroll-mt-28 flex-col gap-6 rounded-sheet bg-white p-3 pb-8">
                <div className="aspect-[562/300] w-full overflow-hidden rounded-[20px] bg-sky-soft">
                  <Picture image={condition.image} sizes="(min-width: 768px) 46vw, 92vw" className="block size-full" />
                </div>
                <div className="flex flex-1 flex-col gap-5 px-3 md:px-5">
                  <h3 className="font-serif text-[26px] leading-[1.2] tracking-[-0.01em] md:text-[32px]">{condition.detail_title}</h3>
                  <Markdown text={condition.detail_body} className="flex flex-col gap-4 text-body-s text-ink-soft" />
                  {condition.source && (
                    <a href={condition.source.href} rel="noopener" className="self-start text-caption text-royal underline-offset-4 hover:underline">
                      Clinic source: {condition.source.label} →
                    </a>
                  )}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                    {cta && <TextLink link={cta} />}
                    <Link href={condition.path} className="rounded-sm font-display text-[15px] font-bold text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                      Read more <span className="sr-only">about {condition.title}</span> →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Surface>
  );
}
