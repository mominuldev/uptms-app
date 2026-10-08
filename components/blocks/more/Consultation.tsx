import { Headline } from "@/components/content/Headline";
import { Container } from "@/components/ui/Container";
import { fillTokens } from "@/lib/tokens";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import type { BlockProps, ConsultationData } from "../types";
import { DotList, Rail } from "./parts";

/** Contact 01 "Free initial phone consultation" (Figma 33:404): copy beside the request form. */
export function Consultation({ data, number, anchor, ctx }: BlockProps<ConsultationData>) {
  const headingId = anchor ? `${anchor}-title` : "consultation-title";
  const { email } = ctx.settings;

  return (
    <Container as="section" id={anchor ?? undefined} aria-labelledby={headingId} className="scroll-mt-28 py-12 md:py-16 lg:py-[112px]">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
        <div className="flex min-w-0 flex-col items-start gap-6 lg:max-w-[540px] lg:flex-1">
          <Rail number={number} label={data.rail} />
          {data.headline && (
            <Headline id={headingId} text={data.headline} className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l" />
          )}
          {data.subheading && <p className="text-body-l text-ink-soft">{data.subheading}</p>}
          <DotList items={data.items} className="gap-3.5" />
          {(data.email_title || data.email_note) && (
            <div className="flex w-full flex-col gap-2 rounded-card bg-sky-soft px-6 py-6">
              <p className="text-body-m font-bold">
                {data.email_title}{" "}
                <a href={`mailto:${email}`} className="break-all text-royal underline-offset-4 hover:underline">
                  {email}
                </a>
              </p>
              {data.email_note && <p className="text-body-s text-ink-soft">{data.email_note}</p>}
            </div>
          )}
        </div>
        <div className="min-w-0 lg:w-[580px] lg:shrink-0">
          <ConsultationForm
            title={data.form_title}
            notice={fillTokens(data.form_notice, ctx.settings)}
            topics={data.topics}
            help={fillTokens(data.form_help, ctx.settings)}
            submitLabel={data.submit_label || "Request a Phone Consultation"}
            phone={ctx.settings.phone}
          />
        </div>
      </div>
    </Container>
  );
}
