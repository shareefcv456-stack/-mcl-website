import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ArrowDot, ArrowLabel, ButtonLink, buttonClass } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Feature, IconTile, SectionHeading, cardClass } from "@/components/ui/Section";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PostCard } from "@/components/blogs/PostCard";
import { VolumeCalculator } from "@/components/calculator/VolumeCalculator";
import {
  ABOUT_SUMMARY, BENEFITS, CATEGORIES, DELIVERED_STAT, FAQS, FAQ_INTRO, PORTFOLIO, PROCESS, TESTIMONIALS, VOLUME_INTRO, WHY_CHOOSE_US,
} from "@/lib/content/home";
import { SERVICES } from "@/lib/content/services";
import { BLOG_POSTS } from "@/lib/content/blogs";
import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils/cn";

const sectionLink = (href: string, label: string) => (
  <Link href={href} className="group"><ArrowLabel>{label}</ArrowLabel></Link>
);

export function StatImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <div className="relative aspect-[4/3.2] overflow-hidden rounded-3xl">
        <Image src={src} alt={alt} fill sizes="(min-width: 860px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="absolute -bottom-6 left-3 rounded-2xl bg-brand px-[22px] py-[18px] text-white shadow-float md:-left-4">
        <strong className="block font-display text-4xl leading-none font-semibold">{DELIVERED_STAT.value}</strong>
        <span className="text-[0.9375rem] text-[#dfe2ff]">{DELIVERED_STAT.label}</span>
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <div className="mt-8 grid gap-6">
      {BENEFITS.map((b, i) => <Feature key={b.title} {...b} tone={i ? "accent" : "brand"} />)}
    </div>
  );
}

export function AboutIntro() {
  return (
    <section className="section-y">
      <div className="container-site grid items-center gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
        <StatImage src="/images/container-ship.jpg" alt="Container ship at port" />
        <div>
          <span className="eyebrow">About MCL</span>
          <h2 className="mb-4">Meem Continental Logistics (MCL)</h2>
          <p className="text-muted">{ABOUT_SUMMARY}</p>
          {sectionLink("/about", "About Company")}
          <Benefits />
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="section-y bg-soft">
      <div className="container-site">
        <SectionHeading id="services-title" eyebrow="Our Services" title="Cargo services across air, sea and land" action={sectionLink("/services", "View all services")} />
        <div className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {SERVICES.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </div>
    </section>
  );
}

/** Image tile that opens the quote dialog pre-filled with its shipment category. */
export function CategoryTile({ category: c, className }: { category: (typeof CATEGORIES)[number]; className?: string }) {
  return (
    <QuoteTrigger
      category={c.title}
      className={cn("group relative isolate flex aspect-square items-end overflow-hidden rounded-2xl text-white hover:text-white", className)}
    >
      <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 200px, (min-width: 768px) 25vw, 50vw"
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(11_21_51/0.88)_0%,rgb(11_21_51/0.1)_65%)]" />
      <span className="w-full p-3.5">
        <span className="mb-1.5 block font-display text-base leading-tight font-semibold tracking-[-0.01em]">{c.title}</span>
        <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#c9ccff]">
          Request a Quote <ArrowRight aria-hidden className="size-3.5" />
        </span>
      </span>
    </QuoteTrigger>
  );
}

export function CategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="section-y">
      <div className="container-site">
        <SectionHeading id="categories-title" eyebrow="What we ship" title="Shipment categories" intro="Select a category to request a quote." />
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 min-[641px]:grid-cols-4 min-[1025px]:grid-cols-6">
          {CATEGORIES.map((c) => (
            <li key={c.title}><CategoryTile category={c} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Orbit badge angles (degrees clockwise from 3 o'clock). ±42° puts the badges at 1/6, 1/2 and 5/6 of the
// circle's height, matching the centres of the three step rows beside it on desktop.
const ORBIT_ANGLES = [222, 180, 138, 318, 0, 42];
const badgeClass = "grid shrink-0 place-items-center rounded-full bg-[#0f2550] text-cyan-300 ring-1 ring-cyan-300/35";

function ProcessColumn({ start, className }: { start: number; className?: string }) {
  return (
    <ol start={start + 1} className={cn("m-0 grid list-none gap-7 p-0 lg:grid-rows-3 lg:items-center lg:gap-0 lg:self-stretch", className)}>
      {PROCESS.slice(start, start + 3).map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <span className={cn(badgeClass, "size-11 lg:hidden")}>
            <s.icon aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="mb-1.5 text-[1.1875rem] leading-snug tracking-[-0.015em] text-white lg:text-[1.3125rem]">
              <span className="mr-2 font-medium text-cyan-300 tabular-nums">{String(start + i + 1).padStart(2, "0")}</span>
              {s.title}
            </h3>
            <p className="m-0 max-w-[32ch] text-[0.9375rem] leading-[1.65] text-[#a9b6d3]">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProcessSection() {
  return (
    <section
      aria-labelledby="process-title"
      className="section-y overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(42%_48%_at_50%_60%,rgb(40_100_170/0.28)_0%,transparent_100%),linear-gradient(180deg,#0b1533_0%,#0c1d42_100%)] text-on-dark"
    >
      <div className="container-site">
        <div className="mb-10 text-center lg:mb-14">
          <span className="eyebrow !mb-3 !text-cyan-300/90">Customer Teams & An Agile Services</span>
          <h2 id="process-title" className="m-0 text-white">Working Process For Services</h2>
        </div>
        <div className="grid items-center gap-7 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_460px_minmax(0,1fr)] xl:gap-x-20">
          <ProcessColumn start={0} className="order-2 lg:order-none" />
          <div className="relative order-1 mx-auto mb-6 aspect-square w-full max-w-[290px] sm:max-w-[380px] md:col-span-2 md:mb-0 lg:order-none lg:col-span-1 lg:max-w-none">
            <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible text-white/25">
              <circle cx="50" cy="50" r="50" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1.2 2" strokeLinecap="round" />
            </svg>
            <div aria-hidden className="absolute inset-[7%] rounded-full border border-white/[0.07] bg-white/[0.025]" />
            <div className="absolute inset-[13%] overflow-hidden rounded-full shadow-[0_28px_60px_-12px_rgb(2_8_24/0.7)] ring-1 ring-white/20">
              <Image src="/images/work1-2.jpg" alt="Aerial view of a container ship carrying cargo across the sea" fill sizes="(min-width: 1280px) 340px, 300px" className="object-cover object-[62%_50%]" />
              <span aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-40px_60px_-20px_rgb(8_18_40/0.45)]" />
            </div>
            {PROCESS.map((s, i) => {
              const rad = (ORBIT_ANGLES[i] * Math.PI) / 180;
              return (
                <span
                  key={s.title}
                  aria-hidden
                  className={cn(badgeClass, "absolute size-10 -translate-1/2 shadow-[0_6px_18px_rgb(2_8_24/0.45)] sm:size-12")}
                  style={{ left: `${50 + 50 * Math.cos(rad)}%`, top: `${50 + 50 * Math.sin(rad)}%` }}
                >
                  <s.icon className="size-[18px] sm:size-5" strokeWidth={1.75} />
                </span>
              );
            })}
          </div>
          <ProcessColumn start={3} className="order-3 lg:order-none" />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:mt-16">
          <QuoteTrigger className={buttonClass({ arrow: true })}>Get a Quote <ArrowDot /></QuoteTrigger>
          <a href={`tel:${SITE.phone.tel}`} className="inline-flex items-center gap-3 font-semibold text-white transition-colors hover:text-cyan-300">
            <IconTile icon={Phone} tone="dark" className="size-11" />{SITE.phone.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-navy text-on-dark [&_.eyebrow]:text-on-dark-accent [&_h2]:text-white">
      <div className="container-site">
        <SectionHeading id="why-title" eyebrow="Why Choose Us?" title="We Create Opportunity to Reach Potential." />
        <div className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {WHY_CHOOSE_US.map((w) => (
            <div key={w.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <IconTile icon={w.icon} tone="dark" className="mb-4" />
              <h3 className="mb-2 text-white">{w.title}</h3>
              <p className="m-0 text-[0.9375rem] text-on-dark-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VolumeSection() {
  return (
    <section id="volume" aria-labelledby="volume-title" className="section-y">
      <div className="container-site grid items-center gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        <div>
          <span className="eyebrow">Volume Conversion</span>
          <h2 id="volume-title" className="mb-4">Calculate your volumetric weight</h2>
          <p className="max-w-[62ch] text-xl text-muted">{VOLUME_INTRO}</p>
          <p aria-hidden className="mt-6 mb-0 font-display text-[clamp(3rem,2rem+4vw,5rem)] leading-none font-semibold tracking-[-0.04em] text-brand-100 [-webkit-text-stroke:1px_var(--color-brand)]">
            CM/KG
          </p>
        </div>
        <VolumeCalculator />
      </div>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section aria-labelledby="work-title" className="section-y bg-soft">
      <div className="container-site">
        <SectionHeading id="work-title" eyebrow="Our Portfolio" title="Explore Our Recent Work" />
        <div className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {PORTFOLIO.map((w) => (
            <figure key={w.title} className="relative m-0 aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src={w.image} alt={w.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgb(11_21_51/0.85),rgb(11_21_51/0)_55%)]" />
              <figcaption className="absolute inset-x-5 bottom-5 text-white">
                <small className="text-[0.8125rem] font-semibold tracking-[0.06em] text-on-dark-accent uppercase">Transportation</small>
                <h3 className="mt-1 mb-0 text-xl text-white">{w.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ soft, action = true }: { soft?: boolean; action?: boolean }) {
  return (
    <section aria-labelledby="reviews-title" className={cn("section-y", soft && "bg-soft")}>
      <div className="container-site">
        <SectionHeading
          id="reviews-title"
          eyebrow="Clients Reviews & Testimonials"
          title="What Client's say about Our Services"
          action={action ? sectionLink("/review", "Write a review") : undefined}
        />
        <div className="grid gap-6 min-[641px]:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className={cn(cardClass, "m-0 flex flex-col gap-6")}>
              <blockquote className="m-0 font-display text-xl leading-normal tracking-[-0.01em] text-navy before:mb-1 before:block before:text-[3.5rem] before:leading-[0.8] before:text-brand before:content-['“']">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 font-semibold text-navy">
                <Image src={t.image} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ eyebrow = "What We Provide", children }: { eyebrow?: string; children?: ReactNode }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-soft">
      <div className="container-site grid items-start gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="faq-title" className="mb-4">Benefits FAQ</h2>
          <p className="max-w-[62ch] text-xl text-muted">{FAQ_INTRO}</p>
          {children ?? <ButtonLink href="/contact" variant="ghost">Still have questions? Contact us</ButtonLink>}
        </div>
        <Faq items={FAQS} />
      </div>
    </section>
  );
}

export function BlogsSection() {
  return (
    <section aria-labelledby="blogs-title" className="section-y">
      <div className="container-site">
        <SectionHeading id="blogs-title" eyebrow="Blogs" title="Recent Articles" action={sectionLink("/blogs", "All articles")} />
        <div className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
          {BLOG_POSTS.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </section>
  );
}
