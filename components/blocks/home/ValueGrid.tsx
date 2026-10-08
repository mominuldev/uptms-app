import type { BlockProps, ValueGridData, ValueIcon } from "../types";
import { CheckIcon, SectionHead, TintPanel } from "./parts";

/**
 * 06 · Why UPTMS (Figma 28:231): tiles with a round icon badge; navy tiles
 * invert. The glyphs mirror the design's ◎ ♡ → ⌂ ✓ ☼.
 */
export function ValueGridBlock({ data, number, anchor }: BlockProps<ValueGridData>) {
  const tiles = data.tiles.filter((tile) => tile.title !== "");
  const headingId = `${anchor ?? "values"}-title`;

  return (
    <TintPanel tone="paper" id={anchor} labelledBy={headingId} block="value_grid">
      <div className="flex flex-col gap-10 xl:gap-14">
        <SectionHead number={number} rail={data.rail} headline={data.headline} headingId={headingId} />
        {tiles.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:gap-5">
            {tiles.map((tile) => {
              const navy = tile.tone === "navy";

              return (
                <li key={tile.title} className={`flex flex-col items-start gap-3.5 rounded-card p-6 md:p-8 ${navy ? "bg-navy text-white" : "bg-white text-ink"}`}>
                  <span aria-hidden="true" className={`flex size-[52px] items-center justify-center rounded-full ${navy ? "bg-royal text-white" : "bg-sky-soft text-royal"}`}>
                    <ValueGlyph icon={tile.icon} />
                  </span>
                  <h3 className="mt-6 font-serif text-heading-s">{tile.title}</h3>
                  <p className={`text-body-s ${navy ? "text-white" : "text-ink-soft"}`}>{tile.body}</p>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </TintPanel>
  );
}

export function ValueGlyph({ icon }: { icon: ValueIcon }) {
  const common = { width: 22, height: 22, viewBox: "0 0 22 22", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

  switch (icon) {
    case "check":
      return <CheckIcon size={22} />;
    case "heart":
      return (
        <svg {...common}>
          <path d="M11 17.5s-6.5-3.9-6.5-8.4A3.4 3.4 0 0 1 11 7.3a3.4 3.4 0 0 1 6.5 1.8c0 4.5-6.5 8.4-6.5 8.4Z" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 11h12M12.5 6.5 17 11l-4.5 4.5" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M5 10.2 11 5l6 5.2V17H5v-6.8Z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="3.2" />
          <path d="M11 3.5v1.8M11 16.7v1.8M3.5 11h1.8M16.7 11h1.8M5.7 5.7l1.3 1.3M15 15l1.3 1.3M5.7 16.3 7 15M15 7l1.3-1.3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <circle cx="11" cy="11" r="3" />
        </svg>
      );
  }
}
