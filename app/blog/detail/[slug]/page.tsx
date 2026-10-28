import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { LinkListCard, ServicesListCard, WithSidebar } from "@/components/layout/Aside";
import { ArrowLabel } from "@/components/ui/Button";
import { Prose } from "@/components/ui/RichText";
import { BLOG_POSTS, formatDate, getPost, postHref } from "@/lib/content/blogs";
import { pageMetadata } from "@/lib/seo";

// Content pages: fully static. Unknown slugs render (and are cached) as a real 404 instead of a streamed 200.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/detail/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.excerpt, path: postHref(post.slug), image: post.image });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/detail/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <PageBanner
        title={post.title}
        crumbs={[{ label: "Blogs", href: "/blogs" }]}
        image={post.image}
        lead={
          <time dateTime={post.date} className="inline-flex items-center gap-2">
            <Calendar aria-hidden className="size-4" />{formatDate(post.date)}
          </time>
        }
      />
      <WithSidebar
        aside={
          <>
            <LinkListCard title="Latest Posts" links={BLOG_POSTS.map((p) => ({ label: p.title, href: postHref(p.slug) }))} current={postHref(post.slug)} />
            <ServicesListCard />
          </>
        }
      >
        <article>
          <div className="relative mb-8 aspect-video overflow-hidden rounded-3xl">
            <Image src={post.image} alt="" fill sizes="(min-width: 861px) 60vw, 100vw" className="object-cover" />
          </div>
          <Prose blocks={post.body} />
          <Link href="/blogs" className="group mt-10 inline-block"><ArrowLabel>Back to all articles</ArrowLabel></Link>
        </article>
      </WithSidebar>
    </>
  );
}
