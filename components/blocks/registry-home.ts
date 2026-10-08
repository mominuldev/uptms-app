import type { AnyBlock } from "./BlockRenderer";
import { ConditionCardsBlock } from "./home/ConditionCards";
import { ConditionFeatureBlock } from "./home/ConditionFeature";
import { CopyPanelBlock } from "./home/CopyPanel";
import { CtaBandBlock } from "./home/CtaBand";
import { FaqBlock } from "./home/Faq";
import { HeroBlock } from "./home/Hero";
import { InsuranceBlock } from "./home/Insurance";
import { LocationBlock } from "./home/Location";
import { MediaTextBlock } from "./home/MediaText";
import { SectionNavBlock } from "./home/SectionNav";
import { StepsBlock } from "./home/Steps";
import { TeamBlock } from "./home/Team";
import { TestimonialsBlock } from "./home/Testimonials";
import { ValueGridBlock } from "./home/ValueGrid";

/** Blocks used by the Home page: hero … location (worker D1). */
export const HOME_BLOCKS: Record<string, AnyBlock> = {
  hero: HeroBlock,
  section_nav: SectionNavBlock,
  copy_panel: CopyPanelBlock,
  condition_cards: ConditionCardsBlock,
  condition_feature: ConditionFeatureBlock,
  media_text: MediaTextBlock,
  team: TeamBlock,
  cta_band: CtaBandBlock,
  insurance: InsuranceBlock,
  value_grid: ValueGridBlock,
  steps: StepsBlock,
  testimonials: TestimonialsBlock,
  faq: FaqBlock,
  location: LocationBlock,
};
