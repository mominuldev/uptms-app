import type { ComponentProps, ElementType, ReactNode } from "react";

/**
 * Page gutter from the Figma frames: 20px at 390, 40px at 768 (and up to
 * 1279px), 120px at 1440. Content is capped at the 1440 design width.
 */
export function Container<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: { as?: T; className?: string; children: ReactNode } & Omit<ComponentProps<T>, "as" | "className" | "children">) {
  const Tag: ElementType = as ?? "div";

  return (
    <Tag className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[120px] ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
