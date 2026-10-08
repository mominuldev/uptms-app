import type { AnyBlock } from "./BlockRenderer";
import { AreasOfCare } from "./more/AreasOfCare";
import { Comparison } from "./more/Comparison";
import { Consultation } from "./more/Consultation";
import { LinkCards } from "./more/LinkCards";
import { QuizBlock } from "./more/QuizBlock";
import { RichText } from "./more/RichText";
import { SplitCards } from "./more/SplitCards";

/** Blocks used by TMS, Contact and Quiz, plus rich text (worker D2). */
export const MORE_BLOCKS: Record<string, AnyBlock> = {
  split_cards: SplitCards,
  areas_of_care: AreasOfCare,
  comparison: Comparison,
  consultation: Consultation,
  quiz: QuizBlock,
  link_cards: LinkCards,
  rich_text: RichText,
};
