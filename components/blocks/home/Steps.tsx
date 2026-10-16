import { Headline } from "@/components/content/Headline";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, StepsData, StepsSources } from "../types";
import { Actions, CheckIcon, CtaButton, PlainSection, Rail, TextLink, h2Classes } from "./parts";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * Steps (Figma 07 · Journey 30:111; TMS 03 · Treatment journey): numbered
 * cards — the first royal, the last ends in a check — from Collections ·
 * Journey steps or written in the block, plus an optional navy benefits &
 * risks panel and buttons.
 */
export function StepsBlock({ data, sources, number, anchor, ctx }: BlockProps<StepsData, StepsSources>) {
  const tokens = ctx.settings;
  const headingId = `${anchor ?? "steps"}-title`;
  const journey = data.steps_source === "collection";
  const steps =
    data.steps_source === "collection"
      ? (sources.steps ?? []).map((step) => ({ title: step.title, body: step.body ?? "" }))
      : data.steps.filter((step) => step.title !== "");
  const panelLinks = data.panel_links.map((link) => resolveLink(link, tokens)).filter((link) => link !== null);
  const hasPanel = data.panel_title !== "" || data.panel_body !== "";
  const columns = steps.length === 3 ? "md:grid-cols-3" : steps.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2";

  return (
    <PlainSection id={anchor} labelledBy={headingId} block="steps" className="flex flex-col gap-10 xl:gap-14 xl:pt-24">
      <div className="flex flex-col items-start gap-5">
        <Rail number={number} label={data.rail} />
        <Headline id={headingId} text={data.headline} className={h2Classes} />
      </div>

      {steps.length > 0 ? (
        <ol className={`grid grid-cols-1 gap-4 xl:gap-5 ${columns}`}>
          {steps.map((step, index) => {
            // The Home journey (from the collection) leads with a royal card and arrows; TMS's written steps are plain.
            const first = journey && index === 0;
            const last = index === steps.length - 1;

            return (
              <li key={step.title} className={`flex flex-col gap-3.5 rounded-card px-7 pt-7 pb-8 ${first ? "bg-royal text-white" : "bg-paper text-ink"}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-serif text-[44px] leading-[1.08] tracking-[-0.02em] ${first ? "text-white" : "text-royal"}`}>{String(index + 1).padStart(2, "0")}</span>
                  {!journey ? null : last && steps.length > 1 ? (
                    <CheckIcon size={26} className="text-ink-soft" />
                  ) : (
                    <ArrowIcon className={first ? "text-sky" : "text-ink-soft"} />
                  )}
                </div>
                <h3 className="mt-6 font-serif text-heading-s md:mt-10">{step.title}</h3>
                {step.body ? <p className={`text-body-m ${first ? "text-white" : "text-ink-soft"}`}>{step.body}</p> : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      {hasPanel ? (
        <div className="flex flex-col gap-6 rounded-sheet bg-navy p-6 text-white md:p-10 lg:flex-row lg:gap-14 xl:px-10 xl:py-10">
          {data.panel_title ? <h3 className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-heading-m lg:w-[380px] lg:shrink-0">{data.panel_title}</h3> : null}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {data.panel_body ? <p className="text-body-m text-white/86">{data.panel_body}</p> : null}
            {data.panel_warning ? <p className="text-body-m font-bold">{data.panel_warning}</p> : null}
            {panelLinks.length > 0 ? (
              <ul className="flex flex-col gap-x-6 gap-y-2 pt-1 sm:flex-row sm:flex-wrap">
                {panelLinks.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <a href={link.href} rel="noopener" className="rounded-sm font-display text-[14px] leading-[1.3] font-bold text-sky underline-offset-4 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <Actions className="w-full sm:w-auto">
        {[<CtaButton key="p" link={data.primary} tokens={tokens} className="w-full sm:w-auto" />, <TextLink key="l" link={data.link} tokens={tokens} />]}
      </Actions>
    </PlainSection>
  );
}
