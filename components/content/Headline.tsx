import type { ElementType } from "react";

/**
 * Headlines with the design's italic accent: "*explore a new way forward.*"
 * renders the starred words as <em> in the accent colour (sky on navy,
 * royal on light). Plain text only — no HTML from the API is trusted.
 */
export function accentRuns(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter((part) => part !== "")
    .map((part) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false },
    );
}

export function Headline({
  as,
  text,
  tone = "light",
  className = "",
  id,
}: {
  as?: ElementType;
  text: string;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  const Tag: ElementType = as ?? "h2";

  return (
    <Tag id={id} className={className}>
      {accentRuns(text).map((run, index) =>
        run.accent ? (
          <em key={index} className={tone === "dark" ? "text-sky" : "text-royal"}>
            {run.text}
          </em>
        ) : (
          <span key={index}>{run.text}</span>
        ),
      )}
    </Tag>
  );
}
