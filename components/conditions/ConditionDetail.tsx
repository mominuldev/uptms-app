import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FaqItem } from "@/components/ui/FaqItem";
import { Panel } from "@/components/ui/Panel";
import { SectionRail } from "@/components/ui/SectionRail";
import { Markdown } from "@/components/content/Markdown";
import { Picture } from "@/components/content/Picture";
import type { Condition, ConditionDetail as Detail } from "@/lib/content";
import type { SiteSettings } from "@/lib/site";
import { resolveLink } from "@/lib/tokens";
import { ArrowLabel } from "@/components/ui/ArrowLabel";

const reviewed = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * /conditions/{slug}: no Figma frame exists, so it is composed from the
 * design's own parts — navy hero panel, image with rounded corners, long
 * form copy, FAQ accordion, sibling cards and the royal closing band.
 */
export function ConditionDetail({ condition, others, settings }: { condition: Detail; others: Condition[]; settings: SiteSettings }) {
  const cta = resolveLink(condition.cta, settings) ?? {
    label: "Request a Free Phone Consultation",
    href: "/contact",
  };
  const ctaLabel = cta.label.replace(/\s*→\s*$/, "");
  let section = 0;
  const next = () => String(++section).padStart(2, "0");

  return (
    <div className="flex flex-col pb-6">
      <div className="pt-3 md:pt-4 lg:pt-6">
        <Panel tone="navy" aria-labelledby="condition-title">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex min-w-0 flex-col gap-6 lg:flex-1">
              <nav aria-label="Breadcrumb" className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">
                <Link href="/tms#areas" className="rounded-sm hover:text-white">
                  Conditions
                </Link>
                <span aria-hidden="true"> · </span>
                <span aria-current="page">{condition.eyebrow}</span>
              </nav>
              <h1 id="condition-title" className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-display-l">
                {condition.detail_title}
              </h1>
              {condition.detail_title !== condition.title && <p className="font-serif text-[22px] leading-[1.3] text-sky italic md:text-[26px]">{condition.title}</p>}
              <p className="max-w-[560px] text-body-l text-white/86">{condition.summary}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={cta.href} variant="light">
                  {ctaLabel}
                </Button>
                <Button href={settings.phone.href} variant="outlineLight">
                  Call {settings.phone.display}
                </Button>
              </div>
            </div>
            {condition.image && (
              <div className="aspect-[4/3] w-full overflow-hidden rounded-sheet bg-sky lg:w-[520px] lg:shrink-0">
                <Picture image={condition.image} sizes="(min-width: 1024px) 520px, 92vw" priority className="block size-full" />
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Container as="section" aria-labelledby="condition-about" className="py-14 md:py-20 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <div className="flex flex-col gap-5 lg:w-[360px] lg:shrink-0">
            <SectionRail number={next()} label="What to know" />
            <h2 id="condition-about" className="font-serif text-heading-m">
              Understanding {condition.eyebrow.toLowerCase()}.
            </h2>
            {condition.reviewed_at && (
              <p className="flex items-center gap-2.5 text-body-s text-ink-soft">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-royal" />
                Clinically reviewed {reviewed(condition.reviewed_at)}
              </p>
            )}
          </div>
          <div className="flex min-w-0 max-w-[760px] flex-col gap-6">
            <Markdown text={condition.detail_body ?? condition.summary} className="flex flex-col gap-5 text-body-l text-ink-soft" />
            {condition.source && (
              <a href={condition.source.href} rel="noopener" className="self-start text-body-s text-royal underline-offset-4 hover:underline">
                <ArrowLabel>{`Clinic source: ${condition.source.label} →`}</ArrowLabel>
              </a>
            )}
            <p className="rounded-card bg-sky-soft px-6 py-5 text-body-s text-ink">
              This page explains care options; it is not a diagnosis. A provider reviews your history and safety considerations before recommending treatment.
            </p>
          </div>
        </div>
      </Container>

      {condition.faqs.length > 0 && (
        <div className="px-4">
          <section aria-labelledby="condition-faq" className="w-full rounded-panel bg-paper py-12 md:py-16 lg:py-[88px]">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
                <div className="flex flex-col gap-5 lg:w-[360px] lg:shrink-0">
                  <SectionRail number={next()} label="Your questions" />
                  <h2 id="condition-faq" className="font-serif text-heading-m">
                    Questions about {condition.eyebrow.toLowerCase()} care.
                  </h2>
                </div>
                <div className="min-w-0 flex-1 rounded-card bg-white px-6 md:px-8">
                  {condition.faqs.map((faq, index) => (
                    <FaqItem key={faq.id} question={faq.question} defaultOpen={index === 0}>
                      <Markdown text={faq.answer} className="flex flex-col gap-3" />
                    </FaqItem>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        </div>
      )}

      {others.length > 0 && (
        <Container as="section" aria-labelledby="condition-others" className="py-14 md:py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <SectionRail number={next()} label="Other conditions we treat" />
              <h2 id="condition-others" className="font-serif text-heading-m">
                Explore related care.
              </h2>
            </div>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.id}>
                  <Link href={other.path} className="group flex h-full flex-col gap-3 rounded-sheet border border-line bg-white p-7 transition-colors hover:border-royal">
                    <span className="font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">
                      {other.number} / {other.eyebrow}
                    </span>
                    <span className="font-serif text-heading-s">{other.title}</span>
                    <span className="text-body-s text-ink-soft">{other.summary}</span>
                    <span className="mt-auto pt-2 font-display text-[15px] font-bold text-royal group-hover:underline"><ArrowLabel>Learn more →</ArrowLabel></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      )}

      <Panel tone="navy" aria-labelledby="condition-next" innerClassName="!bg-royal text-center">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5">
          <p className="font-display text-[17px] font-bold text-sky">Questions first. Decisions together.</p>
          <h2 id="condition-next" className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l">
            Talk it through with our <em className="text-sky">care team.</em>
          </h2>
          <p className="text-body-l text-white/86">Your initial phone consultation is free. Tell us what you have tried, and we will explain the next step.</p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button href="/contact" variant="light">
              Request a Free Phone Consultation
            </Button>
            <Button href="/quiz" variant="outlineLight">
              Take the self-check
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
