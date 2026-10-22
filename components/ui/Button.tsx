import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Pill button (Figma "Button", node 25:14). Primary is the main CTA,
 * Secondary the outline on light, Light / OutlineLight sit on navy or royal
 * panels, Soft is tertiary. SoftOutline is Soft with the royal edge it needs
 * when the pill sits on paper or sky-soft, where its fill alone is invisible
 * (WCAG 1.4.11 wants 3:1 around a control). Pass `href` for a link that looks
 * like a button.
 */
export type ButtonVariant = "primary" | "secondary" | "light" | "outlineLight" | "soft" | "softOutline";

const base =
  "items-center justify-center gap-2 rounded-full text-center font-display text-base leading-[1.2] font-bold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-royal py-[17px] text-white hover:bg-royal-deep",
  // Outlined styles trade 1.5px of padding for the border so every pill is 53px tall.
  secondary: "border-[1.5px] border-ink py-[15.5px] text-ink hover:bg-ink hover:text-white",
  light: "bg-white py-[17px] text-ink hover:bg-sky focus-visible:outline-white",
  outlineLight: "border-[1.5px] border-white py-[15.5px] text-white hover:bg-white hover:text-navy focus-visible:outline-white",
  soft: "bg-sky-soft py-[17px] text-royal hover:bg-sky",
  softOutline: "border-[1.5px] border-royal bg-sky-soft py-[15.5px] text-royal hover:bg-sky",
};

/** `md` is the Figma pill (28px sides); `sm` tightens the sides for split bars on narrow phones. */
export type ButtonSize = "md" | "sm";

const sizes: Record<ButtonSize, string> = {
  md: "px-7",
  sm: "px-3",
};

/** Display utilities in `className` (e.g. "hidden md:inline-flex") replace the default. */
const DISPLAY = /(^|\s)(hidden|block|flex|inline-flex|inline-block)(\s|$)/;

export function buttonClasses(variant: ButtonVariant = "primary", className = "", size: ButtonSize = "md"): string {
  const display = DISPLAY.test(className) ? "" : "inline-flex";

  return `${display} ${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
}

type CommonProps = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** In-app paths use next/link; tel:, mailto: and absolute URLs stay plain anchors. */
function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const classes = buttonClasses(variant, className, size);

  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as Omit<ButtonAsLink, keyof CommonProps>;

    return isInternal(href) ? (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchor}>
        {children}
      </a>
    );
  }

  const { type = "button", ...button } = rest as Omit<ButtonAsButton, keyof CommonProps>;

  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  );
}
