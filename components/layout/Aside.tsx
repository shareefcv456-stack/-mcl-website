import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { cardClass } from "@/components/ui/Section";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { SERVICES, serviceHref } from "@/lib/content/services";
import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils/cn";

/** Two-column article layout with a sticky sidebar (stacks below 860px). */
export function WithSidebar({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <section className="section-y">
      <div className="container-site grid items-start gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div>{children}</div>
        <aside className="grid gap-6 min-[861px]:sticky min-[861px]:top-[110px]">{aside}</aside>
      </div>
    </section>
  );
}

export function LinkListCard({ title, links, current }: { title: string; links: { label: string; href: string }[]; current?: string }) {
  return (
    <div className={cardClass}>
      <h2 className="mb-3 text-[1.0625rem]">{title}</h2>
      <ul className="m-0 list-none p-0">
        {links.map((l) => (
          <li key={l.href} className="border-b border-line last:border-0">
            <Link
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className={cn("flex items-center justify-between gap-3 py-3 text-[0.9375rem] font-medium", l.href === current ? "text-brand" : "text-navy")}
            >
              {l.label}
              <ArrowRight aria-hidden className="size-5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServicesListCard({ current }: { current?: string }) {
  return <LinkListCard title="Our Services" links={SERVICES.map((s) => ({ label: s.name, href: serviceHref(s.slug) }))} current={current} />;
}

export function QuoteCard() {
  return (
    <div className="rounded-3xl bg-navy p-6 text-on-dark-muted">
      <h2 className="mb-3 text-[1.0625rem] text-white">Need a quote?</h2>
      <p className="m-0 text-[0.9375rem]">Tell us your cargo type, weight, dimensions and destination.</p>
      <div className="mt-4 grid gap-6">
        <QuoteTrigger className={buttonClass({ variant: "white", block: true })}>Get a Quote</QuoteTrigger>
        <ButtonLink href={`tel:${SITE.phone.tel}`} variant="ghost-light" block>
          <Phone aria-hidden className="size-5" />{SITE.phone.label}
        </ButtonLink>
      </div>
    </div>
  );
}
