import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { acceptsRequests } from "@/components/forms/formSource";
import { QualifyButton } from "@/components/forms/QualifyButton";
import type { BlockProps, CopyPanelData, CopyPanelSources } from "../types";
import { CtaButton, DotList, PlainSection, Rail, h2Classes } from "./parts";

/**
 * Copy beside a soft checklist panel (Figma 01 · Why TMS 27:94; also TMS
 * "The basics"). The button is the Soft pill, and like the Home hero's it can
 * open the qualification form in a popup instead of following its link.
 */
export function CopyPanelBlock({ data, sources, number, anchor, ctx }: BlockProps<CopyPanelData, CopyPanelSources>) {
  const headingId = `${anchor ?? "copy"}-title`;
  const hasPanel = data.panel_title !== "" || data.panel_items.length > 0 || data.panel_note !== "";
  // Without the inbox (or without a label) the button falls back to its link.
  const form = data.cta_opens_form && data.cta.label !== "" && acceptsRequests(sources.form) ? sources.form : null;

  return (
    <PlainSection id={anchor} labelledBy={headingId} block="copy_panel" className="xl:pt-[72px]">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
          <Rail number={number} label={data.rail} />
          <Headline id={headingId} text={data.headline} className={h2Classes} />
          {data.subheading ? <p className="text-body-l text-ink-soft">{data.subheading}</p> : null}
          <Markdown text={data.body} className="flex flex-col gap-4 text-body-m text-ink-soft" />
          {form ? (
            <QualifyButton
              label={data.cta.label}
              title={data.form_title ?? ""}
              form={form}
              insurers={sources.insurers ?? []}
              tokens={ctx.settings}
              variant="soft"
            />
          ) : (
            <CtaButton link={data.cta} tokens={ctx.settings} variant="soft" />
          )}
        </div>
        {hasPanel ? (
          <div className="flex flex-col gap-5 rounded-sheet bg-sky-soft p-6 md:p-10 lg:w-[440px] lg:shrink-0 xl:w-[520px]">
            {data.panel_title ? <h3 className="font-serif text-heading-s">{data.panel_title}</h3> : null}
            <DotList items={data.panel_items} />
            {data.panel_note ? <p className="rounded-[20px] bg-white px-5 py-[18px] text-body-s">{data.panel_note}</p> : null}
          </div>
        ) : null}
      </div>
    </PlainSection>
  );
}
