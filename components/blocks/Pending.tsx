import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/content/Headline";

/** Stand-in while a block type has no component yet: its headline, so the page still reads. */
export function PendingBlock({ type, data }: { type: string; data: Record<string, unknown> }) {
  const headline = typeof data.headline === "string" ? data.headline : null;

  return (
    <Container as="section" className="py-10" data-block={type}>
      {headline ? <Headline text={headline} className="font-serif text-heading-m" /> : null}
    </Container>
  );
}
