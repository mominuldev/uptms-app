import { Markdown } from "@/components/content/Markdown";
import { Picture } from "@/components/content/Picture";
import { acceptsRequests } from "@/components/forms/formSource";
import { QualifyButton } from "@/components/forms/QualifyButton";
import type { TeamMember } from "@/lib/content";
import type { BlockProps, TeamData, TeamSources } from "../types";
import { CtaButton, Eyebrow, SectionHead, TextLink, TintPanel } from "./parts";

/**
 * 04 · Care team (Figma 28:121): the founder card (portrait, role, name,
 * credentials, bio, highlight tags, button) and a card for everyone else
 * shown on the page, then a link to the main site. Like the Home hero's, the
 * card's button can open the qualification form in a popup.
 */
export function TeamBlock({ data, sources, number, anchor, ctx }: BlockProps<TeamData, TeamSources>) {
  const team = sources.team ?? [];
  const founder = team.find((member) => member.is_founder) ?? team[0];
  const others = team.filter((member) => member !== founder);
  const headingId = `${anchor ?? "team"}-title`;
  // Without the inbox (or without a label) the button falls back to its link.
  const form = data.primary_opens_form && data.primary.label !== "" && acceptsRequests(sources.form) ? sources.form : null;

  return (
    <TintPanel tone="skySoft" id={anchor} labelledBy={headingId} block="team">
      <div className="flex flex-col gap-10 xl:gap-14">
        <SectionHead number={number} rail={data.rail} headline={data.headline} intro={data.intro} headingId={headingId} />

        {founder ? (
          <article className="flex flex-col gap-8 rounded-sheet bg-white p-4 pb-7 md:p-6 md:pb-9 lg:flex-row lg:items-center lg:gap-10 lg:pr-10 xl:gap-14 xl:pr-12">
            {founder.photo ? (
              <Picture
                image={founder.photo}
                sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, 100vw"
                className="block aspect-[420/440] w-full overflow-hidden rounded-[20px] sm:max-w-[420px] lg:w-[360px] lg:shrink-0 xl:w-[420px]"
              />
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[18px] px-1 md:px-2 lg:px-0">
              <Eyebrow>{founder.role_title}</Eyebrow>
              <h3 className="font-serif text-[40px] leading-[1.08] tracking-[-0.02em] md:text-display-l">{founder.name}</h3>
              {founder.credentials ? <p className="text-base leading-[1.35] font-bold text-ink-soft">{founder.credentials}</p> : null}
              <Markdown text={founder.bio} className="flex flex-col gap-4 text-body-m text-ink-soft" />
              {founder.highlights.length > 0 ? (
                <ul aria-label="Highlights" className="flex flex-wrap gap-2">
                  {founder.highlights.map((tag) => (
                    <li key={tag} className="rounded-full bg-sky-soft px-3.5 py-2 font-display text-eyebrow font-bold tracking-[0.1em] text-royal uppercase">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              {form ? (
                <QualifyButton
                  label={data.primary.label}
                  title={data.form_title ?? ""}
                  form={form}
                  insurers={sources.insurers ?? []}
                  tokens={ctx.settings}
                  variant="primary"
                  className="w-full sm:w-auto"
                />
              ) : (
                <CtaButton link={data.primary} tokens={ctx.settings} className="w-full sm:w-auto" />
              )}
            </div>
          </article>
        ) : null}

        {others.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-5">
            {others.map((member) => (
              <SupportCard key={member.id} member={member} />
            ))}
          </ul>
        ) : null}

        <TextLink link={data.link} tokens={ctx.settings} className="text-[15px] text-royal" />
      </div>
    </TintPanel>
  );
}

function SupportCard({ member }: { member: TeamMember }) {
  return (
    <li className="flex items-center gap-5 rounded-card bg-white p-3 pr-5 sm:gap-6 sm:p-4 sm:pr-7">
      {member.photo ? (
        <Picture image={member.photo} sizes="150px" className="block h-[150px] w-[120px] shrink-0 overflow-hidden rounded-2xl sm:h-[180px] sm:w-[150px]" />
      ) : (
        <span aria-hidden="true" className="flex h-[150px] w-[120px] shrink-0 items-center justify-center rounded-2xl bg-sky-soft font-serif text-heading-m text-royal sm:h-[180px] sm:w-[150px]">
          {member.initials}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <Eyebrow>{member.role_title}</Eyebrow>
        <h3 className="font-serif text-[26px] leading-[1.15] tracking-[-0.015em] sm:text-[32px]">{member.name}</h3>
        {member.credentials ? <p className="text-[14px] leading-[1.35] font-bold text-ink-soft">{member.credentials}</p> : null}
        {member.bio ? <p className="text-body-s text-ink-soft">{member.bio}</p> : null}
      </div>
    </li>
  );
}
