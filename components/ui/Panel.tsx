import { Container } from "@/components/ui/Container";
import type { ComponentProps, ElementType, ReactNode } from "react";

/**
 * Rounded panel, the signature surface of design Version C. The panel spans
 * the full viewport width; its content sits in the page `Container`. Tones follow the Figma panels: navy (hero),
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
  className?: string;
  innerClassName?: string;
  children: ReactNode;
} & Omit<ComponentProps<T>, "as" | "className" | "children">;

export function Panel<T extends ElementType = "section">({
  as,
  tone = "navy",
  className = "",
  innerClassName = "",
  children,
  ...rest
}: PanelProps<T>) {
  const Tag: ElementType = as ?? "section";

  return (
    <div className={`px-4 ${className}`}>
      <Tag className={`w-full rounded-panel py-10 md:py-14 lg:py-[72px] ${tones[tone]} ${innerClassName}`} {...rest}>
        <Container>{children}</Container>
      </Tag>
    </div>
  );
}
