import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ArrowLabel, buttonClass } from "@/components/ui/Button";
import { FlipCard } from "@/components/ui/FlipCard";
import { serviceHref } from "@/lib/content/services";
import type { Service } from "@/types/content";

/** Service card. The round control turns it over to the service's highlights and a link to its page. */
export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const href = serviceHref(service.slug);
  return (
    <FlipCard
      label={service.name}
      className="h-full transition-[translate] duration-200 ease-smooth hover:-translate-y-[3px]"
      faceClassName="rounded-3xl"
      front={
        <Link
          href={href}
          className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white text-inherit transition-[box-shadow,border-color] duration-200 ease-smooth hover:border-brand-100 hover:text-inherit hover:shadow-card"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-soft">
            <Image src={service.image} alt={service.imageAlt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]" />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[0.8125rem] font-semibold text-navy">
              <Icon aria-hidden className="size-[15px] text-brand" />{service.tag}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="m-0 text-xl transition-colors duration-200 ease-smooth group-hover:text-brand">{service.name}</h3>
            <p className="m-0 flex-1 text-[0.9375rem] text-muted">{service.excerpt}</p>
            <ArrowLabel>To Know More</ArrowLabel>
          </div>
        </Link>
      }
      back={
        <div className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl bg-navy bg-[radial-gradient(120%_70%_at_100%_0%,rgb(44_53_212/0.45),transparent_65%)] p-6 text-on-dark">
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/10 px-2.5 py-1.5 text-[0.8125rem] font-semibold text-on-dark-accent">
            <Icon aria-hidden className="size-[15px]" />{service.tag}
          </span>
          <h3 className="m-0 pr-12 text-xl text-white">{service.heading}</h3>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-[0.9375rem]">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cyan-300" />{h}
              </li>
            ))}
          </ul>
          <Link href={href} className={buttonClass({ variant: "white", size: "sm", className: "mt-auto self-start" })}>
            View Service <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-[3px]" />
          </Link>
        </div>
      }
    />
  );
}
