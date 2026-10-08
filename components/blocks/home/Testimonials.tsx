import type { BlockProps, TestimonialsData, TestimonialsSources } from "../types";
import { SectionHead, TextLink, TintPanel } from "./parts";

/**
 * 08 · Patient voices (Figma 30:152): quote cards on a stone panel, with the
 * testimonials disclaimer from Clinic settings.
 */
export function TestimonialsBlock({ data, sources, number, anchor, ctx }: BlockProps<TestimonialsData, TestimonialsSources>) {
  const testimonials = sources.testimonials ?? [];
  const headingId = `${anchor ?? "voices"}-title`;
  const disclaimer = ctx.api.legal.testimonials;

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <TintPanel tone="stone" id={anchor} labelledBy={headingId} block="testimonials">
      <div className="flex flex-col gap-10 xl:gap-14">
        <SectionHead number={number} rail={data.rail} headline={data.headline} intro={data.intro} headingId={headingId} />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {testimonials.map((item) => (
            <li key={item.id}>
              <figure className="flex h-full min-h-[240px] flex-col justify-between gap-8 rounded-card bg-white p-6 md:p-8 xl:min-h-[304px]">
                <div className="flex flex-col gap-3">
                  <span aria-hidden="true" className="font-serif text-[56px] leading-[44px] text-royal">
                    “
                  </span>
                  <blockquote className="font-serif text-[22px] leading-[1.3] tracking-[-0.01em] text-ink italic md:text-[24px]">{item.quote}</blockquote>
                </div>
                <figcaption className="flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-soft font-display text-base font-bold text-royal">
                    {item.author_name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base leading-[1.35] font-bold text-ink">{item.author_name}</span>
                    {item.source_label ? <span className="text-caption text-ink-soft">{item.source_label}</span> : null}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        {disclaimer || data.link.label ? (
          <p className="text-caption text-ink-soft">
            {disclaimer}{" "}
            <TextLink link={data.link} tokens={ctx.settings} className="font-sans text-caption font-normal text-ink-soft underline hover:text-royal" />
          </p>
        ) : null}
      </div>
    </TintPanel>
  );
}
