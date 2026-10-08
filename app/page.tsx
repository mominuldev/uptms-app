import { Suspense } from "react";
import { ApiStatus, ApiStatusPending } from "@/components/system/ApiStatus";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FaqItem } from "@/components/ui/FaqItem";
import { Panel } from "@/components/ui/Panel";
import { SectionRail } from "@/components/ui/SectionRail";
import { getSiteMenus, getSiteSettings } from "@/lib/site";

/**
 * Phase 1 shell review page: the shared Panel / SectionRail / Button /
 * FaqItem components with Figma copy, so the header, menu, footer and mobile
 * CTA bar can be checked at 1440 / 768 / 390. Phase 2 replaces the body with
 * the full Home built from API content.
 */
export default function Home() {
  const settings = getSiteSettings();
  const { cta } = getSiteMenus();

  return (
    <>
      <div className="pt-3 md:pt-4 lg:pt-6">
        <Panel tone="navy" aria-labelledby="hero-title">
          <div className="flex max-w-[624px] flex-col gap-6 lg:gap-7">
            <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">
              Deep TMS therapy in University Place, WA
            </p>
            <h1
              id="hero-title"
              className="font-serif text-[42px] leading-[1.06] tracking-[-0.02em] md:text-display-l lg:text-display-xl"
            >
              When depression won’t lift, <em className="text-sky">explore a new way forward.</em>
            </h1>
            <p className="text-body-l">Medication hasn’t helped enough? You deserve a conversation about what comes next.</p>
            <p className="text-body-m text-white/80">
              Explore TMS therapy for depression with the team at University Place TMS Clinic, serving Greater Tacoma.
              We also offer a dedicated Deep TMS treatment pathway for OCD.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={cta.selfCheck.href} variant="light">
                Take the Free TMS Self-Check
              </Button>
              <Button href={settings.phone.href} variant="outlineLight">
                Call {settings.phone.display}
              </Button>
            </div>
            <p className="text-caption text-white/72">
              A short self-check, not a diagnosis. Prefer a conversation? Your initial phone consultation is free.
            </p>
          </div>
        </Panel>
      </div>

      <Container as="section" aria-labelledby="why-title" className="py-10 md:py-16 lg:pt-[72px] lg:pb-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <SectionRail number="01" label="You don’t have to figure this out alone" />
            <h2 id="why-title" className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l">
              Still searching for relief? <em className="text-royal">Let’s talk about your options.</em>
            </h2>
            <p className="text-body-l text-ink-soft">
              Living with persistent depression can make everyday things feel harder. If your current treatment is not
              enough, asking about another option is a reasonable next step.
            </p>
            <Button href="/contact" variant="soft">
              Talk with our team for free <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className="flex flex-col gap-5 rounded-sheet bg-sky-soft p-6 md:p-10 lg:w-[520px] lg:shrink-0">
            <h3 className="font-serif text-heading-s">Does any of this sound familiar?</h3>
            <ul className="flex flex-col gap-5 text-body-m">
              {[
                "Antidepressants have not provided enough relief.",
                "Medication side effects are affecting your daily life.",
                "Depression continues despite treatment.",
                "You are helping a loved one explore what comes next.",
              ].map((text) => (
                <li key={text} className="flex gap-3.5">
                  <span aria-hidden="true" className="mt-[9px] size-2.5 shrink-0 rounded-full bg-royal" />
                  <span className="min-w-0">{text}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-[20px] bg-white px-5 py-[18px] text-body-s">
              You don’t need to know whether TMS is right for you before you call. That is a conversation we can start
              together.
            </p>
          </div>
        </div>
      </Container>

      <Panel tone="sky" aria-labelledby="band-title" innerClassName="text-center">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-5">
          <h2 id="band-title" className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l">
            Questions first. <em className="text-royal">Decisions together.</em>
          </h2>
          <p className="text-body-l text-ink-soft">
            Your initial phone consultation is free. Tell us what you have tried, and we will explain the next step.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button href={settings.phone.href}>Call {settings.phone.display}</Button>
            <Button href={cta.selfCheck.href} variant="secondary">
              Take the self-check
            </Button>
          </div>
        </div>
      </Panel>

      <Container as="section" aria-labelledby="faq-title" className="py-14 md:py-[72px] lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-24">
          <div className="flex flex-col items-start gap-[22px] lg:w-[440px] lg:shrink-0">
            <SectionRail number="09" label="Good questions deserve clear answers" />
            <h2 id="faq-title" className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l">
              Before you book.
            </h2>
            <p className="text-body-l text-ink-soft">
              There is no need to arrive with every answer. We’re here to help you understand the next step.
            </p>
            <Button href={settings.phone.href}>Ask Us · {settings.phone.display}</Button>
            <div className="flex w-full flex-col gap-1.5 rounded-card bg-sky-soft p-6">
              <p className="text-base leading-[1.35] font-bold">Prefer to start privately?</p>
              <p className="text-body-s text-ink-soft">The free TMS self-check takes a minute. Nothing is sent or saved.</p>
              <a
                href={cta.selfCheck.href}
                className="self-start rounded-sm font-display text-[15px] leading-[1.3] font-bold text-royal hover:text-royal-deep"
              >
                Start the self-check <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="min-w-0 flex-1 border-t border-line">
            <FaqItem question="What is TMS therapy?" defaultOpen>
              TMS uses magnetic pulses to stimulate targeted brain areas. It is an outpatient treatment that may be
              considered for depression when other treatments have not helped enough.
            </FaqItem>
            <FaqItem question="How do I know if TMS is right for me?">
              A provider reviews your symptoms, past treatment, medical history, and safety considerations. Our free
              online self-assessment helps you prepare questions; it cannot diagnose a condition or determine
              eligibility.
            </FaqItem>
            <FaqItem question="Is the phone consultation free?">
              Yes. The clinic offers a free initial phone consultation. Ask the team about charges for clinical
              evaluations and treatment, which are separate from that introductory call.
            </FaqItem>
            <FaqItem question="Will my insurance cover TMS?">
              Coverage depends on your exact plan, diagnosis, treatment history, network status, and authorization
              requirements. Contact the clinic with the name of your plan to discuss what needs to be verified.
            </FaqItem>
          </div>
        </div>
      </Container>

      <Container className="pb-6">
        <Suspense fallback={<ApiStatusPending />}>
          <ApiStatus />
        </Suspense>
      </Container>
    </>
  );
}
