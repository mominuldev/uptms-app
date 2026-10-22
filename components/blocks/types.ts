import type { ApiSettings, Condition, ContentItem, Faq, InsurancePartner, Link, MenuLink, PublicImage, Quiz, TeamMember, Testimonial } from "@/lib/content";
import type { SiteSettings } from "@/lib/site";
import type { ConsultationFormSource } from "@/components/forms/formSource";

/**
 * Block data as the API sends it, one interface per block type
 * (uptms-ad packages/pages/src/Blocks/BlockTypes.php). Empty text is "",
 * empty links are { label: "", href: "" }, empty images are null.
 */
type Rail = { rail: string; anchor: string };
type Repeat<T> = T[];

export interface HeroData {
  eyebrow: string;
  headline: string;
  subheading: string;
  body: string;
  primary: Link;
  /** The button opens the qualification form in a popup instead of following its link. */
  primary_opens_form: boolean;
  form_title: string;
  note: string;
  aside: "image" | "team";
  image: PublicImage | null;
  card_eyebrow: string;
  card_title: string;
  card_body: string;
  show_founder: boolean;
  team_eyebrow: string;
  team_title: string;
  team_link: Link;
  show_trust_points: boolean;
}
export interface HeroSources {
  founder?: TeamMember[];
  trust_points?: ContentItem[];
  team?: TeamMember[];
  /** Only with `primary_opens_form`; missing or null when the consultation inbox is off. */
  form?: ConsultationFormSource | null;
  insurers?: InsurancePartner[];
}

export interface SectionNavData {
  lead: string;
  menu: string;
}
export interface SectionNavSources {
  items?: MenuLink[];
}

export interface CopyPanelData extends Rail {
  headline: string;
  subheading: string;
  body: string;
  cta: Link;
  /** The button opens the qualification form in a popup instead of following its link; missing on sections saved before the switch existed. */
  cta_opens_form?: boolean;
  form_title?: string;
  panel_title: string;
  panel_items: string[];
  panel_note: string;
}
export interface CopyPanelSources {
  /** Only with `cta_opens_form`; missing or null when the consultation inbox is off. */
  form?: ConsultationFormSource | null;
  insurers?: InsurancePartner[];
}

export interface ConsultationData extends Rail {
  headline: string;
  subheading: string;
  items: string[];
  /** Missing on sections saved before the field existed: "Call the clinic". */
  call_title?: string;
  email_title: string;
  email_note: string;
  form_title: string;
  form_notice: string;
  form_help: string;
  submit_label: string;
  success_body: string;
}
export interface ConsultationSources {
  /** Topics and call times from the consultation inbox; missing when it is switched off. */
  form?: ConsultationFormSource | null;
  insurers?: InsurancePartner[];
}

export interface ConditionCardsData extends Rail {
  headline: string;
  intro: string;
  close_title: string;
  close_body: string;
  close_cta: Link;
}
export interface ConditionsSources {
  conditions?: Condition[];
}

export interface ConditionFeatureData {
  anchor: string;
  eyebrow: string;
  headline: string;
  body: string;
  question: string;
  answer: string;
  primary: Link;
  link: Link;
  small_links: Repeat<Link>;
  image: PublicImage | null;
  caption: string;
  image_side: "left" | "right";
}

export interface MediaTextData extends Rail {
  headline: string;
  body: string;
  facts: Repeat<{ value: string; label: string }>;
  disclaimer: string;
  primary: Link;
  link: Link;
  image: PublicImage | null;
  image_side: "left" | "right";
  caption_eyebrow: string;
  caption: string;
}

export interface TeamData extends Rail {
  headline: string;
  intro: string;
  primary: Link;
  /** The founder card's button opens the qualification form in a popup instead of following its link; missing on sections saved before the switch existed. */
  primary_opens_form?: boolean;
  form_title?: string;
  link: Link;
}
export interface TeamSources {
  team?: TeamMember[];
  /** Only with `primary_opens_form`; missing or null when the consultation inbox is off. */
  form?: ConsultationFormSource | null;
  insurers?: InsurancePartner[];
}

export interface CtaBandData {
  tone: "sky" | "royal";
  anchor: string;
  eyebrow: string;
  headline: string;
  body: string;
  primary: Link;
  secondary: Link;
  link: Link;
}

export interface InsuranceData extends Rail {
  headline: string;
  intro: string;
  questions_title: string;
  questions_cta: Link;
  questions: string[];
  logos_title: string;
  logos_note: string;
  disclaimer: string;
  disclaimer_link: Link;
  close_text: string;
  close_cta: Link;
}
export interface InsuranceSources {
  partners?: InsurancePartner[];
}

export type ValueIcon = "target" | "heart" | "arrow" | "home" | "check" | "sun";
export interface ValueGridData extends Rail {
  headline: string;
  tiles: Repeat<{ icon: ValueIcon; tone: "white" | "navy"; title: string; body: string }>;
}

export interface StepsData extends Rail {
  headline: string;
  steps_source: "collection" | "inline";
  steps: Repeat<{ title: string; body: string }>;
  primary: Link;
  link: Link;
  panel_title: string;
  panel_body: string;
  panel_warning: string;
  panel_links: Repeat<Link>;
}
export interface StepsSources {
  steps?: ContentItem[];
}

export interface TestimonialsData extends Rail {
  headline: string;
  intro: string;
  link: Link;
}
export interface TestimonialsSources {
  testimonials?: Testimonial[];
}

export interface FaqData extends Rail {
  headline: string;
  intro: string;
  primary: Link;
  group: string;
  aside_title: string;
  aside_body: string;
  aside_link: Link;
  footnote: string;
  footnote_links: Repeat<Link>;
}
export interface FaqSources {
  faqs?: Faq[];
}

export interface LocationData extends Rail {
  headline: string;
  /** Missing on sections saved before the switch existed: treat as on. */
  show_card?: boolean;
  eyebrow: string;
}

export interface SplitCardsData extends Rail {
  headline: string;
  body: string;
  primary: Link;
  team_eyebrow: string;
  team_link: Link;
}
export interface FounderSources {
  founder?: TeamMember[];
}

export interface AreasOfCareData extends Rail {
  headline: string;
}

export interface ComparisonData extends Rail {
  headline: string;
  intro: string;
  columns: Repeat<{ title: string; body: string; items: string[] }>;
  callout: string;
  primary: Link;
  link: Link;
}

export interface QuizBlockData extends Rail {
  headline: string;
  subheading: string;
  items: string[];
  disclaimer: string;
  speak_title: string;
  speak_link: Link;
}
export interface QuizSources {
  quiz?: Quiz | null;
  founder?: TeamMember[];
}

export interface LinkCardsData extends Rail {
  headline: string;
  cards: Repeat<{ title: string; body: string; link: Link }>;
}

export interface RichTextData extends Rail {
  headline: string;
  body: string;
}

/** What every block receives besides its own data. */
export interface BlockContext {
  settings: SiteSettings;
  api: ApiSettings;
  path: string;
  /** First block on the page: renders eagerly (LCP image, h1). */
  isFirst: boolean;
}

export interface BlockProps<D, S = Record<string, never>> {
  data: D;
  sources: S;
  number: string | null;
  anchor: string | null;
  ctx: BlockContext;
}
