import Link from "next/link";
import { Picture } from "@/components/content/Picture";
import type { BlockProps, ConditionCardsData, ConditionsSources } from "../types";
import { CtaButton, SectionHead } from "./parts";
import { joinedBottom, joinedSurface } from "./joined";
import { ArrowLabel } from "@/components/ui/ArrowLabel";

/**
 * 02 · Specialties (Figma 26:155): head, one card per published condition
 * ("01 / Depression"), then the navy "Unsure where to begin?" band.
 */
export function ConditionCardsBlock({ data, sources, number, anchor, ctx }: BlockProps<ConditionCardsData, ConditionsSources>) {
  const conditions = sources.conditions ?? [];
  const headingId = `${anchor ?? "conditions"}-title`;
  const hasClose = data.close_title !== "" || data.close_body !== "";

  return (
    <section id={anchor ?? undefined} aria-labelledby={headingId} data-block="condition_cards" data-join="cards" className={`${joinedSurface} ${joinedBottom} pt-12 md:pt-16 lg:pt-20 xl:pt-24`}>
      <div className="flex flex-col gap-10 xl:gap-14">
        <SectionHead number={number} rail={data.rail} headline={data.headline} intro={data.intro} headingId={headingId} />

        {conditions.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {conditions.map((condition) => (
              <li key={condition.id} className="group relative flex flex-col gap-4 rounded-card bg-white p-3 pb-6">
                <Picture
                  image={condition.image}
                  sizes="(min-width: 1280px) 290px, (min-width: 640px) 45vw, 100vw"
                  className="block h-[180px] w-full overflow-hidden rounded-2xl"
                  imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col items-start gap-2.5 px-3 pt-1">
                  <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">
                    {condition.number} / {condition.eyebrow}
                  </p>
                  <h3 className="font-serif text-[24px] leading-[1.22] tracking-[-0.01em] text-ink">{condition.title}</h3>
                  <p className="text-body-s text-ink-soft">{condition.summary}</p>
                  <Link
                    href={condition.path}
                    className="mt-auto rounded-sm pt-1 font-display text-[15px] leading-[1.3] font-bold text-royal after:absolute after:inset-0 after:rounded-card after:content-[''] hover:underline"
                  >
                    <ArrowLabel>{condition.card_link_label || `Learn about ${condition.eyebrow.toLowerCase()} →`}</ArrowLabel>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {hasClose ? (
          <div className="flex flex-col items-start gap-5 rounded-card bg-navy px-6 py-6 text-white md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
            <div className="flex min-w-0 flex-col gap-1">
              {data.close_title ? <p className="font-serif text-heading-s">{data.close_title}</p> : null}
              {data.close_body ? <p className="text-body-s text-white/80">{data.close_body}</p> : null}
            </div>
            <CtaButton link={data.close_cta} tokens={ctx.settings} variant="light" className="w-full shrink-0 md:w-auto" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
