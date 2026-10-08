import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";

export const metadata: Metadata = { title: "TMS Therapy" };

/** Phase 1 stub so navigation and the active pill can be reviewed. */
export default function TmsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 pt-3 pb-16 md:pt-4 lg:pt-6 lg:pb-28">
      <Panel tone="navy" aria-labelledby="page-title">
        <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">Deep TMS therapy</p>
        <h1 id="page-title" className="mt-6 font-serif text-[42px] leading-[1.06] tracking-[-0.02em] md:text-display-l">
          TMS therapy for depression and OCD.
        </h1>
      </Panel>
      <Container>
        <p className="max-w-2xl text-body-l text-ink-soft">The full TMS page (Figma “UPTMS C · TMS”) arrives in Phase 2.</p>
      </Container>
    </div>
  );
}
