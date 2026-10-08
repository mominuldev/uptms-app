import { Headline } from "@/components/content/Headline";
import { Inline } from "@/components/content/Markdown";
import { FaqItem } from "@/components/ui/FaqItem";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, FaqData, FaqSources } from "../types";
import { CtaButton, PlainSection, Rail, TextLink, h2Classes } from "./parts";

/**
 * 09 · FAQ (Figma 30:204): intro column with a button and the private
 * self-check card, beside the accordion (first answer open) and a footnote
 * of sources.
 */
export function FaqBlock({ data, sources, number, anchor, ctx }: BlockProps<FaqData, FaqSources>) {
  const tokens = ctx.settings;
  const faqs = sources.faqs ?? [];
  const headingId = `${anchor ?? "faq"}-title`;
  const footnoteLinks = data.footnote_links.map((link) => resolveLink(link, tokens)).filter((link) => link !== null);
  // "Background:" introduces the links; any other footnote follows them ("Learn more: … . Note").
  const lead = data.footnote.trim().endsWith(":");
  const hasAside = data.aside_title !== "" || data.aside_body !== "";

  return (
    <PlainSection id={anchor} labelledBy={headingId} block="faq">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16 xl:gap-24">
        <div className="flex flex-col items-start gap-[22px] lg:sticky lg:top-6 lg:w-[380px] lg:shrink-0 xl:w-[440px]">
          <Rail number={number} label={data.rail} />
          <Headline id={headingId} text={data.headline} className={h2Classes} />
          {data.intro ? <p className="text-body-l text-ink-soft">{data.intro}</p> : null}
          <CtaButton link={data.primary} tokens={tokens} className="w-full sm:w-auto" />
          {hasAside ? (
            <div className="flex w-full flex-col items-start gap-1.5 rounded-card bg-sky-soft p-6">
              {data.aside_title ? <p className="text-base leading-[1.35] font-bold text-ink">{data.aside_title}</p> : null}
              {data.aside_body ? <p className="text-body-s text-ink-soft">{data.aside_body}</p> : null}
              <TextLink link={data.aside_link} tokens={tokens} className="text-[15px] text-royal" />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          {faqs.length > 0 ? (
            <div className="border-t border-line">
              {faqs.map((faq, index) => (
                <FaqItem key={faq.id} question={faq.question} defaultOpen={index === 0}>
                  <Inline text={faq.answer} />
                </FaqItem>
              ))}
            </div>
          ) : null}
          {data.footnote || footnoteLinks.length > 0 ? (
            <p className="pt-5 text-caption text-ink-soft">
              {footnoteLinks.length > 0 ? (
                <>
                  {lead ? `${data.footnote} ` : "Learn more: "}
                  {footnoteLinks.map((link, index) => (
                    <span key={link.href}>
                      {index > 0 ? " · " : null}
                      <a href={link.href} rel="noopener" className="underline-offset-4 hover:text-royal hover:underline">
                        {link.label}
                      </a>
                    </span>
                  ))}
                  {lead || data.footnote === "" ? "." : `. ${data.footnote}`}
                </>
              ) : (
                data.footnote
              )}
            </p>
          ) : null}
        </div>
      </div>
    </PlainSection>
  );
}
