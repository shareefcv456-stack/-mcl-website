import { PageBanner } from "@/components/layout/PageBanner";
import { SupportBand } from "@/components/layout/SupportBand";
import { PostCard } from "@/components/blogs/PostCard";
import { BLOG_LISTING_ORDER, getPost } from "@/lib/content/blogs";
import { pageMetadata } from "@/lib/seo";
import type { BlogPost } from "@/types/content";

export const metadata = pageMetadata({
  title: "Blogs",
  description: "Articles from Meem Continental Logistics on air cargo, cargo handling and transport efficiency.",
  path: "/blogs",
  image: "/images/2151150071.jpg",
});

export default function BlogsPage() {
  const posts = BLOG_LISTING_ORDER.map(getPost).filter((p): p is BlogPost => !!p);
  return (
    <>
      <PageBanner title="Blogs" lead="News and insights from the MCL team." image="/images/2151150071.jpg" />
      <section className="section-y">
        <div className="container-site grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
          {posts.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
      <SupportBand />
    </>
  );
}
