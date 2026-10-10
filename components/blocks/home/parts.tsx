import Link from "next/link";
import type { ReactNode } from "react";
import { Headline } from "@/components/content/Headline";
import { Container } from "@/components/ui/Container";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { SectionRail } from "@/components/ui/SectionRail";
import type { Link as ContentLink } from "@/lib/content";
import type { SiteSettings } from "@/lib/site";
import { isExternal, resolveLink } from "@/lib/tokens";
import { ArrowLabel } from "@/components/ui/ArrowLabel";

/**
 * Building blocks shared by the Home sections (Figma Version C, 25:128).
 * Panels span the full viewport width and sit 12 / 16 / 24px apart; their
 * content lives in the page `Container`.
 */

type Tokens = Pick<SiteSettings, "phone" | "hours" | "email">;

/** Section headline size: Display/L from tablet, 36px on phones. */
export const h2Classes = "font-serif text-[36px] leading-[1.1] tracking-[-0.02em] md:text-display-l";

/** Links inside sections sit below a sticky-free header; keep a little air when jumped to. */
export const anchorClasses = "scroll-mt-6";

export type PanelTone = "paper" | "skySoft" | "sky" | "stone" | "navy" | "royal" | "white";

const panelTones: Record<PanelTone, string> = {
  paper: "bg-paper text-ink",
  skySoft: "bg-sky-soft text-ink",
  sky: "bg-sky text-navy",
  stone: "bg-stone text-ink",
  navy: "bg-navy text-white",
  royal: "bg-royal text-white",
  white: "bg-white text-ink",
};

/** A tinted rounded panel section (Specialties, Care team, Why UPTMS …). */
export function TintPanel({
  tone,
  id,
  labelledBy,
  className = "",
  innerClassName = "",
  children,
  block,
}: {
  tone: PanelTone;
  id?: string | null;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  block?: string;
}) {
  return (
    <div className={`px-4 pb-3 md:pb-4 lg:pb-6 ${className}`} data-block={block}>
      <section
        id={id ?? undefined}
        aria-labelledby={labelledBy}
        className={`w-full rounded-panel py-12 md:py-16 lg:py-20 xl:py-24 ${anchorClasses} ${panelTones[tone]} ${innerClassName}`}
      >
        <Container>{children}</Container>
      </section>
    </div>
  );
}

/** An untinted section on the page background, with the Figma gutters. */
export function PlainSection({
  id,
  labelledBy,
  className = "",
  children,
  block,
}: {
  id?: string | null;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  block?: string;
}) {
  return (
    <section
      id={id ?? undefined}
      aria-labelledby={labelledBy}
      data-block={block}
      className={`mx-auto w-full max-w-[1440px] px-5 py-14 md:px-10 md:py-[72px] xl:px-[120px] xl:py-28 ${anchorClasses} ${className}`}
    >
      {children}
    </section>
  );
}

/** `01 —— LABEL` when the block has a number and a label. */
export function Rail({ number, label, tone = "light" }: { number: string | null; label: string; tone?: "light" | "dark" }) {
  return number && label.trim() !== "" ? <SectionRail number={number} label={label} tone={tone} /> : null;
}

/**
 * The split section head of Figma: rail + headline on the left, intro text
 * bottom-aligned on the right (stacked below 1024px).
 */
export function SectionHead({
  number,
  rail,
  headline,
  intro,
  headingId,
  className = "",
}: {
  number: string | null;
  rail: string;
  headline: string;
  intro?: string;
  headingId: string;
  className?: string;
}) {
  if (!headline && !intro && !(number && rail)) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-20 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
        <Rail number={number} label={rail} />
        {headline ? <Headline id={headingId} text={headline} className={h2Classes} /> : null}
      </div>
      {intro ? <p className="text-body-l text-ink-soft lg:w-[400px] lg:shrink-0 xl:w-[460px]">{intro}</p> : null}
    </div>
  );
}

/** A filled-in link as a pill button; nothing when the link is empty. */
export function CtaButton({
  link,
  tokens,
  variant = "primary",
  className = "",
}: {
  link: ContentLink | null | undefined;
  tokens: Tokens;
  variant?: ButtonVariant;
  className?: string;
}) {
  const resolved = resolveLink(link, tokens);

  if (!resolved) {
    return null;
  }

  return (
    <Button href={resolved.href} variant={variant} className={className} {...(isExternal(resolved.href) ? { rel: "noopener" } : {})}>
      <ArrowLabel>{resolved.label}</ArrowLabel>
    </Button>
  );
}

const textLinkBase = "rounded-sm font-display font-bold leading-[1.3] underline-offset-4 hover:underline";

/** Bold "… →" text link (Figma "Link" style). */
export function TextLink({
  link,
  tokens,
  className = "text-base text-royal",
}: {
  link: ContentLink | null | undefined;
  tokens: Tokens;
  className?: string;
}) {
  const resolved = resolveLink(link, tokens);

  if (!resolved) {
    return null;
  }

  const classes = `${textLinkBase} ${className}`;

  return resolved.href.startsWith("/") && !resolved.href.startsWith("//") ? (
    <Link href={resolved.href} className={classes}>
      <ArrowLabel>{resolved.label}</ArrowLabel>
    </Link>
  ) : (
    <a href={resolved.href} className={classes} {...(isExternal(resolved.href) ? { rel: "noopener" } : {})}>
      <ArrowLabel>{resolved.label}</ArrowLabel>
    </a>
  );
}

/** Wraps buttons and text links in one row; renders nothing when all are empty. */
export function Actions({ children, className = "" }: { children: ReactNode[]; className?: string }) {
  const visible = children.filter(Boolean);

  return visible.length > 0 ? (
    <div className={`flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 ${className}`}>{children}</div>
  ) : null;
}

/** Royal dot list (Figma "List item", 25:15). */
export function DotList({ items, className = "" }: { items: string[]; className?: string }) {
  const list = items.filter((item) => item.trim() !== "");

  return list.length > 0 ? (
    <ul className={`flex flex-col gap-5 text-body-m text-ink ${className}`}>
      {list.map((item) => (
        <li key={item} className="flex gap-3.5">
          <span aria-hidden="true" className="mt-[9px] size-2.5 shrink-0 rounded-full bg-royal" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  ) : null;
}

/** Eyebrow / overline text (Figma "Eyebrow"). */
export function Eyebrow({ children, className = "text-royal" }: { children: ReactNode; className?: string }) {
  return <p className={`font-display text-eyebrow font-bold tracking-[0.1em] uppercase ${className}`}>{children}</p>;
}

/** "Name, credentials" as the chips and mini cards print it. */
export function nameWithCredentials(name: string, credentials: string | null): string {
  return credentials ? `${name}, ${credentials}` : name;
}

/** The check glyph of Figma's icon/check (38:480 / 38:482). */
export function CheckIcon({ size = 22, className = "" }: { size?: 22 | 26; className?: string }) {
  return size === 22 ? (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M4.58333 11.4583L8.70833 15.5833L17.4167 6.875" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  ) : (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M5.41667 13.5417L10.2917 18.4167L20.5833 8.125" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  );
}
