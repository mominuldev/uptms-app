import type { SVGProps } from "react";

/*
 * Icons exported from Figma (icon/menu, icon/close, icon/arrow, Current dot),
 * 20×20 strokes at 2px. Colour follows `currentColor` so the token text
 * utilities (text-ink, text-royal-deep…) set it. Always decorative.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function MenuIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 5.5H17M3 10H17M3 14.5H17" {...stroke} />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
      <path d="M4.5 4.5L10 10M10 10L15.5 15.5M10 10L15.5 4.5M10 10L4.5 15.5" {...stroke} />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 10H16M11 15L16 10L11 5" {...stroke} />
    </svg>
  );
}

export function DotIcon(props: IconProps) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" focusable="false" {...props}>
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}
