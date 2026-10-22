import { Headline } from "@/components/content/Headline";
import type { BlockProps, LocationData } from "../types";
import { groupHours } from "./hours";
import { LocationMap } from "./LocationMap";
import { CtaButton, Eyebrow, Rail, TintPanel, h2Classes } from "./parts";

/**
 * 10 · Location (Figma 30:318): the clinic card (address, grouped hours,
 * phone, email, directions) over a click-to-load map, all from Clinic
 * settings so one edit updates every page.
 */
export function LocationBlock({ data, number, anchor, ctx }: BlockProps<LocationData>) {
  const { clinic, hours } = ctx.api;
  const headingId = `${anchor ?? "location"}-title`;
  const rows = groupHours(hours.days);
  const [nameFirst, nameRest] = splitName(clinic.name);
  const showCard = data.show_card !== false;

  return (
    <TintPanel tone="paper" id={anchor} labelledBy={headingId} block="location">
      <div className="flex flex-col gap-8 xl:gap-10">
        <div className="flex flex-col items-start gap-5">
          <Rail number={number} label={data.rail} />
          <Headline id={headingId} text={data.headline} className={h2Classes} />
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-sheet bg-sky-soft lg:block lg:h-[520px]">
          {showCard ? (
            <div className="relative z-10 m-4 flex flex-col items-start gap-[18px] rounded-card bg-white p-6 shadow-[0_16px_40px_rgba(14,48,79,0.14)] md:m-6 md:p-8 lg:absolute lg:top-4 lg:left-[15px] lg:m-0 lg:w-[420px] lg:p-9">
              {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
              <p className="font-serif text-heading-s text-ink">
                {nameFirst}
                {nameRest ? (
                  <>
                    <br />
                    {nameRest}
                  </>
                ) : null}
              </p>
              <address className="text-body-m text-ink-soft not-italic">
                {clinic.address.street}
                <br />
                {clinic.address.locality}, {clinic.address.region} {clinic.address.postal_code}
              </address>
              <dl className="flex w-full flex-col gap-1.5 text-[15px]">
                {rows.map((row) => (
                  <div key={row.days} className="flex items-start justify-between gap-4">
                    <dt className="leading-[1.55] text-ink-soft">{row.days}</dt>
                    <dd className="text-right font-display leading-[1.3] font-bold text-ink">{row.hours}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-0.5">
                <a href={clinic.phone.href} className="rounded-sm font-serif text-[30px] leading-[1.15] tracking-[-0.015em] text-royal hover:underline">
                  {clinic.phone.display}
                </a>
                <a href={`mailto:${clinic.email}`} className="rounded-sm text-body-m text-ink hover:text-royal hover:underline">
                  {clinic.email}
                </a>
              </div>
              <CtaButton link={{ label: "Get Directions →", href: clinic.directions_url }} tokens={ctx.settings} />
            </div>
          ) : null}
          <LocationMap query={`${clinic.name}, ${clinic.address.single_line}`} street={clinic.address.street} geo={clinic.geo} className="h-[320px] lg:absolute lg:inset-0 lg:h-auto" />
        </div>
      </div>
    </TintPanel>
  );
}

/** "University Place TMS Clinic & General Psychiatry" → two lines at the ampersand, as designed. */
function splitName(name: string): [string, string | null] {
  const index = name.indexOf(" & ");

  return index > 0 ? [name.slice(0, index), name.slice(index + 1)] : [name, null];
}
