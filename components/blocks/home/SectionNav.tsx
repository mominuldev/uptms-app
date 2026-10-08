import Link from "next/link";
import type { BlockProps, SectionNavData, SectionNavSources } from "../types";

/**
 * Section navigation (Figma 26:108): "Find what you need" and anchor pills.
 * Pills wrap and centre on wide screens; on phones they scroll sideways.
 */
export function SectionNavBlock({ data, sources, anchor }: BlockProps<SectionNavData, SectionNavSources>) {
  const items = sources.items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <nav id={anchor ?? undefined} aria-label={data.lead || "On this page"} data-block="section_nav" className="mx-auto w-full max-w-[1440px] py-5 md:py-7">
      <div className="flex items-center gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible md:px-10 xl:px-[120px] [&::-webkit-scrollbar]:hidden">
        {data.lead ? <p className="shrink-0 pr-1 text-body-s text-ink-soft">{data.lead}</p> : null}
        <ul className="flex shrink-0 items-center gap-2.5 md:shrink md:flex-wrap md:justify-center">
          {items.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="inline-flex rounded-full border border-line px-4 py-[9px] font-display text-[15px] leading-[1.2] font-semibold whitespace-nowrap text-royal transition-colors hover:border-royal hover:bg-sky-soft"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
