import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/content/Headline";
import { Picture } from "@/components/content/Picture";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, FounderSources, SplitCardsData } from "../types";
import { Rail, TextLink } from "./parts";

/** TMS 04 "Insurance & local team" (Figma 32:352): coverage card beside the local provider card. */
export function SplitCards({ data, sources, number, anchor, ctx }: BlockProps<SplitCardsData, FounderSources>) {
  const primary = resolveLink(data.primary, ctx.settings);
  const teamLink = resolveLink(data.team_link, ctx.settings);
  const founder = sources.founder?.[0];
  const { address } = ctx.api.clinic;
  const headingId = anchor ? `${anchor}-title` : undefined;

  return (
    <Container as="section" id={anchor ?? undefined} aria-labelledby={headingId} className="scroll-mt-28 py-10 md:py-16 lg:py-[72px]">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6 rounded-sheet bg-sky-soft p-7 md:p-11">
          <Rail number={number} label={data.rail} />
          {data.headline && <Headline id={headingId} text={data.headline} className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-heading-m" />}
          {data.body && <p className="text-body-m text-ink-soft">{data.body}</p>}
          {primary && (
            <Button href={primary.href} className="w-full sm:w-auto">
              {primary.label}
            </Button>
          )}
        </div>
        <div className="flex flex-col items-start gap-6 rounded-sheet bg-paper p-7 md:p-11">
          {data.team_eyebrow && <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">{data.team_eyebrow}</p>}
          {founder && (
            <div className="flex items-center gap-5">
              <div className="size-20 shrink-0 overflow-hidden rounded-full bg-sky md:size-24">
                <Picture image={founder.photo} sizes="96px" className="block size-full" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-serif text-[22px] leading-[1.2] md:text-[24px]">
                  {founder.name}
                  {founder.credentials ? `, ${founder.credentials}` : ""}
                </p>
                <p className="text-body-s text-ink-soft">{founder.role_title}</p>
              </div>
            </div>
          )}
          <address className="text-body-m text-ink-soft not-italic">
            {address.street}
            <br />
            {address.locality}, {address.region} {address.postal_code}
          </address>
          {teamLink && <TextLink link={teamLink} />}
        </div>
      </div>
    </Container>
  );
}
