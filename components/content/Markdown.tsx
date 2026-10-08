import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The small Markdown dialect the admin offers (uptms-ad Field::markdown):
 * blank-line paragraphs, "- " bullet lists, **bold**, *italic* and
 * [label](href). It is parsed into React elements, never injected as HTML,
 * and links are limited to safe schemes.
 */
const SAFE_HREF = /^(\/(?!\/)|#|https:\/\/|tel:|mailto:)/;

type Inline = { kind: "text"; text: string } | { kind: "strong" | "em"; children: Inline[] } | { kind: "link"; href: string; children: Inline[] };

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;

    if (index > last) out.push({ kind: "text", text: text.slice(last, index) });

    if (match[1] !== undefined) out.push({ kind: "strong", children: parseInline(match[1]) });
    else if (match[2] !== undefined) out.push({ kind: "em", children: parseInline(match[2]) });
    else if (match[3] !== undefined && match[4] !== undefined && SAFE_HREF.test(match[4])) out.push({ kind: "link", href: match[4], children: parseInline(match[3]) });
    else out.push({ kind: "text", text: match[0] });

    last = index + match[0].length;
  }

  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });

  return out;
}

function renderInline(nodes: Inline[], linkClassName: string): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case "text":
        return node.text;
      case "strong":
        return <strong key={index} className="font-bold">{renderInline(node.children, linkClassName)}</strong>;
      case "em":
        return <em key={index}>{renderInline(node.children, linkClassName)}</em>;
      case "link":
        return node.href.startsWith("/") ? (
          <Link key={index} href={node.href} className={linkClassName}>
            {renderInline(node.children, linkClassName)}
          </Link>
        ) : (
          <a key={index} href={node.href} className={linkClassName} {...(node.href.startsWith("https://") ? { rel: "noopener" } : {})}>
            {renderInline(node.children, linkClassName)}
          </a>
        );
    }
  });
}

export function Inline({ text, linkClassName = "font-bold text-royal underline-offset-4 hover:underline" }: { text: string; linkClassName?: string }) {
  return <>{renderInline(parseInline(text), linkClassName)}</>;
}

export function Markdown({
  text,
  className = "flex flex-col gap-5",
  paragraphClassName = "",
  linkClassName,
}: {
  text: string | null | undefined;
  className?: string;
  paragraphClassName?: string;
  linkClassName?: string;
}) {
  if (!text || text.trim() === "") {
    return null;
  }

  const blocks = text.trim().split(/\n\s*\n/);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const lines = block.split("\n");

        if (lines.every((line) => /^\s*[-•]\s+/.test(line))) {
          return (
            <ul key={index} className={`flex list-disc flex-col gap-2 pl-5 ${paragraphClassName}`}>
              {lines.map((line, item) => (
                <li key={item}>
                  <Inline text={line.replace(/^\s*[-•]\s+/, "")} linkClassName={linkClassName} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className={paragraphClassName}>
            <Inline text={lines.join(" ")} linkClassName={linkClassName} />
          </p>
        );
      })}
    </div>
  );
}
