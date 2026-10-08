import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { Picture } from "@/components/content/Picture";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, ConditionFeatureData } from "../types";
import { Actions, CtaButton, Eyebrow, TextLink } from "./parts";
import { joinedBottom, joinedSurface, joinedTop } from "./joined";

/**
 * "A closer look" condition guide (Figma 26:200 / 26:218): photo with
 * caption beside the copy, a sky-soft question callout, buttons and source
 * links. `image_side` alternates the layout.
 */
export function ConditionFeatureBlock({ data, anchor, ctx }: BlockProps<ConditionFeatureData>) {
  const tokens = ctx.settings;
  const headingId = `${anchor ?? "guide"}-title`;
  const imageRight = data.image_side === "right";
  const sources = data.small_links.map((link) => resolveLink(link, tokens)).filter((link) => link !== null);

  // Stacked layouts keep the left-to-right order of the design.
  const figure = data.image ? (
          <figure className="flex flex-col gap-3 lg:w-[400px] lg:shrink-0 xl:w-[480px]">
            <Picture image={data.image} sizes="(min-width: 1280px) 480px, (min-width: 1024px) 400px, 100vw" className="block aspect-[8/7] w-full overflow-hidden rounded-[20px]" />
            {data.caption ? <figcaption className="text-caption text-ink-soft">{data.caption}</figcaption> : null}
          </figure>
        ) : null;

  return (
    <section id={anchor ?? undefined} aria-labelledby={headingId} data-block="condition_feature" data-join="guide" className={`${joinedSurface} ${joinedTop} ${joinedBottom}`}>
      <div
        className={`flex flex-col gap-8 rounded-sheet bg-white p-4 pb-7 md:p-6 md:pb-9 lg:items-center lg:gap-10 xl:gap-14 ${
          imageRight ? "lg:flex-row lg:py-6 lg:pr-6 lg:pl-10 xl:pl-12" : "lg:flex-row lg:py-6 lg:pr-10 lg:pl-6 xl:pr-12"
        }`}
      >
        {imageRight ? null : figure}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 px-1 md:px-2 lg:px-0">
          {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
          <Headline id={headingId} text={data.headline} className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] text-balance md:text-heading-m" />
          <Markdown text={data.body} className="flex flex-col gap-4 text-body-m text-ink-soft" />

          {data.question || data.answer ? (
            <div className="flex w-full flex-col gap-2 rounded-2xl bg-sky-soft px-5 py-[18px]">
              {data.question ? <p className="font-serif text-[20px] leading-[1.3] tracking-[-0.01em] text-ink italic">{data.question}</p> : null}
              {data.answer ? <p className="text-body-s text-ink-soft">{data.answer}</p> : null}
            </div>
          ) : null}

          <Actions className="w-full sm:w-auto">
            {[
              <CtaButton key="p" link={data.primary} tokens={tokens} className="w-full sm:w-auto" />,
              <TextLink key="l" link={data.link} tokens={tokens} />,
            ]}
          </Actions>

          {sources.length > 0 ? (
            <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-caption text-royal">
              {sources.map((link, index) => (
                <span key={link.href + index} className="inline-flex gap-1.5">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <a href={link.href} rel="noopener" className="rounded-sm underline-offset-4 hover:underline">
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          ) : null}
        </div>
        {imageRight ? figure : null}
      </div>
    </section>
  );
}
