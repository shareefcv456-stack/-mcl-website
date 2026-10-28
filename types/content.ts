import type { LucideIcon } from "lucide-react";

/** Inline rich text: plain strings, or link segments. */
export type RichPart = string | { text: string; href: string };
export type RichText = string | RichPart[];

export interface Definition {
  term: string;
  detail: RichText;
}

export type ContentBlock =
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "paragraph"; text: RichText; lede?: boolean }
  | { type: "definitions"; items: Definition[] }
  | { type: "list"; items: string[] };

export interface ServiceOffering {
  title: string;
  image: string;
  summary: string;
  /** Full description from the live "View More" popup, when one exists. */
  description?: string;
}

export interface Service {
  slug: string;
  /** Name used in cards, nav and footer, e.g. "Air Cargo Services". */
  name: string;
  /** Heading on the detail page, e.g. "Air Freight Service". */
  heading: string;
  tag: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  excerpt: string;
  highlights: string[];
  lede: string;
  body: ContentBlock[];
  offeringsTitle: string;
  offerings: ServiceOffering[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  image: string;
  excerpt: string;
  body: ContentBlock[];
}

export interface Job {
  slug: string;
  title: string;
  employmentType: string;
  company: string;
  location: string;
  /** ISO date-time the job was posted. */
  postedAt: string;
  requirements: string[];
}

export interface Office {
  region: string;
  name: string;
  address: string;
  phones: { label: string; tel: string }[];
}

export interface LegalSection {
  heading: string;
  intro?: RichText;
  items?: Definition[];
}

export interface LegalPage {
  slug: string;
  title: string;
  sections: LegalSection[];
}

export interface Faq {
  question: string;
  answer: string;
}
