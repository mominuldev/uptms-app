import type { ComponentType } from "react";
import type { Block } from "@/lib/content";
import { PendingBlock } from "./Pending";
import { HOME_BLOCKS } from "./registry-home";
import { MORE_BLOCKS } from "./registry-more";
import type { BlockContext, BlockProps } from "./types";

/**
 * Renders a page's sections in order. Each block type maps to one
 * component; an unknown type (a newer admin, an older site) renders
 * nothing rather than breaking the page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each entry narrows its own data/sources
export type AnyBlock = ComponentType<BlockProps<any, any>>;

export const BLOCKS: Record<string, AnyBlock> = { ...HOME_BLOCKS, ...MORE_BLOCKS };

export function BlockRenderer({ blocks, ctx }: { blocks: Block[]; ctx: Omit<BlockContext, "isFirst"> }) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = BLOCKS[block.type];
        const key = block.id ?? `${block.type}-${index}`;

        if (!Component) {
          return process.env.NODE_ENV === "production" ? null : <PendingBlock key={key} type={block.type} data={block.data} />;
        }

        return <Component key={key} data={block.data} sources={block.sources} number={block.number} anchor={block.anchor} ctx={{ ...ctx, isFirst: index === 0 }} />;
      })}
    </>
  );
}
