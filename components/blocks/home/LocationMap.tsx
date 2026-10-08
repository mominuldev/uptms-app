"use client";

import { useState } from "react";

/**
 * Privacy-friendly map (Figma "Map · Google Maps embed", 30:327): a drawn
 * placeholder in the design's sky-soft with roads, pin and address chip.
 * Google is contacted only after the visitor chooses "Show map".
 */
export function LocationMap({ query, street, className = "" }: { query: string; street: string; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-sky-soft ${className}`}>
      {open ? (
        <iframe
          title={`Map of ${street}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <svg aria-hidden="true" focusable="false" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 520">
            <g fill="#fff">
              <rect x="-50" y="250" width="1400" height="10" />
              <rect x="-50" y="180" width="1400" height="14" transform="rotate(5 600 187)" />
              <rect x="-50" y="345" width="1400" height="8" transform="rotate(-3 600 349)" />
              <rect x="620" y="-40" width="12" height="700" />
              <rect x="820" y="-40" width="8" height="700" />
              <rect x="930" y="-40" width="16" height="700" transform="rotate(8 938 310)" />
            </g>
          </svg>
          <span aria-hidden="true" className="absolute top-[45%] left-1/2 flex size-11 lg:top-[200px] lg:left-[65%] -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-royal text-[13px] text-white">
            ●
          </span>
          <span className="absolute top-[calc(45%+56px)] left-1/2 max-w-[90%] lg:top-[256px] lg:left-[65%] -translate-x-1/2 truncate rounded-full bg-navy px-3.5 py-2 font-display text-eyebrow font-bold tracking-[0.1em] text-white uppercase">
            {street}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute top-4 right-4 rounded-full border border-line bg-white px-4 py-2.5 font-display text-[14px] font-bold text-royal shadow-[0_8px_20px_rgba(14,48,79,0.12)] hover:bg-sky-soft"
          >
            Show map <span className="font-normal text-ink-soft">· loads Google Maps</span>
          </button>
        </>
      )}
    </div>
  );
}
