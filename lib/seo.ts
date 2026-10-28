import type { Metadata } from "next";
import { SITE } from "@/lib/content/site";

interface PageMeta {
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". */
  path: string;
  image?: string;
  noindex?: boolean;
}

export function pageMetadata({ title, description, path, image = "/images/hero-ship.png", noindex }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
      siteName: SITE.name,
      type: "website",
      images: [{ url: image }],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
