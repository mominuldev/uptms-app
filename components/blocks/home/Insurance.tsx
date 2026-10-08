import { Picture } from "@/components/content/Picture";
import type { BlockProps, InsuranceData, InsuranceSources } from "../types";
import { CtaButton, PlainSection, SectionHead, TextLink } from "./parts";

/**
 * 05 · Insurance (Figma 28:171): numbered questions on a navy panel, the
 * partner logo wall, the coverage disclaimer and a closing row.
 */
export function InsuranceBlock({ data, sources, number, anchor, ctx }: BlockProps<InsuranceData, InsuranceSources>) {
  const tokens = ctx.settings;
  const partners = sources.partners ?? [];
  const questions = data.questions.filter((question) => question.trim() !== "");
  const disclaimer = data.disclaimer || ctx.api.legal.insurance;
  const headingId = `${anchor ?? "insurance"}-title`;

  return (
    <PlainSection id={anchor} labelledBy={headingId} block="insurance" className="flex flex-col gap-10 xl:gap-12 xl:pt-24">
      <SectionHead number={number} rail={data.rail} headline={data.headline} intro={data.intro} headingId={headingId} />

      {data.questions_title || questions.length > 0 ? (
        <div className="flex flex-col gap-6 rounded-sheet bg-navy p-5 text-white md:p-8 xl:p-10">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            {data.questions_title ? <h3 className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-heading-m">{data.questions_title}</h3> : null}
            <CtaButton link={data.questions_cta} tokens={tokens} variant="light" className="shrink-0" />
          </div>
          {questions.length > 0 ? (
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {questions.map((question, index) => (
                <li key={question} className="flex flex-col items-start gap-4 rounded-[20px] bg-white px-[22px] pt-[22px] pb-6 text-ink">
                  <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-sky-soft font-display text-base font-bold text-royal">
                    {index + 1}
                  </span>
                  <span className="font-serif text-[21px] leading-[1.22] tracking-[-0.01em]">{question}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}

      {partners.length > 0 ? (
        <div className="flex flex-col gap-6 pt-4 xl:gap-12">
          {data.logos_title || data.logos_note ? (
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
              {data.logos_title ? <h3 className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-heading-m">{data.logos_title}</h3> : null}
              {data.logos_note ? <p className="text-body-s text-ink-soft">{data.logos_note}</p> : null}
            </div>
          ) : null}
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
            {partners.map((partner) => {
              const tile = (
                <>
                  {partner.logo ? (
                    <Picture image={{ ...partner.logo, alt: partner.logo.alt || partner.name }} sizes="150px" fit="contain" className="block h-12 w-[120px] md:h-16 md:w-[150px]" />
                  ) : (
                    <span className="px-3 text-center font-display text-[15px] font-bold text-ink">{partner.name}</span>
                  )}
                </>
              );

              return (
                <li key={partner.id} className="flex h-24 items-center justify-center overflow-hidden rounded-[20px] border border-line bg-white md:h-28">
                  {partner.url ? (
                    <a href={partner.url} rel="noopener" className="flex size-full items-center justify-center rounded-[20px]">
                      {tile}
                    </a>
                  ) : (
                    tile
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {disclaimer || data.disclaimer_link.label ? (
        <p className="max-w-[820px] text-caption text-ink-soft">
          {disclaimer}{" "}
          <TextLink link={data.disclaimer_link} tokens={tokens} className="font-sans text-caption font-normal text-ink-soft underline hover:text-royal" />
        </p>
      ) : null}

      {data.close_text || data.close_cta.label ? (
        <div className="flex flex-col items-start gap-5 border-t border-line pt-6 md:flex-row md:items-center">
          {data.close_text ? <p className="font-serif text-heading-s">{data.close_text}</p> : null}
          <CtaButton link={data.close_cta} tokens={tokens} variant="soft" className="shrink-0" />
        </div>
      ) : null}
    </PlainSection>
  );
}
