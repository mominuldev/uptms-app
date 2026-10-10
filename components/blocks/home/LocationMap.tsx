/**
 * Google Maps embed (Figma "Map · Google Maps embed", 30:327), shown directly
 * in the design's sky-soft frame. Lazy-loaded so it only costs anything once
 * it nears the viewport.
 */
export function LocationMap({ query, street, className = "" }: { query: string; street: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-sky-soft ${className}`}>
      <iframe
        title={`Map of ${street}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
