import type { QuizScaleResult } from "@/lib/content";

/**
 * One scale's result as Laravel scored it: the score out of the maximum, the
 * band's meaning, and a gauge whose segments are the scale's bands with a
 * marker at the score.
 */
const TONES = ["bg-success", "bg-[#7fa65a]", "bg-[#d9a23b]", "bg-[#d0702f]", "bg-danger"];

/** Spread the five tones over however many bands the scale has, mildest first. */
export function bandTone(index: number, count: number): string {
  if (count <= 1) return TONES[0]!;

  return TONES[Math.round((index / (count - 1)) * (TONES.length - 1))]!;
}

export function ResultCard({ result, note }: { result: QuizScaleResult; note: string }) {
  const span = Math.max(1, result.max);
  const at = Math.min(100, Math.max(0, (result.score / span) * 100));
  const active = result.bands.findIndex((band) => result.score >= band.min && result.score <= band.max);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <p className="flex items-baseline gap-1.5 font-serif text-ink">
          <span className="text-[64px] leading-none tracking-[-0.03em] md:text-[76px]">{result.score}</span>
          <span className="text-[22px] text-ink-soft">/ {result.max}</span>
        </p>
        <div className="flex min-w-0 flex-col gap-1 pb-2">
          <p className="font-display text-eyebrow font-bold tracking-[0.1em] text-ink-soft uppercase">{result.instrument ? `${result.label} · ${result.instrument}` : result.label}</p>
          <p className="font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-navy">{result.band.title}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5" role="img" aria-label={`Score ${result.score} out of ${result.max}: ${result.band.title}.`}>
        <div className="relative pt-7">
          <span className="absolute top-0 -translate-x-1/2 rounded-full bg-navy px-2.5 py-1 font-display text-[12px] leading-none font-bold whitespace-nowrap text-white" style={{ left: `clamp(18px, ${at}%, calc(100% - 18px))` }}>
            {result.score}
          </span>
          <div className="flex h-3 gap-[3px] overflow-hidden rounded-full">
            {result.bands.map((band, index) => (
              <span
                key={band.min}
                className={`h-full ${bandTone(index, result.bands.length)} ${index === active ? "opacity-100" : "opacity-35"}`}
                style={{ flexGrow: band.max - band.min + 1, flexBasis: 0 }}
              />
            ))}
          </div>
          <span aria-hidden="true" className="absolute top-[22px] h-[22px] w-[3px] -translate-x-1/2 rounded-full bg-navy ring-2 ring-white" style={{ left: `${at}%` }} />
        </div>
        <div className="flex justify-between text-caption text-ink-soft">
          <span>0</span>
          <span>{result.max}</span>
        </div>
      </div>

      <p className="text-body-m text-ink">{result.band.body}</p>
      {note && <p className="text-body-s text-ink-soft">{note}</p>}
    </div>
  );
}
