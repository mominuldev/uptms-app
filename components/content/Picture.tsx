import type { PublicImage } from "@/lib/content";

/**
 * Responsive image from the media library: AVIF and WebP sources at the
 * widths Laravel generated, the re-encoded original as fallback, cropped
 * around the editor's focal point. Laravel already optimised the files, so
 * next/image's optimiser is not involved.
 */
export function Picture({
  image,
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  fit = "cover",
}: {
  image: PublicImage | null | undefined;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  if (!image) {
    return <div aria-hidden="true" className={`bg-sky-soft ${className}`} />;
  }

  const srcSet = (format: "avif" | "webp") =>
    image.sources[format]?.map((source) => `${source.url} ${source.width}w`).join(", ");

  return (
    <picture className={className}>
      {(["avif", "webp"] as const).map((format) => {
        const set = srcSet(format);

        return set ? <source key={format} type={`image/${format}`} srcSet={set} sizes={sizes} /> : null;
      })}
      <img
        src={image.url}
        alt={image.alt}
        width={image.width ?? undefined}
        height={image.height ?? undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`block size-full ${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`}
        style={fit === "cover" ? { objectPosition: `${image.focal.x}% ${image.focal.y}%` } : undefined}
      />
    </picture>
  );
}
