import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { ArrowDot, ArrowLabel, ButtonLink, buttonClass } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Feature, IconTile, SectionHeading, cardClass } from "@/components/ui/Section";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { PostCard } from "@/components/blogs/PostCard";
import { VolumeCalculator } from "@/components/calculator/VolumeCalculator";
import {
  ABOUT_SUMMARY, BENEFITS, CATEGORIES, DELIVERED_STAT, FAQS, FAQ_INTRO, PORTFOLIO, PROCESS, TESTIMONIALS, VOLUME_INTRO, WHY_CHOOSE_US,
} from "@/lib/content/home";
import { SERVICES, serviceHref } from "@/lib/content/services";
import { BLOG_POSTS } from "@/lib/content/blogs";
import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { ScrollEntrance } from "@/components/ui/ScrollEntrance";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { FlipCard } from "@/components/ui/FlipCard";
import { ProcessBadges } from "@/components/home/ProcessBadges";
import { WorldDots } from "@/components/home/WorldDots";
import { CountUp } from "@/components/ui/CountUp";

const sectionLink = (href: string, label: string) => (
  <Link href={href} className="group -my-2.5 inline-block py-2.5"><ArrowLabel>{label}</ArrowLabel></Link>
);

/** `replay` counts the stat up and replays the entrance each time the picture scrolls back into view. */
export function StatImage({ src, alt, replay }: { src: string; alt: string; replay?: boolean }) {
  return (
    <Reveal variant="image" data-motion="from-left" repeat={replay} className="relative">
      <Tilt max={3} className="group relative aspect-[4/3.2] overflow-hidden rounded-3xl">
        <Image src={src} alt={alt} fill sizes="(min-width: 860px) 50vw, 100vw" className="object-cover transition-[scale] duration-700 ease-smooth group-hover:scale-[1.04]" />
      </Tilt>
      <div data-reveal-part className="absolute -bottom-6 left-3 rounded-2xl bg-brand px-[22px] py-[18px] text-white shadow-float md:-left-4">
        <strong className="block font-display text-4xl leading-none font-semibold">{replay ? <CountUp value={DELIVERED_STAT.value} /> : DELIVERED_STAT.value}</strong>
        <span className="text-[0.9375rem] text-[#dfe2ff]">{DELIVERED_STAT.label}</span>
      </div>
    </Reveal>
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
    <section className="about-intro section-y overflow-x-clip">
      <div className="container-site grid items-center gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
        <StatImage src="/images/about-ship.jpg" alt="Container ship sailing across open sea" replay />
        <Reveal variant="stagger" repeat>
          <span className="eyebrow">About MCL</span>
          <h2 className="mb-4">Meem Continental Logistics (MCL)</h2>
          <p className="text-muted">{ABOUT_SUMMARY}</p>
          {sectionLink("/about", "About Company")}
          <Benefits />
        </Reveal>
      </div>
    </section>
  );
}

/** A decorative shipping route: SVG path, width, dash, lap time (s) and the pin at its end. */
type Route = { d: string; width: number; dash: string; dur: number; pin: [number, number] };

/** Small arrows travelling a route (SVG animateMotion, so they follow the curve), `phases` apart within a lap. */
function RouteArrows({ href, dur, phases, opacity }: { href: string; dur: number; phases: number[]; opacity: number }) {
  return phases.map((phase) => (
    <path key={phase} d="M-4 -3.5 L4 0 L-4 3.5 Z" fill="var(--color-brand)" opacity={0}>
      <animateMotion dur={`${dur}s`} begin={`${-dur * phase}s`} repeatCount="indefinite" rotate="auto">
        <mpath href={href} />
      </animateMotion>
      <animate attributeName="opacity" values={`0;${opacity};${opacity};0`} keyTimes="0;0.12;0.88;1" dur={`${dur}s`} begin={`${-dur * phase}s`} repeatCount="indefinite" />
    </path>
  ));
}

/**
 * Decorative shipping routes with a pin at each end (Shipment Categories): dotted lines with small arrows travelling
 * along them and pins that pulse as an arrow arrives. Decorative only; all motion is hidden for reduced motion.
 * `id` must be unique on the page: the animations reference their path by it. `children` draws extra markers on top.
 */
function RouteLines({ id, routes, viewBox, preserveAspectRatio, className, children }: { id: string; routes: Route[]; viewBox: string; preserveAspectRatio?: string; className?: string; children?: ReactNode }) {
  return (
    <svg aria-hidden viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} fill="none" className={cn("pointer-events-none overflow-visible", className)}>
      {routes.map((r, i) => (
        <g key={r.d}>
          {/* A soft white line under the dashes keeps them readable over a photo. */}
          <path d={r.d} stroke="#fff" strokeOpacity={0.7} strokeWidth={r.width + 2.6} strokeLinecap="round" />
          <path id={`${id}-${i}`} d={r.d} stroke="var(--color-brand)" strokeOpacity={0.75} strokeWidth={r.width} strokeDasharray={r.dash} />
          {/* Two arrows per route, half a lap apart; the pin pulses each time one arrives. */}
          <g className="motion-reduce:hidden">
            <RouteArrows href={`#${id}-${i}`} dur={r.dur} phases={[0, 0.5]} opacity={0.85} />
            <circle cx={r.pin[0]} cy={r.pin[1]} fill="var(--color-brand)">
              <animate attributeName="r" values="3;14;14" keyTimes="0;0.6;1" dur={`${r.dur / 2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0" keyTimes="0;0.6;1" dur={`${r.dur / 2}s`} repeatCount="indefinite" />
            </circle>
          </g>
          <g className="route-pin">
            <circle cx={r.pin[0]} cy={r.pin[1] - 7} r={9} fill="#fff" fillOpacity={0.9} />
            <MapPin x={r.pin[0] - 6} y={r.pin[1] - 13} width={12} height={12} className="text-brand" />
          </g>
        </g>
      ))}
      {children}
    </svg>
  );
}

/** A service as a full-image card: photo, its mode tag, then title, a short excerpt and the link, over a navy shade. */
function ServiceShowcase({ service: s }: { service: (typeof SERVICES)[number] }) {
  const Icon = s.icon;
  return (
    <Link href={serviceHref(s.slug)} className="group relative isolate flex h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-white/12 p-6 text-white shadow-[0_30px_60px_-34px_rgb(0_8_24/0.9)] transition-[translate,border-color] duration-300 ease-smooth hover:-translate-y-1 hover:border-white/30 hover:text-white min-[1025px]:h-[420px]">
      <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1025px) 25vw, (min-width: 641px) 50vw, 100vw" className="-z-20 object-cover transition-[scale] duration-700 ease-smooth group-hover:scale-[1.05]" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(7_27_58/0.96)_0%,rgb(7_27_58/0.78)_36%,rgb(7_27_58/0.2)_64%,rgb(7_27_58/0.05)_100%)]" />
      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[0.8125rem] font-semibold backdrop-blur-md">
        <Icon aria-hidden className="size-4" strokeWidth={1.8} />{s.tag}
      </span>
      <h3 className="m-0 mb-2 text-[1.3125rem] leading-snug tracking-[-0.015em] text-white">{s.name}</h3>
      <p className="m-0 mb-5 line-clamp-3 text-[0.9375rem] leading-relaxed text-white/80">{s.excerpt}</p>
      <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#9fd6f7]">
        Explore service <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/**
 * Our Services: a deep-ocean section. The site's aerial photo of a container ship sits on the right under a navy shade
 * that keeps the heading clear, drifting a few pixels against the scroll; four full-image service cards follow. At the
 * foot, an ocean wave carries the navy down into the white of Shipment Categories, so the two read as one scene.
 */
export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="relative isolate overflow-hidden bg-[#071b3a] pt-[clamp(64px,5vw+40px,112px)] pb-[clamp(110px,8vw+70px,190px)] text-white">
      <PauseOffscreen aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="scroll-depth absolute -inset-y-4 right-0 w-full [--depth:14px] min-[1025px]:w-[70%]">
          <Image src="/images/work1-2.jpg" alt="" fill sizes="(min-width: 1025px) 70vw, 100vw" className="object-cover object-[65%_35%] opacity-75" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_27_58/0.82)_0%,rgb(7_27_58/0.6)_35%,rgb(7_27_58/0.88)_70%,#071b3a_100%)] min-[1025px]:bg-[linear-gradient(90deg,#071b3a_0%,rgb(7_27_58/0.92)_30%,rgb(7_27_58/0.45)_58%,rgb(7_27_58/0.35)_100%),linear-gradient(0deg,#071b3a_0%,rgb(7_27_58/0)_55%)]" />
        <span className="absolute top-[-10%] right-[10%] hidden h-[60%] w-[45%] bg-[radial-gradient(closest-side,rgb(85_184_242/0.16),transparent)] min-[1025px]:block" />
      </PauseOffscreen>
      <div className="container-site">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <span className="eyebrow text-[#9fd6f7]">Our Services</span>
            <h2 id="services-title" className="reveal-heading mb-3 text-white">Cargo services across air, sea and land</h2>
            <p className="m-0 text-[1.0625rem] text-[#c9d6ea]">Flexible freight solutions built around your business.</p>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[0.9375rem] font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 hover:text-white">
            View all services <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal variant="stagger" className="grid grid-cols-1 gap-5 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4 min-[1025px]:gap-6">
          {SERVICES.map((s) => <div key={s.slug}><ServiceShowcase service={s} /></div>)}
        </Reveal>
      </div>
      {/* The ocean wave into Shipment Categories: a translucent swell over a solid one in that section's white. */}
      <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[clamp(56px,7vw,110px)] w-full">
        <path d="M0 58 C 220 110, 470 6, 730 38 S 1190 104, 1440 46 V120 H0 Z" fill="#ffffff" fillOpacity="0.22" />
        <path d="M0 82 C 260 128, 520 30, 770 62 S 1230 118, 1440 74 V120 H0 Z" fill="#ffffff" />
      </svg>
    </section>
  );
}

/** Category card that opens the quote dialog pre-filled with its shipment category: the photo on top, the icon in a
 * soft circle over its lower edge, then the title and "Request a Quote" on a white-to-ice card. */
export function CategoryTile({ category: c, className }: { category: (typeof CATEGORIES)[number]; className?: string }) {
  return (
    <QuoteTrigger
      category={c.title}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e1eaf5] bg-white text-inherit shadow-[0_1px_2px_rgb(11_21_51/0.04),0_16px_36px_-26px_rgb(11_21_51/0.45)] transition-[translate,border-color,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:border-[#bcd6ef] hover:text-inherit hover:shadow-[0_24px_48px_-28px_rgb(38_57_232/0.4)]",
        className,
      )}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-soft">
        <Image src={c.image} alt="" fill sizes="(min-width: 1025px) 25vw, 50vw" className="object-cover transition-[scale] duration-700 ease-smooth group-hover:scale-[1.035]" />
      </span>
      <span className="relative flex flex-1 flex-col gap-2 bg-[linear-gradient(180deg,#ffffff,#f4f9fe)] px-4 pt-8 pb-4 sm:px-5 sm:pt-9 sm:pb-5">
        <span className="absolute -top-6 left-4 grid size-12 place-items-center rounded-full bg-[#eaf3fd] text-brand shadow-[0_8px_18px_-10px_rgb(11_21_51/0.45)] ring-4 ring-white transition-[background-color,color] duration-300 ease-smooth group-hover:bg-brand group-hover:text-white sm:left-5">
          <c.icon aria-hidden className="size-5" strokeWidth={1.8} />
        </span>
        <span className="font-display text-[0.9375rem] leading-snug font-semibold tracking-[-0.01em] text-navy sm:text-[1.0625rem]">{c.title}</span>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[0.8125rem] font-semibold text-brand">
          Request a Quote <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 ease-smooth group-hover:translate-x-[3px]" />
        </span>
      </span>
    </QuoteTrigger>
  );
}

// The Our Services routes carry on into this section: both come in from the top and left edges and end on the ship
// (one on the container deck, one at the hull). Drawn in the ship picture's own frame (its box is 662 × 420 at
// 1440px and the SVG crops like the photo's object-cover), so the pins stay on the ship as the box narrows.
// In the ship photo's own coordinates (viewBox 768 × 512; the photo and the drawing are both centred and cropped
// alike, so the pins stay on the ship at every size). One journey in two legs: from an origin pin on the wake up to
// the container deck, then on ahead of the bow to a port pin in open water. All above y ≈ 330, where the first row
// of cards begins on desktop.
const CATEGORY_ORIGIN: [number, number] = [140, 300];
const CATEGORY_ROUTES: Route[] = [
  { d: "M140 300 C 190 250, 270 215, 360 200", width: 1.6, dash: "4 6", dur: 7, pin: [360, 200] },
  { d: "M360 200 C 480 172, 620 186, 712 236", width: 1.6, dash: "4 6", dur: 9, pin: [712, 236] },
];

// Shipment Categories backdrop (styles: .cat-ocean in globals.css), in section coordinates (viewBox 1440 × 1000,
// cropped like a cover image). The ship scene owns the top right (about x > 780, y < 440), so nothing is drawn there.
const OCEAN_NODES: [number, number][] = [[60, 190], [430, 70], [190, 540], [650, 470], [1380, 580], [990, 880], [250, 950], [1410, 960]];
// [from, to, bow]: each route bows to one side of the straight line by `bow` units; `wide` routes are left out on phones.
const OCEAN_ROUTES: { a: number; b: number; bow: number; wide?: boolean }[] = [
  { a: 0, b: 1, bow: -70 }, { a: 0, b: 2, bow: 60, wide: true }, { a: 2, b: 3, bow: -50 }, { a: 3, b: 4, bow: 110 },
  { a: 2, b: 6, bow: -60, wide: true }, { a: 3, b: 5, bow: 70 }, { a: 5, b: 7, bow: -40, wide: true }, { a: 4, b: 5, bow: 60, wide: true },
];
const oceanRoute = ({ a, b, bow }: { a: number; b: number; bow: number }) => {
  const [[x1, y1], [x2, y2]] = [OCEAN_NODES[a], OCEAN_NODES[b]];
  const len = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1} ${y1} Q ${(x1 + x2) / 2 - ((y2 - y1) / len) * bow} ${(y1 + y2) / 2 + ((x2 - x1) / len) * bow}, ${x2} ${y2}`;
};
// Sea-floor contour lines across the lower half.
const CONTOURS = [560, 630, 700, 770, 840, 910].map((y, i) => `M-120 ${y} C 180 ${y - 34 + i * 6}, 420 ${y + 30}, 720 ${y} S 1240 ${y - 30 + i * 4}, 1560 ${y + 8}`);

function OceanBackdrop() {
  return (
    <PauseOffscreen aria-hidden className="cat-ocean pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {/* Light: a soft glow behind the ship and a broad, faint band of light drifting across the water. */}
      <span className="absolute -top-[10%] right-[-5%] hidden h-[70%] w-[60%] min-[1025px]:block bg-[radial-gradient(closest-side,rgb(255_255_255/0.85),rgb(214_238_255/0.35)_55%,transparent)]" />
      <span className="cat-light absolute top-[38%] left-[10%] h-[50%] w-[70%] bg-[radial-gradient(closest-side,rgb(165_235_255/0.22),transparent)]" />
      {/* A dotted world map behind the heading and cards, faint and fading at its edges (tablet and up). Centred with
          margins, not translate: .scroll-depth animates the translate property and would cancel it. */}
      <div className="scroll-depth absolute inset-x-0 top-[3%] mx-auto hidden w-[min(1180px,96%)] text-[#7aa8d4] opacity-35 [--depth:10px] [mask-image:radial-gradient(75%_70%_at_40%_40%,#000_50%,transparent)] min-[641px]:block">
        <WorldDots className="block h-auto w-full" />
      </div>
      {/* Both pattern layers fade out before the bottom edge, so nothing stops short at the seam with the next section. */}
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="scroll-depth absolute inset-0 size-full [--depth:18px] [mask-image:linear-gradient(180deg,#000_78%,transparent_94%)]" fill="none">
        <g className="cat-drift hidden min-[641px]:inline" stroke="#8db9df" strokeOpacity={0.18} strokeWidth={1.2}>
          {CONTOURS.map((d) => <path key={d} d={d} />)}
        </g>
      </svg>
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="scroll-depth absolute inset-0 size-full [--depth:8px] [mask-image:linear-gradient(180deg,#000_78%,transparent_94%)]" fill="none">
        {OCEAN_ROUTES.map((r, i) => (
          <path key={i} id={`cat-route-${i}`} d={oceanRoute(r)} pathLength={1} className={cn("cat-route", r.wide && "max-[640px]:hidden")} style={{ "--i": i } as CSSProperties} stroke="#6aa8d8" strokeOpacity={0.5} strokeWidth={1.2} strokeLinecap="round" />
        ))}
        {/* Small location markers travelling some of the routes, each on its own slow clock. */}
        {OCEAN_ROUTES.map((r, i) => (r.wide ? null : (
          <circle key={`m${i}`} r={3.2} fill="#ffffff" stroke="var(--color-brand)" strokeOpacity={0.6} strokeWidth={1.2} className="motion-reduce:hidden" opacity={0}>
            <animateMotion dur={`${9 + i * 1.5}s`} begin={`${1.5 + i}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0;1"><mpath href={`#cat-route-${i}`} /></animateMotion>
            <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.12;0.88;1" dur={`${9 + i * 1.5}s`} begin={`${1.5 + i}s`} repeatCount="indefinite" />
          </circle>
        )))}
        {OCEAN_NODES.map(([x, y], i) => (
          <g key={i} className={cn(i > 5 && "max-[640px]:hidden")}>
            <circle cx={x} cy={y} r={8} className="net-node" style={{ "--i": i * 0.6 } as CSSProperties} stroke="#6aa8d8" strokeOpacity={0.55} />
            <circle cx={x} cy={y} r={3.2} fill="#ffffff" stroke="#2c35d4" strokeOpacity={0.5} strokeWidth={1} />
          </g>
        ))}
      </svg>
    </PauseOffscreen>
  );
}

export function CategoriesSection() {
  return (
    // White with an ice-blue tint, starting in the same white Our Services ends in, so the two read as one surface. The
    // top padding is short: Our Services' own bottom padding already separates them.
    <section aria-labelledby="categories-title" className="relative isolate overflow-x-clip bg-[linear-gradient(180deg,#ffffff_0%,#f6fafe_30%,#eef5fc_70%,#e7f1fb_100%)] pt-[clamp(32px,2.5vw+16px,56px)] pb-[clamp(64px,5vw+40px,112px)]">
      <OceanBackdrop />
      <div className="container-site">
        <SectionHeading id="categories-title" eyebrow="What we ship" title="Shipment categories" intro="Select a category to request a quote." />
        {/* The ship scene, the section's focal point. Desktop: top right beside the heading (positioned against the
            section). Smaller screens: in the flow between the heading and the cards. The photo is shown clear and at
            full strength, with no haze over it, and the ship itself stays still; only its edges fade into the page (the
            right one after the bow, for when the scene is narrower than the screen).
            On arrival it fades in, then its route draws (.ship-scene / .route-draw, held until first seen). On desktop
            the water below the ship shimmers, and the layers part by a few pixels while scrolling
            past (.scroll-depth). All transform/opacity, paused off screen, still for reduced motion. */}
        <PauseOffscreen aria-hidden className="ship-scene pointer-events-none relative -z-10 -mx-4 -mt-8 mb-2 h-[clamp(200px,52vw,330px)] min-[641px]:mx-auto min-[641px]:max-w-[620px] min-[1025px]:absolute min-[1025px]:top-0 min-[1025px]:right-0 min-[1025px]:m-0 min-[1025px]:h-[420px] min-[1025px]:w-[46%] min-[1025px]:max-w-none">
          <div className="scroll-depth absolute inset-0 [--depth:6px] min-[1025px]:[--depth:16px]">
            {/* Short fades at the edges only, all clear of the ship (it starts about 15% in from the left); the right
                edge fades only below desktop, where the scene is narrower than the screen (on desktop it runs to the
                screen edge). The top stays clear for more than the scroll drift, so the section's top edge never shows
                a line. The effects share the mask so none of them spills onto the page. */}
            <div className="absolute inset-0 [mask-composite:intersect] [mask-repeat:no-repeat] [mask-image:linear-gradient(90deg,transparent_0%,rgb(0_0_0/0.55)_7%,#000_14%,#000_91%,transparent_100%),linear-gradient(0deg,transparent_0%,#000_20%),linear-gradient(180deg,transparent_18px,#000_60px)] min-[1025px]:[mask-image:linear-gradient(90deg,transparent_0%,rgb(0_0_0/0.55)_7%,#000_14%),linear-gradient(0deg,transparent_0%,#000_20%),linear-gradient(180deg,transparent_18px,#000_60px)]">
              <Image src="/images/about-ship.jpg" alt="" fill sizes="(min-width: 1025px) 46vw, (min-width: 641px) 620px, 100vw" className="object-cover" />
              {/* Sea: the hero's two swell layers sliding at different speeds over the open water and wake below the
                  ship, and a slow glint. Screen blend only brightens the ripples; nothing is laid over the ship. */}
              <div className="absolute inset-x-0 bottom-0 hidden h-[30%] overflow-hidden opacity-35 mix-blend-screen [mask-image:linear-gradient(180deg,transparent_0%,#000_45%)] min-[1025px]:block">
                <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%]" />
                <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%] opacity-55 [scale:-1_1]" />
              </div>
              <span className="hero-glint absolute bottom-[8%] left-[18%] hidden h-[16%] w-[36%] bg-[radial-gradient(closest-side,rgb(165_243_252/0.16),transparent)] mix-blend-screen min-[1025px]:block" />
            </div>
            {/* The route draws itself in once, after the ship fades in, revealing its pins left to right; then its
                arrows keep travelling and each pin glows as one arrives. Same layer as the ship, so the pins stay on it. */}
            <RouteLines id="category-route" routes={CATEGORY_ROUTES} viewBox="0 0 768 512" preserveAspectRatio="xMidYMid slice" className="route-draw absolute inset-0 size-full">
              <g className="route-pin">
                <circle cx={CATEGORY_ORIGIN[0]} cy={CATEGORY_ORIGIN[1] - 7} r={9} fill="#fff" fillOpacity={0.9} />
                <MapPin x={CATEGORY_ORIGIN[0] - 6} y={CATEGORY_ORIGIN[1] - 13} width={12} height={12} className="text-brand" />
              </g>
            </RouteLines>
          </div>
        </PauseOffscreen>
        {/* Cards fade up in a stagger as they enter, each picture settling from a slight zoom. */}
        <Reveal as="ul" variant="stagger" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-5 min-[1025px]:grid-cols-4 min-[1025px]:gap-6">
          {CATEGORIES.map((c) => (
            <li key={c.title}><Tilt max={3} className="h-full"><CategoryTile category={c} /></Tilt></li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const badgeClass = "grid shrink-0 place-items-center rounded-full bg-[#0f2550] text-cyan-300 ring-1 ring-cyan-300/35";

function ProcessColumn({ start, className }: { start: number; className?: string }) {
  return (
    <Reveal as="ol" variant="stagger" start={start + 1} className={cn("m-0 grid list-none gap-7 p-0 lg:grid-rows-3 lg:items-center lg:gap-0 lg:self-stretch", className)}>
      {PROCESS.slice(start, start + 3).map((s, i) => (
        <li key={s.title} data-step={start + i + 1} className="flex gap-4">
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
    </Reveal>
  );
}

export function ProcessSection() {
  return (
    <section
      aria-labelledby="process-title"
      className="section-y overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(42%_48%_at_50%_60%,rgb(40_100_170/0.28)_0%,transparent_100%),linear-gradient(180deg,#0b1533_0%,#0c1d42_100%)] text-on-dark"
    >
      <div className="container-site">
        <Reveal className="mb-10 text-center lg:mb-14">
          <span className="eyebrow !mb-3 !text-cyan-300/90">Customer Teams & An Agile Services</span>
          <h2 id="process-title" className="m-0 text-white">Working Process For Services</h2>
        </Reveal>
        <div className="grid items-center gap-7 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_460px_minmax(0,1fr)] xl:gap-x-20">
          <ProcessColumn start={0} className="order-2 lg:order-none" />
          <Reveal variant="orbit" className="relative order-1 mx-auto mb-[200px] aspect-square sm:mb-6 w-full max-w-[290px] sm:max-w-[380px] md:col-span-2 md:mb-0 lg:order-none lg:col-span-1 lg:max-w-none">
            {/* The dashed ring turns very slowly. It rotates as a plain <div> (which the compositor can animate) rather than
                as SVG, and pauses off screen. */}
            <PauseOffscreen aria-hidden className="orbit-drift absolute inset-0">
              <svg aria-hidden viewBox="0 0 100 100" className="size-full overflow-visible text-white/25 drop-shadow-[0_0_5px_rgb(103_232_249/0.45)]">
                <circle cx="50" cy="50" r="50" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1.2 2" strokeLinecap="round" />
              </svg>
            </PauseOffscreen>
            <div aria-hidden className="absolute inset-[7%] rounded-full border border-white/[0.07] bg-white/[0.025]" />
            <div className="absolute inset-[13%] overflow-hidden rounded-full shadow-[0_28px_60px_-12px_rgb(2_8_24/0.7)] ring-1 ring-white/20">
              <Image src="/images/work1-2.jpg" alt="Aerial view of a container ship carrying cargo across the sea" fill sizes="(min-width: 1280px) 340px, 300px" className="object-cover object-[62%_50%]" />
              <span aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-40px_60px_-20px_rgb(8_18_40/0.45)]" />
            </div>
            <ProcessBadges badgeClass={badgeClass} />
          </Reveal>
          <ProcessColumn start={3} className="order-3 lg:order-none" />
        </div>
        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:mt-16">
          <QuoteTrigger className={buttonClass({ arrow: true })}>Get a Quote <ArrowDot /></QuoteTrigger>
          <a href={`tel:${SITE.phone.tel}`} className="inline-flex items-center gap-3 font-semibold text-white transition-colors hover:text-cyan-300">
            <IconTile icon={Phone} tone="dark" className="size-11" />{SITE.phone.label}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// Where the scroll-linked entrance runs (must match the media query around .why-cards in globals.css).
const WHY_CARDS_MEDIA = "(min-width: 641px)";

/**
 * Why Choose Us: six medium-width cards staggered left/right. Tablets and up: two columns of cards (about 48% wide) that
 * share a narrow central band, odd cards on the left and even cards on the right set a little lower, so each right card
 * overlaps its left partner along that band and the corner of the next left card. The edge facing the band has extra
 * padding, so an overlapping card only ever covers padding, never text. Cards slide in from their own side and fade up
 * as they are scrolled into view (ScrollEntrance, tied to the scroll position), later cards over earlier ones; the
 * newest card that has fully arrived is highlighted. Phones: a plain column. Normal page flow, so the next section
 * always follows straight on. Layout in globals.css (.why-cards).
 */
export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="section-y overflow-x-clip bg-soft">
      <div className="container-site">
        <SectionHeading id="why-title" center eyebrow="Why Choose Us?" title="We Create Opportunity to Reach Potential." />
        <ScrollEntrance media={WHY_CARDS_MEDIA}>
          <ol className="why-cards m-0 list-none p-0">
            {WHY_CHOOSE_US.map((w, i) => (
              <li key={w.title} data-card style={{ "--i": i, "--row": Math.floor(i / 2) + 1 } as CSSProperties}>
                <article className="rounded-3xl border border-line bg-white p-6 shadow-[0_18px_44px_-28px_rgb(11_21_51/0.45)] transition-[border-color,box-shadow] duration-500 ease-smooth">
                  <div className="mb-3 flex items-center gap-3.5">
                    <IconTile icon={w.icon} className="size-11 rounded-xl" />
                    <h3 className="m-0 min-w-0 text-[clamp(1.0625rem,0.95rem+0.4vw,1.3125rem)] leading-tight">{w.title}</h3>
                  </div>
                  <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted">{w.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </ScrollEntrance>
      </div>
    </section>
  );
}

/**
 * Home page: the volumetric weight calculator and the benefits FAQ side by side (stacked on small screens). Keeps the
 * #volume and #faq anchors of the two sections it replaces; the standalone FaqSection is still used on Contact.
 */
export function VolumeFaqSection() {
  return (
    // scroll-mt keeps both headings clear of the fixed navbar when reached through #volume or #faq.
    <section id="volume" aria-labelledby="volume-title" className="section-y scroll-mt-24">
      {/* Desktop: the two columns share two rows (subgrid), so the calculator and the FAQ list start on the same
          line however long each intro is. Each column fades up as it enters (stagger reveal). */}
      <Reveal variant="stagger" className="container-site grid grid-cols-1 gap-x-[clamp(40px,5vw,72px)] gap-y-16 min-[861px]:grid-cols-2 min-[861px]:gap-y-9">
        <div className="grid content-start gap-8 min-[861px]:row-span-2 min-[861px]:grid-rows-subgrid">
          <div>
            <span className="eyebrow">Volume Conversion</span>
            <h2 id="volume-title" className="mb-4 text-[clamp(1.875rem,1.4rem+1.5vw,2.625rem)]">Calculate your volumetric weight</h2>
            <p className="m-0 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-muted">{VOLUME_INTRO}</p>
          </div>
          {/* self-start: keep the card its natural height when open FAQ answers make the row taller. On desktop it
              stays in view (clear of the floating navbar) while the longer FAQ column scrolls past, then releases at
              the end of the section. */}
          <div className="self-start min-[861px]:sticky min-[861px]:top-28">
            <VolumeCalculator />
          </div>
        </div>
        <div id="faq" className="grid scroll-mt-28 content-start gap-8 min-[861px]:row-span-2 min-[861px]:grid-rows-subgrid">
          <div>
            <span className="eyebrow">What We Provide</span>
            <h2 id="faq-title" className="mb-4 text-[clamp(1.875rem,1.4rem+1.5vw,2.625rem)]">Benefits FAQ</h2>
            <p className="m-0 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-muted">{FAQ_INTRO}</p>
          </div>
          <div>
            <Faq items={FAQS} variant="panel" />
            {/* May wrap to two lines on the narrowest phones (about 340px and below) rather than run past the edge. */}
            <ButtonLink href="/contact" arrow className="mt-7 max-w-full text-left whitespace-normal! leading-tight!">Still have questions? Contact us</ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section aria-labelledby="work-title" className="section-y bg-soft">
      <div className="container-site">
        <SectionHeading id="work-title" eyebrow="Our Portfolio" title="Explore Our Recent Work" />
        <Reveal variant="stagger" data-image="wipe" className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {PORTFOLIO.map((w) => (
            <FlipCard
              key={w.title}
              label={w.title}
              axis="x"
              trigger="hover"
              faceClassName="aspect-[3/4] overflow-hidden rounded-3xl"
              front={
                <figure className="group relative m-0 size-full">
                  <Image src={w.image} alt={w.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]" />
                  {/* Navy only behind the caption; the rest of the photo is untouched. */}
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgb(11_21_51/0.72),rgb(11_21_51/0.25)_22%,rgb(11_21_51/0)_42%)]" />
                  <figcaption className="absolute inset-x-5 bottom-5 text-white [text-shadow:0_1px_8px_rgb(11_21_51/0.45)]">
                    <small className="text-[0.8125rem] font-semibold tracking-[0.06em] text-on-dark-accent uppercase">Transportation</small>
                    <h3 className="mt-1 mb-0 text-xl text-white">{w.title}</h3>
                  </figcaption>
                </figure>
              }
              back={
                <div className="relative isolate flex size-full flex-col justify-end gap-4 p-6 text-white">
                  <Image src={w.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="-z-10 object-cover" />
                  {/* The photo stays recognisable on the back too: a light navy veil at the top, deepening behind the
                      copy and buttons at the bottom, with a royal-blue glow in the corner. */}
                  <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(110%_55%_at_0%_100%,rgb(44_53_212/0.45),transparent_70%),linear-gradient(0deg,rgb(11_21_51/0.9)_0%,rgb(11_21_51/0.7)_38%,rgb(11_21_51/0.18)_72%,rgb(11_21_51/0.1)_100%)]" />
                  <div>
                    <small className="text-[0.8125rem] font-semibold tracking-[0.06em] text-on-dark-accent uppercase">Transportation</small>
                    <h3 className="mt-1 mb-0 text-xl text-white">{w.title}</h3>
                  </div>
                  <div className="grid gap-2.5">
                    <QuoteTrigger category={w.title} className={buttonClass({ variant: "white", size: "sm", className: "self-start" })}>Request a Quote</QuoteTrigger>
                    <Link href="/services" className="group -my-2.5 inline-block self-start py-2.5 text-white hover:text-white"><ArrowLabel>Explore our services</ArrowLabel></Link>
                  </div>
                </div>
              }
            />
          ))}
        </Reveal>
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
        <Reveal variant="stagger" className="grid gap-6 min-[641px]:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className={cn(cardClass, "m-0 flex flex-col gap-6 transition-[border-color,box-shadow] duration-300 ease-smooth hover:border-transparent hover:shadow-card")}>
              <blockquote className="m-0 font-display text-xl leading-normal tracking-[-0.01em] text-navy before:mb-1 before:block before:text-[3.5rem] before:leading-[0.8] before:text-brand before:content-['“']">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 font-semibold text-navy">
                <Image src={t.image} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
                {t.name}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function FaqSection({ eyebrow = "What We Provide", children }: { eyebrow?: string; children?: ReactNode }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-soft">
      <Reveal variant="stagger" className="container-site grid items-start gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="faq-title" className="mb-4">Benefits FAQ</h2>
          <p className="max-w-[62ch] text-xl text-muted">{FAQ_INTRO}</p>
          {children ?? <ButtonLink href="/contact" variant="ghost">Still have questions? Contact us</ButtonLink>}
        </div>
        <Faq items={FAQS} />
      </Reveal>
    </section>
  );
}

export function BlogsSection() {
  return (
    <section aria-labelledby="blogs-title" className="section-y">
      <div className="container-site">
        <SectionHeading id="blogs-title" eyebrow="Blogs" title="Recent Articles" action={sectionLink("/blogs", "All articles")} />
        <Reveal variant="stagger" data-image="clip" className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
          {BLOG_POSTS.map((p) => <PostCard key={p.slug} post={p} />)}
        </Reveal>
      </div>
    </section>
  );
}
