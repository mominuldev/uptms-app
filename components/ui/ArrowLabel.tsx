import { ArrowIcon } from "@/components/ui/icons";

const TRAILING_ARROW = /\s*→\s*$/;

/**
 * A label whose trailing "→" (CMS copy writes it as text) is drawn as the
 * Figma icon/arrow instead of a font glyph. Labels without one pass through.
 */
export function ArrowLabel({ children, className = "" }: { children: string; className?: string }) {
  if (!TRAILING_ARROW.test(children)) {
    return <>{children}</>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {children.replace(TRAILING_ARROW, "")}
      <ArrowIcon className="size-[1.25em] shrink-0" />
    </span>
  );
}
