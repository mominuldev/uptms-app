import type { ReactNode } from "react";

/**
 * Accordion row (Figma "FAQ item", 25:35) on native <details>/<summary>, so
 * it is keyboard- and screen-reader-accessible without JavaScript and the
 * answer is in the HTML for search engines. Place inside a list whose top
 * border is `border-t border-line` to match the design.
 */
export function FaqItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-6 py-[22px] text-title font-bold text-ink marker:hidden focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{question}</span>
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-soft text-royal transition-colors group-open:bg-royal group-open:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" focusable="false">
            <path d="M2 7H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M7 2V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="origin-center transition-transform group-open:scale-y-0"
            />
          </svg>
        </span>
      </summary>
      <div className="-mt-2.5 pb-[22px] text-body-m text-ink-soft">{children}</div>
    </details>
  );
}
