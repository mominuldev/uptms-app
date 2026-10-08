import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/content/Headline";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, LinkCardsData } from "../types";
import { Rail, sectionHeading } from "./parts";

/** Quiz 02 "Keep exploring" (Figma 34:514): numbered cards pointing elsewhere; the middle one is sky. */
export function LinkCards({ data, number, anchor, ctx }: BlockProps<LinkCardsData>) {
  const headingId = anchor && data.headline ? `${anchor}-title` : undefined;

  return (
    <Container as="section" id={anchor ?? undefined} aria-labelledby={headingId} className="scroll-mt-28 py-12 md:py-16 lg:py-24">
      <div className="flex flex-col gap-8 md:gap-12">
        {(number || data.headline) && (
          <div className="flex flex-col gap-5">
            <Rail number={number} label={data.rail} />
            {data.headline && <Headline id={headingId} text={data.headline} className={sectionHeading} />}
          </div>
        )}
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card, index) => {
            const link = resolveLink(card.link, ctx.settings);

            return (
              <li key={card.title} className={`flex flex-col items-start gap-4 rounded-sheet p-7 md:p-9 ${index % 2 === 1 ? "bg-sky-soft" : "bg-paper"}`}>
                <span className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-[28px] leading-[1.15] tracking-[-0.015em] md:text-[32px]">{card.title}</h3>
                <p className="text-body-m text-ink-soft">{card.body}</p>
                {link && (
                  <Button href={link.href} variant="soft" className="mt-auto">
                    {link.label}
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Container>
  );
}
