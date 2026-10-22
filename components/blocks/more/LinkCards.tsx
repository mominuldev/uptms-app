import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/content/Headline";
import { acceptsRequests } from "@/components/forms/formSource";
import { QualifyButton } from "@/components/forms/QualifyButton";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, LinkCardsData, LinkCardsSources } from "../types";
import { Rail, sectionHeading } from "./parts";

/**
 * Quiz 02 "Keep exploring" (Figma 34:514): numbered cards pointing elsewhere;
 * the middle one is sky. A card's button can open the qualification form in a
 * popup instead, like the Home hero's.
 */
export function LinkCards({ data, sources, number, anchor, ctx }: BlockProps<LinkCardsData, LinkCardsSources>) {
  const headingId = anchor && data.headline ? `${anchor}-title` : undefined;
  // Without the inbox every card falls back to its link.
  const form = acceptsRequests(sources.form) ? sources.form : null;

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
                {link &&
                  (card.opens_form && form ? (
                    <QualifyButton label={link.label} title={data.form_title ?? ""} form={form} insurers={sources.insurers ?? []} tokens={ctx.settings} variant="softOutline" className="mt-auto" />
                  ) : (
                    <Button href={link.href} variant="softOutline" className="mt-auto">
                      {link.label}
                    </Button>
                  ))}
              </li>
            );
          })}
        </ol>
      </div>
    </Container>
  );
}
