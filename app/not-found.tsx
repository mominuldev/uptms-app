import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** 404 in the site's voice. Phase 4 also logs the miss for the 404 monitor. */
export default function NotFound() {
  return (
    <Container as="section" className="flex flex-col items-start gap-6 py-20 md:py-28">
      <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">Page not found</p>
      <h1 className="max-w-[720px] font-serif text-[42px] leading-[1.06] tracking-[-0.02em] md:text-display-l">
        This page has moved, or it <em className="text-royal">never existed.</em>
      </h1>
      <p className="max-w-[560px] text-body-l text-ink-soft">Start from the home page, or take the free self-check to find your next step.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/">Go to the home page</Button>
        <Button href="/quiz" variant="secondary">
          Take the self-check
        </Button>
      </div>
    </Container>
  );
}
