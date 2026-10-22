/**
 * Google Maps embed (Figma "Map · Google Maps embed", 30:327), shown directly
 * in the design's sky-soft frame. Lazy-loaded so it only costs anything once
 * it nears the viewport.
 *
 * Centred on the clinic's coordinates rather than searched by name: a `q=`
 * embed makes Google paint its own place card (name, rating, "Open in Maps")
 * over the map, duplicating the clinic card beside it. An `ll=` embed draws
 * the plain map, so the clinic gets our own pin instead.
 */
export function LocationMap({ query, street, geo, className = "" }: { query: string; street: string; geo?: { lat: number; lng: number } | null; className?: string }) {
  const src = geo ? `https://www.google.com/maps?ll=${geo.lat},${geo.lng}&z=16&output=embed` : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className={`relative overflow-hidden bg-sky-soft ${className}`}>
      <iframe
        title={`Map of ${street}`}
        src={src}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {geo ? <Pin /> : null}
    </div>
  );
}

/** The clinic marker, on the map's centre point and never swallowing a drag. */
function Pin() {
  return (
    <svg width="34" height="44" viewBox="0 0 34 44" fill="none" aria-hidden="true" focusable="false" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-royal drop-shadow-[0_6px_12px_rgba(14,48,79,0.3)]">
      <path d="M17 1C9.268 1 3 7.268 3 15c0 10.5 14 28 14 28s14-17.5 14-28c0-7.732-6.268-14-14-14Z" fill="currentColor" stroke="#fff" strokeWidth="2" />
      <circle cx="17" cy="15" r="5" fill="#fff" />
    </svg>
  );
}
