import { Headline } from "@/components/content/Headline";
import { Container } from "@/components/ui/Container";
import { fillTokens } from "@/lib/tokens";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import type { BlockProps, ConsultationData, ConsultationSources } from "../types";
import { Rail } from "./parts";

/**
 * Contact 01 "Free initial phone consultation" (Figma 33:404): copy beside
 * the qualification form, on a navy panel with a royal glow so it can open
 * the page in place of a hero.
 */
export function Consultation({ data, sources, number, anchor, ctx }: BlockProps<ConsultationData, ConsultationSources>) {
  const headingId = anchor ? `${anchor}-title` : "consultation-title";
  const { email, phone, hours } = ctx.settings;
  const callTitle = data.call_title ?? "Call the clinic";

  return (
    <div className="px-3 pt-3 pb-3 md:px-4 md:pt-0 md:pb-4 lg:pb-6" data-block="consultation">
      <section
        id={anchor ?? undefined}
        aria-labelledby={headingId}
        className="relative isolate w-full scroll-mt-28 overflow-hidden rounded-card bg-navy py-12 text-white md:rounded-sheet md:py-16 lg:rounded-panel lg:py-[104px]"
      >
        <Backdrop />
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
            <div className="flex min-w-0 flex-col items-start gap-7 lg:max-w-[540px] lg:flex-1 lg:pt-4">
              <Rail number={number} label={data.rail} tone="dark" />
              {data.headline && (
                <Headline
                  as={ctx.isFirst ? "h1" : "h2"}
                  id={headingId}
                  text={data.headline}
                  tone="dark"
                  className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] text-balance md:text-display-l lg:text-[60px]"
                />
              )}
              {data.subheading && <p className="text-body-l text-white/80">{data.subheading}</p>}

              {data.items.length > 0 && (
                <ul className="flex w-full flex-col gap-3">
                  {data.items.map((item) => (
                    <li key={item} className="flex items-start gap-3.5 text-body-m text-white/90">
                      <span aria-hidden="true" className="mt-[3px] flex size-6 shrink-0 items-center justify-center rounded-full bg-sky/15 text-sky ring-1 ring-sky/30">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 rounded-[20px] bg-white/[0.06] px-5 py-5 ring-1 ring-white/12 backdrop-blur-sm">
                  {callTitle && <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">{callTitle}</p>}
                  <a href={phone.href} className="rounded-sm font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-white hover:text-sky">
                    {phone.display}
                  </a>
                  <p className="text-body-s text-white/70">{hours.long}</p>
                </div>
                {(data.email_title || data.email_note) && (
                  <div className="flex min-w-0 flex-col gap-1.5 rounded-[20px] bg-white/[0.06] px-5 py-5 ring-1 ring-white/12 backdrop-blur-sm">
                    {data.email_title && <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-sky uppercase">{data.email_title}</p>}
                    <a href={`mailto:${email}`} className="rounded-sm text-body-m font-bold break-all text-white underline-offset-4 hover:text-sky hover:underline">
                      {email}
                    </a>
                    {data.email_note && <p className="text-body-s text-white/70">{data.email_note}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="relative min-w-0 text-ink lg:w-[580px] lg:shrink-0">
              <div aria-hidden="true" className="absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-br from-sky/30 via-royal/25 to-transparent blur-2xl" />
              <ConsultationForm
                title={data.form_title}
                notice={fillTokens(data.form_notice, ctx.settings)}
                help={fillTokens(data.form_help, ctx.settings)}
                submitLabel={data.submit_label || "Request a Phone Consultation"}
                successBody={fillTokens(data.success_body || "The team will call you within one business day during office hours.", ctx.settings)}
                phone={ctx.settings.phone}
                form={sources?.form ?? null}
                insurers={(sources?.insurers ?? []).map((insurer) => insurer.name)}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

/** Royal glow and faint concentric arcs behind the navy panel. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(24,60,220,0.55),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(200,225,249,0.12),transparent_50%)]" />
      <svg className="absolute -top-40 -right-40 size-[640px] text-white/[0.07]" viewBox="0 0 640 640" fill="none">
        {[120, 180, 240, 300].map((r) => (
          <circle key={r} cx="320" cy="320" r={r} stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}
