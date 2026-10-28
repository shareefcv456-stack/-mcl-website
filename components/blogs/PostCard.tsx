import Image from "next/image";
import Link from "next/link";
import { ArrowLabel } from "@/components/ui/Button";
import { formatDate, postHref } from "@/lib/content/blogs";
import type { BlogPost } from "@/types/content";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={postHref(post.slug)} className="group flex flex-col text-inherit hover:text-inherit">
      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-3xl bg-soft">
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]" />
      </div>
      <time dateTime={post.date} className="text-[0.8125rem] font-medium text-muted">{formatDate(post.date)}</time>
      <h3 className="mt-1.5 mb-2 text-xl transition-colors duration-200 ease-smooth group-hover:text-brand">{post.title}</h3>
      <p className="mb-3 text-[0.9375rem] text-muted">{post.excerpt}</p>
      <ArrowLabel className="text-brand">To Know More</ArrowLabel>
    </Link>
  );
}
