import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/content/Headline";
import { Markdown } from "@/components/content/Markdown";
import { fillTokens } from "@/lib/tokens";
import type { BlockProps, RichTextData } from "../types";
import { Rail, sectionHeading } from "./parts";

/** Long-form text for policies and simple pages: one readable column. `{phone}`, `{hours}` and `{email}` resolve from Clinic settings. */
export function RichText({ data, number, anchor, ctx }: BlockProps<RichTextData>) {
  const headingId = anchor ? `${anchor}-title` : undefined;
  const Heading = ctx.isFirst ? "h1" : "h2";

  return (
    <Container as="section" id={anchor ?? undefined} aria-labelledby={headingId} className="scroll-mt-28 py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex max-w-[760px] flex-col gap-6">
        <Rail number={number} label={data.rail} />
        {data.headline && <Headline as={Heading} id={headingId} text={data.headline} className={sectionHeading} />}
        <Markdown text={fillTokens(data.body, ctx.settings)} className="flex flex-col gap-6 text-body-m text-ink-soft [&_strong]:text-ink" />
      </div>
    </Container>
  );
}
