import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";

export const metadata: Metadata = { title: "Contact" };

/** Phase 1 stub so navigation and the active pill can be reviewed. */
export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 pt-3 pb-16 md:pt-4 lg:pt-6 lg:pb-28">
      <Panel tone="navy" aria-labelledby="page-title">
        <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">Contact the clinic</p>
        <h1 id="page-title" className="mt-6 font-serif text-[42px] leading-[1.06] tracking-[-0.02em] md:text-display-l">
          Talk with our team.
        </h1>
      </Panel>
      <Container>
        <p className="max-w-2xl text-body-l text-ink-soft">The contact page and consultation form (Figma “UPTMS C · Contact”) arrive in Phases 2–3.</p>
      </Container>
    </div>
  );
}
