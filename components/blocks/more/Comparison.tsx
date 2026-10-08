import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, ComparisonData } from "../types";
import { DotList, Rail, Surface, TextLink, sectionHeading } from "./parts";

/** TMS 05 "Treatment differences" (Figma 32:373): depression vs OCD cards and a navy callout. */
export function Comparison({ data, number, anchor, ctx }: BlockProps<ComparisonData>) {
  const primary = resolveLink(data.primary, ctx.settings);
  const link = resolveLink(data.link, ctx.settings);
  const headingId = anchor ? `${anchor}-title` : "comparison-title";

  return (
    <Surface id={anchor ?? undefined} labelledBy={headingId} innerClassName="bg-sky-soft">
      <div className="flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <div className="flex max-w-[620px] flex-col gap-5">
            <Rail number={number} label={data.rail} />
            {data.headline && <Headline id={headingId} text={data.headline} className={sectionHeading} />}
          </div>
          {data.intro && <p className="text-body-l text-ink-soft lg:max-w-[460px] lg:pb-2">{data.intro}</p>}
        </div>
        {data.columns.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {data.columns.map((column) => (
              <article key={column.title} className="flex flex-col gap-5 rounded-sheet bg-white p-7 md:p-10">
                <h3 className="font-serif text-heading-s">{column.title}</h3>
                <p className="text-[16px] leading-[1.7] text-ink-soft">{column.body}</p>
                <DotList items={column.items} itemClassName="text-body-m text-ink" />
              </article>
            ))}
          </div>
        )}
        {data.callout && (
          <div className="rounded-card bg-navy px-6 py-6 text-white md:px-7 md:py-7">
            <Markdown text={data.callout} className="flex flex-col gap-3 text-body-m" linkClassName="font-bold text-sky underline underline-offset-4" />
          </div>
        )}
        {(primary || link) && (
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            {primary && (
              <Button href={primary.href} className="w-full sm:w-auto">
                {primary.label}
              </Button>
            )}
            {link && <TextLink link={link} />}
          </div>
        )}
      </div>
    </Surface>
  );
}
