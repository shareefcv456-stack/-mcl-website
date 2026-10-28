import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/design-system"] },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
