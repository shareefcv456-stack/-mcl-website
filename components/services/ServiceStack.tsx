import Image from "next/image";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StackScroll } from "@/components/ui/StackScroll";
import { serviceHref } from "@/lib/content/services";
import type { Service } from "@/types/content";

/**
 * The Services page list: on desktop the cards stack as you scroll, each settling slightly lower over the last
 * (a layered-paper pile); on tablet and mobile they are ordinary cards in a column. Each card's copy fades up in turn.
 */
export function ServiceStack({ services }: { services: Service[] }) {
  return (
    <StackScroll>
      {services.map((s, i) => (
        <li key={s.slug} style={{ "--i": i } as CSSProperties}>
          <article className="card-stack-card group relative grid overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_24px_60px_-34px_rgb(11_21_51/0.45)] min-[1025px]:h-[min(440px,calc(100svh-180px))] min-[1025px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative aspect-[16/10] overflow-hidden bg-soft min-[1025px]:aspect-auto">
              <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1025px) 620px, 100vw"
                className="object-cover transition-[scale] duration-700 ease-smooth group-hover:scale-[1.03]" />
            </div>
            <Reveal variant="stagger" className="flex flex-col justify-center gap-4 p-6 sm:p-9 min-[1025px]:p-12">
              <span className="flex items-center gap-3 text-[0.8125rem] font-semibold tracking-[0.08em] text-brand uppercase">
                <span className="grid size-11 place-items-center rounded-[14px] bg-brand-50"><s.icon aria-hidden className="size-5" strokeWidth={1.8} /></span>
                {s.tag}
                <span className="ml-auto font-medium tracking-normal text-muted tabular-nums">{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
              </span>
              <h2 className="m-0 text-[clamp(1.5rem,1.2rem+1vw,2.125rem)]">{s.name}</h2>
              <p className="m-0 max-w-[52ch] text-muted">{s.excerpt}</p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {s.highlights.map((h) => (
                  <li key={h} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-soft px-3 py-1.5 text-[0.8125rem] font-medium text-navy">
                    <Check aria-hidden className="size-3.5 text-brand" />{h}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <ButtonLink href={serviceHref(s.slug)} arrow aria-label={`View service: ${s.name}`}>View Service</ButtonLink>
              </div>
            </Reveal>
            {/* Darkens very slightly as the next card covers this one (desktop only; see .card-stack). */}
            <span aria-hidden className="card-stack-shade pointer-events-none absolute inset-0 bg-navy opacity-0" />
          </article>
        </li>
      ))}
    </StackScroll>
  );
}
