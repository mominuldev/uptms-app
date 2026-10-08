import Link from "next/link";
import type { ReactNode } from "react";
import { Picture } from "@/components/content/Picture";
import type { RichNode } from "@/lib/content";

/**
 * Renders a post body (uptms-ad RichText) into React elements: never HTML.
 * Laravel already whitelisted the nodes; links are checked again here, and
 * anything unknown renders nothing.
 */
export function safeHref(href: string | undefined): string | null {
  if (!href) return null;

  return /^(\/(?!\/)\S*|#[\w-]+|https:\/\/\S+|tel:[+\d\-() ]+|mailto:[^\s@]+@[^\s@]+)$/.test(href) ? href : null;
}

function inline(node: RichNode, key: number): ReactNode {
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type !== "text" || !node.text) return null;

  let out: ReactNode = node.text;

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") out = <strong className="font-bold text-ink">{out}</strong>;
    else if (mark.type === "italic") out = <em>{out}</em>;
    else if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      const className = "font-semibold text-royal underline decoration-royal/40 underline-offset-4 transition-colors hover:decoration-royal";

      if (href === null) continue;
      out = href.startsWith("/") || href.startsWith("#") ? (
        <Link href={href} className={className}>
          {out}
        </Link>
      ) : (
        <a href={href} className={className} {...(href.startsWith("https://") ? { rel: "noopener" } : {})}>
          {out}
        </a>
      );
    }
  }

  return <span key={key}>{out}</span>;
}

function block(node: RichNode, key: number): ReactNode {
  const children = (node.content ?? []).map((child, index) => (["text", "hardBreak"].includes(child.type) ? inline(child, index) : block(child, index)));

  switch (node.type) {
    case "paragraph":
      return children.length > 0 ? <p key={key}>{children}</p> : null;
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3 key={key} className="mt-4 font-serif text-[22px] leading-[1.25] text-ink md:text-[24px]">
          {children}
        </h3>
      ) : (
        <h2 key={key} className="mt-8 font-serif text-[28px] leading-[1.15] tracking-[-0.015em] text-ink md:text-[34px]">
          {children}
        </h2>
      );
    case "bulletList":
      return (
        <ul key={key} className="flex flex-col gap-3">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} start={node.attrs?.start} className="flex list-decimal flex-col gap-3 pl-6 marker:font-bold marker:text-royal">
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li key={key} className="relative pl-6 [ol>&]:pl-1 [&>p]:m-0">
          <span aria-hidden="true" className="absolute top-[0.7em] left-0 size-2 rounded-full bg-royal [ol>li>&]:hidden" />
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="my-2 rounded-card bg-sky-soft px-6 py-6 font-serif text-[22px] leading-[1.4] text-ink italic md:px-10 md:py-8 md:text-[24px] [&>p]:m-0">
          {children}
        </blockquote>
      );
    case "image":
      return node.attrs?.image ? (
        <figure key={key} className="my-4 overflow-hidden rounded-sheet bg-sky-soft">
          <Picture image={node.attrs.image} sizes="(min-width: 768px) 760px, 92vw" className="block aspect-[16/9] w-full" />
        </figure>
      ) : null;
    case "horizontalRule":
      return <hr key={key} className="my-6 border-line" />;
    default:
      return null;
  }
}

export function RichText({ doc, className = "" }: { doc: { content: RichNode[] }; className?: string }) {
  return <div className={className}>{doc.content.map((node, index) => block(node, index))}</div>;
}
