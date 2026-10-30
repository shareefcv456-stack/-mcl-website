import type { Faq as FaqItem } from "@/types/content";
import { cn } from "@/lib/utils/cn";

/**
 * Native <details> accordion: keyboard accessible with no client JavaScript.
 * `panel` (home page FAQ): each question is a rounded row; the open one takes a soft blue tint, its plus turns into
 * a minus, and its answer fades up as it opens.
 */
export function Faq({ items, variant = "plain" }: { items: FaqItem[]; variant?: "plain" | "panel" }) {
  const panel = variant === "panel";
  return (
    <div className={panel ? "grid gap-3" : "border-t border-line"}>
      {items.map((f, i) => (
        <details
          key={f.question}
          open={i === 0}
          className={cn(
            "group",
            panel
              ? "faq-panel rounded-2xl border border-line bg-white px-5 transition-[background-color,border-color,box-shadow] duration-300 ease-smooth hover:border-[#c3cadd] open:border-brand-100 open:bg-brand-50/60 open:shadow-[0_12px_30px_-24px_rgb(44_53_212/0.55)]"
              : "border-b border-line",
          )}
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[1.0625rem] font-semibold leading-snug text-navy [&::-webkit-details-marker]:hidden",
              panel ? "py-[18px] transition-colors duration-200 hover:text-brand" : "py-5",
            )}
          >
            {f.question}
            {panel ? (
              <span aria-hidden className="relative grid size-8 shrink-0 place-items-center rounded-full bg-soft text-brand transition-colors duration-300 group-open:bg-brand group-open:text-white">
                <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                <span className="absolute h-3 w-0.5 rounded-full bg-current transition-transform duration-300 ease-smooth group-open:scale-y-0" />
              </span>
            ) : (
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-soft text-xl font-normal text-brand transition group-open:rotate-45 group-open:bg-brand-50"
              >
                +
              </span>
            )}
          </summary>
          <p className={cn("m-0 max-w-[70ch] pb-5 text-muted", panel && "pr-10 text-[0.9375rem] leading-[1.7]")}>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
