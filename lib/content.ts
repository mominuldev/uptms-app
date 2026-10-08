/**
 * Shapes of the Laravel public API (uptms-ad docs/API.md §7). Everything
 * here is published content; nothing personal is ever returned.
 */
export interface Link {
  label: string;
  href: string;
}

export interface ImageSource {
  width: number;
  url: string;
}

export interface PublicImage {
  id: number;
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
  focal: { x: number; y: number };
  sources: Partial<Record<"avif" | "webp", ImageSource[]>>;
}

export interface ApiSettings {
  clinic: {
    name: string;
    tagline: string;
    service_area_label: string;
    service_area: string[];
    phone: { display: string; href: string };
    email: string;
    address: { street: string; locality: string; region: string; postal_code: string; country: string; single_line: string };
    geo: { lat: number; lng: number } | null;
    directions_url: string;
    main_site_url: string | null;
    social: { network: string; url: string }[];
  };
  hours: {
    short: string;
    long: string;
    days: { day: number; name: string; is_open: boolean; opens_at: string | null; closes_at: string | null; display: string }[];
    closures: { date: string; label: string }[];
  };
  announcement: { text: string; link_label: string | null; link_url: string | null } | null;
  legal: {
    copyright: string;
    crisis: string;
    crisis_short: string;
    insurance: string;
    testimonials: string;
    quiz: string;
  };
}

export interface MenuLink {
  label: string;
  href: string;
  children: { label: string; href: string }[];
}

export type ApiMenus = Partial<Record<"header" | "mobile" | "section-nav" | "footer-explore" | "footer-legal", MenuLink[]>>;

export interface TeamMember {
  id: number;
  name: string;
  credentials: string | null;
  role_title: string;
  initials: string;
  bio: string | null;
  highlights: string[];
  photo: PublicImage | null;
  show_on: string[];
  is_founder: boolean;
  schema_type: string;
}

export interface Faq {
  id: number;
  group: string;
  question: string;
  answer: string;
  in_schema: boolean;
}

export interface Testimonial {
  id: number;
  quote: string;
  author_name: string;
  source_label: string | null;
  source_url: string | null;
}

export interface InsurancePartner {
  id: number;
  name: string;
  logo: PublicImage | null;
  url: string | null;
}

export interface ContentItem {
  id: number;
  title: string;
  body: string | null;
  icon: string | null;
  link_label: string | null;
  link_url: string | null;
}

export interface Condition {
  id: number;
  slug: string;
  path: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  card_link_label: string | null;
  image: PublicImage | null;
  detail_title: string;
  detail_body: string | null;
  source: Link | null;
  cta: Link | null;
  reviewed_at: string | null;
  updated_at: string | null;
}

export interface ConditionDetail extends Condition {
  faqs: Faq[];
  seo: Seo;
}

export interface QuizQuestion {
  key: string;
  prompt: string;
  layout: "stack" | "grid";
  choices: { label: string; value: string }[];
}

export interface QuizResult {
  when: { question: string; value: string }[];
  title: string;
  body: string;
  primary: Link;
  secondary: Link;
  is_default: boolean;
}

export interface Quiz {
  header_label: string;
  submit_label: string;
  privacy_note: string;
  result_eyebrow: string;
  result_disclaimer: string;
  questions: QuizQuestion[];
  results: QuizResult[];
}

/** One section of a page. `data` follows the block's field schema (uptms-ad packages/pages/src/Blocks/BlockTypes.php). */
export interface Block<D = Record<string, unknown>, S = Record<string, unknown>> {
  id: number | null;
  type: string;
  anchor: string | null;
  /** "01", "02" … for blocks with a section rail, in page order. */
  number: string | null;
  data: D;
  sources: S;
}

/** What search engines and social apps see (uptms-ad SeoPresenter::public). */
export interface Seo {
  title: string;
  description: string;
  canonical: string;
  robots: { index: boolean; follow: boolean; max_image_preview: "large" | "standard" | "none"; max_snippet: number | null };
  open_graph: {
    type: "website" | "article";
    title: string;
    description: string;
    url: string;
    site_name: string;
    image: { url: string; width: number | null; height: number | null; alt: string } | null;
    published_time: string | null;
    modified_time: string | null;
  };
  twitter: { card: "summary" | "summary_large_image"; site: string | null };
  json_ld: Record<string, unknown>[];
}

export interface SeoSite {
  site_name: string;
  separator: string;
  x_handle: string | null;
  verification: { google?: string; bing?: string };
}

export interface Page {
  id: number;
  title: string;
  path: string;
  template: string;
  is_home: boolean;
  preview: boolean;
  published_at: string | null;
  updated_at: string | null;
  blocks: Block[];
  seo: Seo;
}

export interface PageSummary {
  path: string;
  title: string;
  template: string;
  updated_at: string | null;
}
