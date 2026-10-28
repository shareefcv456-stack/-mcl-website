import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";
import { SERVICES, serviceHref } from "@/lib/content/services";
import { BLOG_POSTS, postHref } from "@/lib/content/blogs";
import { JOBS, jobHref } from "@/lib/content/careers";

const STATIC_PATHS = [
  "/", "/about", "/tracking", "/services", "/blogs", "/career", "/review", "/contact",
  "/privacy-policy", "/terms-of-service", "/refund-policy", "/shipping-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...SERVICES.map((s) => serviceHref(s.slug)),
    ...BLOG_POSTS.map((p) => postHref(p.slug)),
    ...JOBS.map((j) => jobHref(j.slug)),
  ];
  return paths.map((path) => ({ url: new URL(path, SITE.url).toString() }));
}
