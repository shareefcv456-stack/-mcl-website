import Link from "next/link";
import type { ContentBlock, Definition, RichText as RichTextValue } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export function RichText({ value }: { value: RichTextValue }) {
  if (typeof value === "string") return value;
  return value.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : part.href.startsWith("/") ? (
      <Link key={i} href={part.href} className="font-medium underline underline-offset-2">{part.text}</Link>
    ) : (
      <a key={i} href={part.href} className="font-medium underline underline-offset-2">{part.text}</a>
    ),
  );
}

export function DefinitionList({ items }: { items: Definition[] }) {
  return (
    <dl className="mb-6 grid gap-3">
      {items.map((d) => (
        <div key={d.term} className="rounded-2xl bg-soft px-[18px] py-4">
          <dt className="mb-1 font-semibold text-navy">{d.term}</dt>
          <dd className="m-0 text-[0.9375rem] text-muted"><RichText value={d.detail} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** Renders long-form content (service details, blog posts) with consistent typography. */
export function Prose({ blocks, className }: { blocks: ContentBlock[]; className?: string }) {
  return (
    <div className={cn("max-w-[72ch] [&>:first-child]:mt-0", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 2 ? (
              <h2 key={i} className="mt-12 mb-4 text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{b.text}</h2>
            ) : (
              <h3 key={i} className="mt-8 mb-4">{b.text}</h3>
            );
          case "paragraph":
            return (
              <p key={i} className={cn("mb-4", b.lede ? "text-xl leading-relaxed text-navy" : "text-[#3a4363]")}>
                <RichText value={b.text} />
              </p>
            );
          case "definitions":
            return <DefinitionList key={i} items={b.items} />;
          case "list":
            return (
              <ul key={i} className="mb-4 list-disc pl-5 marker:text-brand">
                {b.items.map((item) => <li key={item} className="mb-2 text-[#3a4363]">{item}</li>)}
              </ul>
            );
        }
      })}
    </div>
  );
}
