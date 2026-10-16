import { Headline } from "@/components/content/Headline";
import { Picture } from "@/components/content/Picture";
import { acceptsRequests } from "@/components/forms/formSource";
import { QualifyDialog } from "@/components/forms/QualifyDialog";
import { Container } from "@/components/ui/Container";
import { fillTokens } from "@/lib/tokens";
import type { TeamMember } from "@/lib/content";
import type { BlockProps, HeroData, HeroSources } from "../types";
import { Actions, CtaButton, Eyebrow, TextLink, anchorClasses, nameWithCredentials } from "./parts";

/**
 * Hero (Figma 26:70): navy panel, display headline with the sky accent,
 * one button (optionally opening the qualification form) and small print; on the right either the photo with its
 * caption card and founder chip (Home, TMS) or the team card (Contact).
 * The optional trust strip closes the panel.
 */
export function HeroBlock({ data, sources, anchor, ctx }: BlockProps<HeroData, HeroSources>) {
  const tokens = ctx.settings;
  const Heading = ctx.isFirst ? "h1" : "h2";
  const founder = data.show_founder ? sources.founder?.[0] : undefined;
  const trust = data.show_trust_points ? sources.trust_points ?? [] : [];
  const team = (sources.team ?? []).slice(0, 2);
  const showTeam = data.aside === "team" && (team.length > 0 || data.team_title !== "");
  const showImage = data.aside !== "team" && data.image !== null;
  // Without the inbox (or without a label) the button falls back to its link.
  const form = data.primary_opens_form && data.primary.label !== "" && acceptsRequests(sources.form) ? sources.form : null;

  return (
    <div className="px-3 pt-3 pb-3 md:px-4 md:pt-0 md:pb-4 lg:pb-6" data-block="hero">
      <section
        id={anchor ?? undefined}
        aria-labelledby="hero-title"
        className={`w-full overflow-hidden rounded-card bg-navy md:rounded-sheet lg:rounded-panel pt-10 text-white md:pt-14 lg:pt-[72px] ${trust.length > 0 ? "pb-8 md:pb-10" : "pb-10 md:pb-14 lg:pb-[72px]"} ${anchorClasses}`}
      >
        <Container className="flex flex-col gap-10 lg:gap-12">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-6 lg:gap-7">
              {data.eyebrow ? <Eyebrow className="text-sky">{data.eyebrow}</Eyebrow> : null}
              <Headline
                as={Heading}
                id="hero-title"
                text={data.headline}
                tone="dark"
                className="font-serif text-[42px] leading-[1.06] tracking-[-0.02em] text-balance md:text-display-l lg:text-[52px] lg:leading-[1.06] xl:text-display-xl"
              />
              {data.subheading ? <p className="text-body-l">{data.subheading}</p> : null}
              {data.body ? <p className="text-body-m text-white/80">{data.body}</p> : null}
              <Actions className="w-full sm:w-auto">
                {[
                  form ? (
                    <QualifyDialog
                      key="p"
                      label={fillTokens(data.primary.label, tokens)}
                      className="w-full sm:w-auto"
                      title={data.form_title || "Find out if you qualify for TMS"}
                      notice=""
                      help=""
                      submitLabel="Submit Inquiry"
                      successBody={fillTokens("The team will reach out within one business day during office hours. If you need help sooner, call {phone}.", tokens)}
                      phone={tokens.phone}
                      form={form}
                      insurers={(sources.insurers ?? []).map((insurer) => insurer.name)}
                    />
                  ) : (
                    <CtaButton key="p" link={data.primary} tokens={tokens} variant="light" className="w-full sm:w-auto" />
                  ),
                ]}
              </Actions>
              {data.note ? <p className="text-caption text-white/72">{fillTokens(data.note, tokens)}</p> : null}
            </div>

            {showImage ? <HeroPhoto data={data} founder={founder} priority={ctx.isFirst} /> : null}
            {showTeam ? <HeroTeam data={data} team={team} tokens={tokens} /> : null}
          </div>

          {trust.length > 0 ? (
            <ul aria-label="Why people choose us" className="grid grid-cols-1 gap-3 border-t-[1.5px] border-white pt-6 sm:grid-cols-2 xl:flex">
              {trust.map((item) => (
                <li
                  key={item.id}
                  className="flex min-w-0 flex-1 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/38 px-[18px] py-3 text-center font-display text-[15px] leading-[1.3] font-bold"
                >
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-white" />
                  <span className="min-w-0">{item.title}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>
    </div>
  );
}

function HeroPhoto({ data, founder, priority }: { data: HeroData; founder: TeamMember | undefined; priority: boolean }) {
  const hasCaption = data.card_eyebrow !== "" || data.card_title !== "" || data.card_body !== "";

  return (
    <div className="relative w-full lg:h-[460px] lg:w-[400px] lg:shrink-0 xl:h-[560px] xl:w-[560px]">
      <Picture
        image={data.image}
        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 400px, 100vw"
        priority={priority}
        className="block aspect-[4/3] w-full overflow-hidden rounded-[28px] md:aspect-[16/10] lg:aspect-auto lg:h-[420px] xl:h-[520px]"
      />

      {founder ? (
        <div className="absolute top-3 right-3 left-3 flex items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 text-ink shadow-[0_8px_24px_rgba(14,48,79,0.16)] sm:left-auto md:top-4 md:right-4">
          {founder.photo ? (
            <Picture image={{ ...founder.photo, alt: "" }} sizes="48px" className="block size-12 shrink-0 overflow-hidden rounded-full" />
          ) : (
            <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-soft font-display font-bold text-royal">
              {founder.initials}
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[14px] leading-[1.3] font-bold">{nameWithCredentials(founder.name, founder.credentials)}</span>
            <span className="truncate text-caption text-ink-soft">{founder.role_title}</span>
          </span>
        </div>
      ) : null}

      {hasCaption ? (
        <div className="relative z-10 mx-4 -mt-14 flex flex-col gap-1.5 rounded-[20px] bg-white px-[22px] py-5 text-ink shadow-[0_16px_40px_rgba(14,48,79,0.18)] sm:mr-auto sm:w-[300px] lg:absolute lg:bottom-0 lg:-left-10 lg:m-0">
          {data.card_eyebrow ? <Eyebrow>{data.card_eyebrow}</Eyebrow> : null}
          {data.card_title ? <p className="font-serif text-[22px] leading-[1.22] tracking-[-0.01em]">{data.card_title}</p> : null}
          {data.card_body ? <p className="text-body-s text-ink-soft">{data.card_body}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function HeroTeam({ data, team, tokens }: { data: HeroData; team: TeamMember[]; tokens: BlockProps<HeroData>["ctx"]["settings"] }) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[28px] bg-white p-5 text-ink md:p-8 lg:w-[460px] lg:shrink-0 xl:w-[520px]">
      {data.team_eyebrow ? <Eyebrow>{data.team_eyebrow}</Eyebrow> : null}
      {data.team_title ? <Headline as="p" text={data.team_title} className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-heading-m" /> : null}
      {team.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:gap-4">
          {team.map((member) => (
            <li key={member.id} className="flex min-w-0 flex-col gap-3 rounded-[20px] bg-paper p-2.5 pb-4">
              {member.photo ? (
                <Picture image={member.photo} sizes="(min-width: 1024px) 240px, 45vw" className="block aspect-square w-full overflow-hidden rounded-[14px]" />
              ) : (
                <span aria-hidden="true" className="flex aspect-square w-full items-center justify-center rounded-[14px] bg-sky-soft font-serif text-heading-m text-royal">
                  {member.initials}
                </span>
              )}
              <span className="flex flex-col gap-0.5 px-1.5">
                <span className="font-display text-[15px] leading-[1.3] font-bold">{nameWithCredentials(member.name, member.credentials)}</span>
                <span className="text-caption text-ink-soft">{member.role_title}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <TextLink link={data.team_link} tokens={tokens} className="text-[15px] text-royal" />
    </div>
  );
}
