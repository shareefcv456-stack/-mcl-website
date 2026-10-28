import Image from "next/image";
import Link from "next/link";
import { ArrowLabel } from "@/components/ui/Button";
import { serviceHref } from "@/lib/content/services";
import type { Service } from "@/types/content";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={serviceHref(service.slug)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white text-inherit transition duration-200 hover:-translate-y-[3px] hover:text-inherit hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        <Image src={service.image} alt={service.imageAlt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[0.8125rem] font-semibold text-navy">
          <Icon aria-hidden className="size-[15px] text-brand" />{service.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="m-0 text-xl">{service.name}</h3>
        <p className="m-0 flex-1 text-[0.9375rem] text-muted">{service.excerpt}</p>
        <ArrowLabel>To Know More</ArrowLabel>
      </div>
    </Link>
  );
}
