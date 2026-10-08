/**
 * In Figma the specialty cards and the two condition guides share one paper
 * panel (26:156), but they are separate blocks so editors can reorder or
 * drop a guide. Each block is its own panel; when a guide directly follows
 * the cards or another guide, CSS sibling selectors remove the radius and
 * padding between them, so consecutive blocks read as one panel again.
 * (Class names are written out in full so Tailwind can find them.)
 */

/** Outer surface: inset like Panel, centred at the 1392px cap. */
export const joinedSurface =
  "mx-auto mb-3 w-[calc(100%-1.5rem)] max-w-[1392px] scroll-mt-6 rounded-panel bg-paper px-5 md:mb-4 md:w-[calc(100%-2rem)] md:px-10 lg:mb-6 lg:w-[calc(100%-3rem)] lg:px-14 xl:px-24";

/** Bottom: full panel padding, or just the inner gap when a guide follows. */
export const joinedBottom =
  "pb-12 md:pb-16 lg:pb-20 xl:pb-24 [&:has(+[data-join=guide])]:mb-0 [&:has(+[data-join=guide])]:rounded-b-none [&:has(+[data-join=guide])]:pb-5 md:[&:has(+[data-join=guide])]:mb-0 md:[&:has(+[data-join=guide])]:pb-8 lg:[&:has(+[data-join=guide])]:mb-0 lg:[&:has(+[data-join=guide])]:pb-10 xl:[&:has(+[data-join=guide])]:pb-14";

/** Top of a guide: no gap when it continues the panel above. */
export const joinedTop =
  "pt-12 md:pt-16 lg:pt-20 xl:pt-24 [[data-join=cards]+&]:rounded-t-none [[data-join=cards]+&]:pt-0 md:[[data-join=cards]+&]:pt-0 lg:[[data-join=cards]+&]:pt-0 xl:[[data-join=cards]+&]:pt-0 [[data-join=guide]+&]:rounded-t-none [[data-join=guide]+&]:pt-0 md:[[data-join=guide]+&]:pt-0 lg:[[data-join=guide]+&]:pt-0 xl:[[data-join=guide]+&]:pt-0";
