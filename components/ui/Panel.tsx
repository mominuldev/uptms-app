import type { ComponentProps, ElementType, ReactNode } from "react";

/**
 * Rounded panel, the signature surface of design Version C. The panel is
 * inset from the viewport (12 / 16 / 24px at 390 / 768 / 1440) and pads its
 * content (20 / 40 / 72px). Tones follow the Figma panels: navy (hero),
 * sky (consultation band), sky-soft (specialties), white (outlined card).
 */
export type PanelTone = "navy" | "sky" | "skySoft" | "white";

const tones: Record<PanelTone, string> = {
  navy: "bg-navy text-white",
  sky: "bg-sky text-ink",
  skySoft: "bg-sky-soft text-ink",
  white: "border border-line bg-white text-ink",
};

type PanelProps<T extends ElementType> = {
  as?: T;
  tone?: PanelTone;
  /** Inset the panel from the viewport edge (default). Turn off when nesting. */
  inset?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
} & Omit<ComponentProps<T>, "as" | "className" | "children">;

export function Panel<T extends ElementType = "section">({
  as,
  tone = "navy",
  inset = true,
  className = "",
  innerClassName = "",
  children,
  ...rest
}: PanelProps<T>) {
  const Tag: ElementType = as ?? "section";

  return (
    <div className={inset ? `px-3 md:px-4 lg:px-6 ${className}` : className}>
      <Tag
        className={`mx-auto w-full max-w-[1392px] rounded-panel px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-[72px] ${tones[tone]} ${innerClassName}`}
        {...rest}
      >
        {children}
      </Tag>
    </div>
  );
}
