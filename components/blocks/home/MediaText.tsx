import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { Picture } from "@/components/content/Picture";
import type { BlockProps, MediaTextData } from "../types";
import { Actions, CtaButton, PlainSection, Rail, TextLink, h2Classes } from "./parts";

/**
 * Image & text (Figma 03 · TMS overview 28:94; TMS "Planning around real
 * life"): photo with a navy caption chip beside copy, fact tiles, small
 * print and buttons. A caption without an eyebrow sits under the photo.
 */
export function MediaTextBlock({ data, number, anchor, ctx }: BlockProps<MediaTextData>) {
  const tokens = ctx.settings;
  const headingId = `${anchor ?? "media"}-title`;
  const imageRight = data.image_side === "right";
  const chip = data.caption_eyebrow !== "";
  const facts = data.facts.filter((fact) => fact.value !== "" || fact.label !== "");

  return (
    <PlainSection id={anchor} labelledBy={headingId} block="media_text">
      <div className={`flex flex-col gap-10 lg:items-center lg:gap-14 xl:gap-20 ${imageRight ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        {data.image ? (
          <figure className={`relative flex flex-col gap-3 lg:w-[460px] lg:shrink-0 xl:w-[580px] ${chip ? "pb-10" : ""}`}>
            <Picture
              image={data.image}
              sizes="(min-width: 1280px) 580px, (min-width: 1024px) 460px, 100vw"
              className="block aspect-[580/480] w-full overflow-hidden rounded-[28px]"
            />
            {chip ? (
              <figcaption className="absolute right-4 bottom-0 left-4 flex flex-col gap-1 rounded-[20px] bg-navy px-[22px] py-[18px] text-white sm:left-auto sm:w-[340px] lg:right-5">
                <span className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">{data.caption_eyebrow}</span>
                {data.caption ? <span className="text-body-s">{data.caption}</span> : null}
              </figcaption>
            ) : data.caption ? (
              <figcaption className="text-caption text-ink-soft">{data.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-[22px]">
          <Rail number={number} label={data.rail} />
          <Headline id={headingId} text={data.headline} className={h2Classes} />
          <Markdown text={data.body} className="flex flex-col gap-4 text-body-m text-ink-soft" />
          {facts.length > 0 ? (
            <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <li key={fact.value + fact.label} className="flex flex-col gap-1 rounded-[20px] bg-sky-soft px-[22px] py-5">
                  <span className="font-serif text-heading-s text-royal">{fact.value}</span>
                  <span className="text-body-s text-ink-soft">{fact.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {data.disclaimer ? <p className="text-caption text-ink-soft">{data.disclaimer}</p> : null}
          <Actions className="w-full sm:w-auto">
            {[<CtaButton key="p" link={data.primary} tokens={tokens} className="w-full sm:w-auto" />, <TextLink key="l" link={data.link} tokens={tokens} />]}
          </Actions>
        </div>
      </div>
    </PlainSection>
  );
}
