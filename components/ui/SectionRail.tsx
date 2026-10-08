/**
 * Numbered section index above each heading (Figma "Section rail", 25:19):
 * `01 —— LABEL`. The label wraps under the rule on narrow screens rather
 * than overflowing (the 390 frames show it on two lines).
 */
export function SectionRail({
  number,
  label,
  tone = "light",
  className = "",
}: {
  number: string;
  label: string;
  /** `dark` for use on navy panels. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <p
      className={`flex items-start gap-3 font-display text-eyebrow font-bold tracking-[0.1em] uppercase ${className}`}
    >
      <span className={`flex shrink-0 items-center gap-3 ${dark ? "text-sky" : "text-royal"}`}>
        <span>{number}</span>
        <span aria-hidden="true" className={`h-[1.5px] w-8 ${dark ? "bg-sky" : "bg-royal"}`} />
      </span>
      <span className={`min-w-0 ${dark ? "text-white/80" : "text-ink-soft"}`}>{label}</span>
    </p>
  );
}
