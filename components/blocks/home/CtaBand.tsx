import { Headline } from "@/components/content/Headline";
import type { BlockProps, CtaBandData } from "../types";
import { CtaButton, TextLink, TintPanel } from "./parts";

/**
 * Call-to-action bands. Sky (Figma 28:163, "Questions first"): centred,
 * royal button and navy text link. Royal (Final CTA 30:355): left-aligned,
 * Display XL headline, light buttons and an underlined white link.
 */
export function CtaBandBlock({ data, anchor, ctx }: BlockProps<CtaBandData>) {
  const tokens = ctx.settings;
  const headingId = `${anchor ?? `cta-${data.tone}`}-title`;

  if (data.tone === "royal") {
    return (
      <TintPanel tone="royal" id={anchor} labelledBy={headingId} block="cta_band" innerClassName="xl:pt-[104px]">
        <div className="flex flex-col items-start gap-6">
          {data.eyebrow ? <p className="text-body-m leading-[1.35] font-bold text-sky">{data.eyebrow}</p> : null}
          <Headline
            id={headingId}
            text={data.headline}
            tone="dark"
            className="max-w-[1000px] font-serif text-[42px] leading-[1.06] tracking-[-0.02em] text-balance md:text-display-l xl:text-display-xl"
          />
          {data.body ? <p className="max-w-[640px] text-body-l">{data.body}</p> : null}
          <div className="flex w-full flex-col gap-3 pt-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <CtaButton link={data.primary} tokens={tokens} variant="light" className="w-full sm:w-auto" />
            <CtaButton link={data.secondary} tokens={tokens} variant="outlineLight" className="w-full sm:w-auto" />
          </div>
          <TextLink link={data.link} tokens={tokens} className="text-base text-white underline hover:text-sky" />
        </div>
      </TintPanel>
    );
  }

  return (
    <TintPanel tone="sky" id={anchor} labelledBy={headingId} block="cta_band" innerClassName="xl:py-[88px]">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-[22px] text-center">
        {data.eyebrow ? <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">{data.eyebrow}</p> : null}
        <Headline id={headingId} text={data.headline} className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] text-balance text-navy md:text-display-l" />
        {data.body ? <p className="max-w-[620px] text-body-l text-navy">{data.body}</p> : null}
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <CtaButton link={data.primary} tokens={tokens} className="w-full sm:w-auto" />
          <CtaButton link={data.secondary} tokens={tokens} variant="secondary" className="w-full sm:w-auto" />
        </div>
        <TextLink link={data.link} tokens={tokens} className="text-base text-navy" />
      </div>
    </TintPanel>
  );
}
