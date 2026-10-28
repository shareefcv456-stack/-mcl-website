import type { Faq as FaqItem } from "@/types/content";

/** Native <details> accordion: keyboard accessible with no client JavaScript. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((f, i) => (
        <details key={f.question} open={i === 0} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-[1.0625rem] font-semibold leading-snug text-navy [&::-webkit-details-marker]:hidden">
            {f.question}
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full bg-soft text-xl font-normal text-brand transition group-open:rotate-45 group-open:bg-brand-50"
            >
              +
            </span>
          </summary>
          <p className="m-0 max-w-[70ch] pb-5 text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
