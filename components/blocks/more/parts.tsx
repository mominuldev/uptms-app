import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionRail } from "@/components/ui/SectionRail";
import type { Link as ContentLink } from "@/lib/content";
import { isExternal } from "@/lib/tokens";

/** Shared bits of the TMS / Contact / Quiz blocks. */

export const sectionHeading = "font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l";

/** The numbered rail, only when the block has both a number and a label. */
export function Rail({ number, label, tone = "light" }: { number: string | null; label: string; tone?: "light" | "dark" }) {
  return number && label ? <SectionRail number={number} label={label} tone={tone} /> : null;
}

/** Rounded panel in any surface colour, full viewport width like `Panel`. */
export function Surface({
  id,
  className = "",
  innerClassName = "",
  labelledBy,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <div className={`px-4 ${className}`}>
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={`w-full scroll-mt-28 rounded-panel py-12 md:py-16 lg:py-[88px] ${innerClassName}`}
      >
        <Container>{children}</Container>
      </section>
    </div>
  );
}

/** Bold text link with an arrow ("Ask about depression treatment →"). */
export function TextLink({ link, className = "", tone = "royal" }: { link: ContentLink; className?: string; tone?: "royal" | "sky" }) {
  const classes = `inline-flex rounded-sm font-display text-[15px] leading-[1.3] font-bold ${
    tone === "sky" ? "text-sky hover:text-white" : "text-royal hover:text-royal-deep"
  } underline-offset-4 hover:underline ${className}`;
  const label = /→\s*$/.test(link.label) ? link.label : `${link.label} →`;

  return link.href.startsWith("/") ? (
    <Link href={link.href} className={classes}>
      {label}
    </Link>
  ) : (
    <a href={link.href} className={classes} {...(isExternal(link.href) ? { rel: "noopener" } : {})}>
      {label}
    </a>
  );
}

/** Royal dot bullets (Figma "List item"). */
export function DotList({ items, className = "", itemClassName = "text-body-m" }: { items: string[]; className?: string; itemClassName?: string }) {
  if (items.length === 0) return null;

  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {items.map((item) => (
        <li key={item} className={`flex gap-3.5 ${itemClassName}`}>
          <span aria-hidden="true" className="mt-[0.6em] size-2.5 shrink-0 rounded-full bg-royal" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}
