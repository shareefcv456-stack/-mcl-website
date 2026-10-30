import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { PlaneArt, RouteArtDefs, ShipArt } from "@/components/home/RouteArt";
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
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { ScrollEntrance } from "@/components/ui/ScrollEntrance";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { FlipCard } from "@/components/ui/FlipCard";
import { ProcessBadges } from "@/components/home/ProcessBadges";
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

/** A vehicle that travels one route: its illustration (drawn facing +x, see RouteArt) and where it is parked, and at
 * what angle (the route's direction there), when motion is reduced. `sway` rocks it gently (± degrees) as it goes;
 * `scale` [start, end] grows or shrinks it over the lap (an airliner climbing away); `wake` trails moving foam. */
type Mover = { Art: () => ReactNode; at: [x: number, y: number, angle: number]; sway?: number; scale?: [number, number]; wake?: boolean };

/** The easing every vehicle and its route highlight share, so the two stay exactly together. */
const LAP_EASE = { calcMode: "spline", keyTimes: "0;1", keySplines: "0.45 0 0.55 1" } as const;

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
 * Decorative shipping routes with a pin at each end. Decorative only; all motion is hidden for reduced motion.
 * - Default (Shipment Categories): dotted lines with small arrows travelling along them and pins that pulse as an
 *   arrow arrives.
 * - With `movers` (Our Services, About): each route is a soft periwinkle line with blue dots flowing along it
 *   (.route-flow), a faint arrow showing the direction of travel, static pins, and one vehicle illustration per route
 *   that travels the exact path, turning with it, easing out of the origin and into the destination, and fading out
 *   and back in at the ends so each lap starts cleanly. Reduced motion shows each vehicle parked at its `at` point.
 * `id` must be unique on the page: the animations reference their path by it. `children` draws extra markers on top.
 */
function RouteLines({ id, routes, movers, viewBox, preserveAspectRatio, className, children }: { id: string; routes: Route[]; movers?: Mover[]; viewBox: string; preserveAspectRatio?: string; className?: string; children?: ReactNode }) {
  return (
    <svg aria-hidden viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} fill="none" className={cn("pointer-events-none overflow-visible", className)}>
      {movers && <RouteArtDefs />}
      {routes.map((r, i) => {
        const mover = movers?.[i];
        return (
          <g key={r.d}>
            {mover ? (
              <>
                {/* A soft white glow under each line keeps it crisp over the sea texture. */}
                <path d={r.d} stroke="#fff" strokeOpacity={0.75} strokeWidth={4} strokeLinecap="round" />
                <path id={`${id}-${i}`} d={r.d} stroke="var(--color-on-dark-accent)" strokeOpacity={0.75} strokeWidth={1.25} />
                <path d={r.d} className="route-flow" stroke="var(--color-brand)" strokeOpacity={0.5} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="0.5 8.5" />
                <g className="motion-reduce:hidden">
                  {/* The stretch already travelled lights up behind the vehicle: a cyan line drawn from the origin up to
                      it (pathLength 1, same easing as the vehicle), fading with it at the ends of the lap. */}
                  <path d={r.d} pathLength={1} stroke="#67e8f9" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 1" opacity={0}>
                    <animate attributeName="stroke-dashoffset" values="1;0" dur={`${r.dur}s`} repeatCount="indefinite" {...LAP_EASE} />
                    <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.08;0.92;1" dur={`${r.dur}s`} repeatCount="indefinite" />
                  </path>
                  {/* Half a lap away from the vehicle, so the two never meet. */}
                  <RouteArrows href={`#${id}-${i}`} dur={r.dur} phases={[0.5]} opacity={0.55} />
                  {/* The destination pin sends out one soft ring as the vehicle arrives (the last 12% of its lap). */}
                  <circle cx={r.pin[0]} cy={r.pin[1]} fill="var(--color-on-dark-accent)">
                    <animate attributeName="r" values="4;4;16" keyTimes="0;0.88;1" dur={`${r.dur}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0;0.55;0" keyTimes="0;0.88;0.9;1" dur={`${r.dur}s`} repeatCount="indefinite" />
                  </circle>
                </g>
                <g className="motion-reduce:hidden" opacity={0}>
                  <animateMotion dur={`${r.dur}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" {...LAP_EASE}>
                    <mpath href={`#${id}-${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur={`${r.dur}s`} repeatCount="indefinite" />
                  {/* A soft cyan glow travels under the vehicle, lighting the route as it passes. */}
                  <ellipse rx={30} ry={15} fill="url(#route-art-glow)" />
                  <g>
                    {mover.sway && <animateTransform attributeName="transform" type="rotate" values={`${-mover.sway};${mover.sway};${-mover.sway}`} dur="3.4s" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite" additive="sum" />}
                    {mover.scale && <animateTransform attributeName="transform" type="scale" values={mover.scale.join(";")} dur={`${r.dur}s`} repeatCount="indefinite" additive="sum" {...LAP_EASE} />}
                    {/* Foam peeling off both sides of the stern and streaming back (dashes flowing away from the hull). */}
                    {mover.wake && (
                      <path d="M-27 -5 Q-40 -10 -58 -14 M-27 5 Q-40 10 -58 14 M-28 0 L-52 0" stroke="#fff" strokeOpacity={0.85} strokeWidth={1.1} strokeLinecap="round" strokeDasharray="3 4">
                        <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.7s" repeatCount="indefinite" />
                      </path>
                    )}
                    <mover.Art />
                  </g>
                </g>
                <g className="hidden motion-reduce:inline" transform={`translate(${mover.at[0]} ${mover.at[1]}) rotate(${mover.at[2]})`}>
                  <mover.Art />
                </g>
              </>
            ) : (
              <>
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
              </>
            )}
            <circle cx={r.pin[0]} cy={r.pin[1] - 7} r={9} fill="#fff" fillOpacity={0.9} />
            <MapPin x={r.pin[0] - 6} y={r.pin[1] - 13} width={12} height={12} className="text-brand" />
          </g>
        );
      })}
      {children}
    </svg>
  );
}

// Both routes leave the same origin pin: the airliner flies the upper route, the container ship sails the lower one,
// at different speeds, each turning to face along its curve. `at` is each route's midpoint and direction there
// (worked out from the Béziers), where they are parked for reduced motion.
const SERVICE_ROUTES: Route[] = [
  { d: "M60 190 C 140 110, 260 40, 400 30", width: 1.2, dash: "4 6", dur: 7, pin: [400, 30] },
  { d: "M60 190 C 200 150, 360 120, 560 110", width: 1, dash: "3 6", dur: 12, pin: [560, 110] },
];
const SERVICE_MOVERS: Mover[] = [
  // The airliner climbs away from the origin: a little larger at take-off, smaller as it gains height and distance.
  { Art: PlaneArt, at: [208, 84, -26.6], scale: [1.15, 0.78] },
  { Art: ShipArt, at: [288, 139, -9.5], sway: 1.6, wake: true },
];

/** The Our Services route scene (airliner on the upper route, container ship on the lower, both from one origin pin),
 * also shown on About. Pauses while off screen. `id` must be unique on the page. */
export function RouteScene({ id, className, svgClassName }: { id: string; className?: string; svgClassName?: string }) {
  return (
    <PauseOffscreen aria-hidden className={cn("pointer-events-none", className)}>
      <RouteLines id={id} routes={SERVICE_ROUTES} movers={SERVICE_MOVERS} viewBox="0 0 600 220" className={svgClassName}>
        <circle cx={60} cy={190} r={9} fill="#fff" fillOpacity={0.9} />
        <MapPin x={54} y={176} width={12} height={12} className="text-brand" />
      </RouteLines>
    </PauseOffscreen>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="section-y relative isolate overflow-hidden bg-[radial-gradient(50%_45%_at_80%_0%,rgb(44_53_212/0.07),transparent_70%),linear-gradient(180deg,var(--color-soft)_0%,#fff_100%)]">
      {/* Ocean: an aerial sea texture (cropped from the site's own work1-2.jpg; mirrored so its deep water lies on the
          right, behind the routes) across the top of the section, under a
          white veil that keeps the heading bright (strongest on the left behind the text on desktop, even on smaller
          screens) and fading out at the top edge and well above the cards, which keep their own white surfaces. */}
      {/* The sea is alive but quiet (all transform/opacity, paused off screen, still for reduced motion): the water
          drifts very slowly sideways like a current (the hero's camera drift), and on desktop two shimmer layers slide
          over the deep water on the right with a slow glint of light. While scrolling past, the whole ocean drifts a
          few pixels against the page (.scroll-depth). Its lower part fades out by mask, so it meets the section's own
          background with no seam whatever colour that is. */}
      <PauseOffscreen aria-hidden className="scroll-depth pointer-events-none absolute inset-x-0 top-0 -z-20 h-[620px] overflow-hidden [--depth:12px] [mask-image:linear-gradient(180deg,#000_55%,transparent_96%)] min-[1025px]:h-[560px]">
        <div className="hero-camera absolute inset-0">
          <Image src="/images/ocean-texture.jpg" alt="" fill sizes="100vw" quality={75} className="-scale-x-100 object-cover object-[40%_50%]" />
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[62%] overflow-hidden opacity-40 mix-blend-screen [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent_0%,#000_45%),linear-gradient(180deg,transparent_0%,#000_22%,#000_55%,transparent_85%)] min-[1025px]:block">
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%]" />
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%] opacity-55 [scale:-1_1]" />
        </div>
        <span className="hero-glint absolute top-[18%] left-[45%] hidden h-[30%] w-[38%] bg-[radial-gradient(closest-side,rgb(165_243_252/0.22),transparent)] mix-blend-screen min-[1025px]:block" />
        {/* Low clouds seen from above, drifting slowly across the sea under the airliner's route, so it reads as flying
            over them. A few soft, separate banks (not a haze): the water stays clear between them. */}
        <div className="hero-clouds absolute top-[4%] right-[-8%] h-[58%] w-[72%] bg-[radial-gradient(22%_26%_at_18%_62%,rgb(255_255_255/0.6),transparent_70%),radial-gradient(16%_18%_at_30%_48%,rgb(255_255_255/0.45),transparent_70%),radial-gradient(20%_20%_at_70%_22%,rgb(255_255_255/0.5),transparent_70%),radial-gradient(14%_14%_at_82%_30%,rgb(255_255_255/0.38),transparent_70%),radial-gradient(18%_16%_at_52%_80%,rgb(255_255_255/0.32),transparent_70%)]" />
        {/* White only where the heading sits: across the top on small screens (the routes below it stay on clear water),
            and on the left on desktop, gone by the middle so the sea under the routes is at full strength. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.9)_0%,rgb(255_255_255/0.78)_38%,rgb(255_255_255/0.12)_62%,rgb(255_255_255/0)_75%)] min-[1025px]:bg-[linear-gradient(90deg,rgb(255_255_255/0.92)_0%,rgb(255_255_255/0.82)_30%,rgb(255_255_255/0.22)_50%,rgb(255_255_255/0)_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-soft)_0%,rgb(245_247_251/0)_16%)]" />
      </PauseOffscreen>
      {/* A soft dotted field behind the routes, fading out toward the heading and the cards. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(44_53_212/0.13)_1.1px,transparent_1.4px)] [background-size:14px_14px] [mask-image:radial-gradient(38%_32%_at_72%_18%,#000,transparent)]" />
      <div className="container-site">
        <SectionHeading id="services-title" eyebrow="Our Services" title="Cargo services across air, sea and land" intro="Flexible freight solutions built around your business."
          // A soft white pill keeps the link legible where it sits over the sea on desktop.
          action={<span className="inline-block rounded-full bg-white/85 px-4 py-2 shadow-[0_6px_18px_-10px_rgb(11_21_51/0.35)] backdrop-blur-sm">{sectionLink("/services", "View all services")}</span>} />
        {/* Desktop: beside the heading, over the sea (positioned against the section). Smaller screens: in the flow
            between the heading and the cards, scaled to the column. One element either way. */}
        <RouteScene id="service-route" className="relative -z-10 mx-auto -mt-8 mb-4 max-w-[520px] min-[1025px]:absolute min-[1025px]:top-[56px] min-[1025px]:right-0 min-[1025px]:m-0 min-[1025px]:w-[52%] min-[1025px]:max-w-none" svgClassName="block w-full min-[1025px]:max-w-[680px]" />
        {/* Each card leans slightly toward the pointer (mouse only; Tilt sits inside the revealed element so the
            entrance animation and the tilt never fight over the transform). */}
        <Reveal variant="stagger" data-image="clip" className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {SERVICES.map((s) => <div key={s.slug}><Tilt max={3} className="h-full"><ServiceCard service={s} showcase /></Tilt></div>)}
        </Reveal>
      </div>
    </section>
  );
}

/** Image card that opens the quote dialog pre-filled with its shipment category. */
export function CategoryTile({ category: c, className }: { category: (typeof CATEGORIES)[number]; className?: string }) {
  return (
    <QuoteTrigger
      category={c.title}
      className={cn(
        "group relative isolate flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[20px] p-3.5 text-white shadow-[0_14px_34px_-20px_rgb(11_21_51/0.55)] ring-1 ring-navy/5 transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:text-white hover:shadow-[0_22px_44px_-18px_rgb(44_53_212/0.45)] sm:p-5 min-[641px]:min-h-[220px] min-[1025px]:min-h-0",
        className,
      )}
    >
      <Image src={c.image} alt="" fill sizes="(min-width: 1025px) 25vw, (min-width: 641px) 33vw, 50vw"
        className="-z-20 object-cover transition-[scale] duration-700 ease-smooth group-hover:scale-[1.06]" />
      {/* Navy only where the title sits; the top two-thirds of the photo is left clear. */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(11_21_51/0.84)_0%,rgb(11_21_51/0.5)_30%,rgb(11_21_51/0.12)_52%,rgb(11_21_51/0)_66%)]" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(44_53_212/0.28)_0%,rgb(44_53_212/0)_55%)] opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100" />
      <span className="grid size-10 place-items-center rounded-xl bg-white/95 text-brand shadow-[0_6px_16px_-8px_rgb(11_21_51/0.45)] ring-1 ring-white/60 transition-[background-color,color,scale] duration-300 ease-smooth group-hover:scale-105 group-hover:bg-brand group-hover:text-white sm:size-11">
        <c.icon aria-hidden className="size-5" strokeWidth={1.8} />
      </span>
      <span className="flex items-end justify-between gap-3">
        <span>
          <span className="mb-1.5 block font-display text-base leading-tight font-semibold tracking-[-0.01em] [text-shadow:0_1px_10px_rgb(11_21_51/0.5)] sm:text-lg">{c.title}</span>
          <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#c9ccff]">
            Request a Quote <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 ease-smooth group-hover:translate-x-[3px]" />
          </span>
        </span>
        <span aria-hidden className="hidden size-11 shrink-0 -translate-x-1.5 place-items-center rounded-full bg-brand opacity-0 ring-2 ring-white/80 transition-[opacity,translate] duration-300 ease-smooth group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 min-[641px]:grid">
          <ArrowRight className="size-[18px]" />
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

export function CategoriesSection() {
  return (
    // White to soft down the page, like the sections around it (Our Services ends in white, so the edge is seamless).
    // Clipped sideways only, so the sky can rise into the empty bottom padding of Our Services above.
    <section aria-labelledby="categories-title" className="section-y relative isolate overflow-x-clip bg-[linear-gradient(180deg,#fff_0%,var(--color-soft)_100%)]">
      {/* Dotted texture: behind the ship's routes and, more faintly, down the left beside the heading. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(11_21_51/0.07)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_55%_at_70%_10%,#000,transparent),radial-gradient(28%_40%_at_4%_30%,rgb(0_0_0/0.7),transparent)]" />
      {/* Sky: real daylight sky and clouds (sky-clouds.webp, cut from the top of the ship photo, so the two skies match),
          drifting slowly, with a soft patch of sunlight. It rises 56px above the section into the bottom padding of Our
          Services (a short 40px fade, so the cards above lead straight into it with no white band) and fades out above
          the cards. Small screens:
          across the top, under a light veil behind the heading. Desktop: the right of the page only, fading out by
          mask toward the heading, so the left stays clean white with no wash over it. While scrolling past it drifts a
          little slower than the ship (.scroll-depth), for depth. */}
      <PauseOffscreen aria-hidden className="scroll-depth pointer-events-none absolute inset-x-0 -top-14 -z-20 h-[436px] overflow-hidden [--depth:-8px] [mask-image:linear-gradient(180deg,transparent_0%,#000_40px,#000_62%,transparent_100%)] min-[641px]:h-[496px] min-[1025px]:h-[536px] min-[1025px]:[mask-composite:intersect] min-[1025px]:[mask-image:linear-gradient(180deg,transparent_0%,#000_40px,#000_62%,transparent_100%),linear-gradient(90deg,transparent_24%,#000_52%)]">
        <div className="hero-clouds absolute inset-y-0 -left-[15%] w-[130%] bg-[url(/images/sky-clouds.webp)] bg-cover bg-[50%_40%]" />
        <span className="absolute -top-[30%] right-[14%] size-[520px] bg-[radial-gradient(closest-side,rgb(255_247_222/0.5),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.7)_0%,rgb(255_255_255/0.5)_50%,rgb(255_255_255/0)_85%)] min-[1025px]:hidden" />
      </PauseOffscreen>
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
              <circle cx={CATEGORY_ORIGIN[0]} cy={CATEGORY_ORIGIN[1] - 7} r={9} fill="#fff" fillOpacity={0.9} />
              <MapPin x={CATEGORY_ORIGIN[0] - 6} y={CATEGORY_ORIGIN[1] - 13} width={12} height={12} className="text-brand" />
            </RouteLines>
          </div>
        </PauseOffscreen>
        {/* Cards fade up in a stagger as they enter, each picture settling from a slight zoom. */}
        <Reveal as="ul" variant="stagger" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 min-[641px]:grid-cols-3 min-[1025px]:auto-rows-[212px] min-[1025px]:grid-cols-4 min-[1025px]:gap-5">
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
      <Reveal variant="stagger" className="container-site grid gap-x-[clamp(40px,5vw,72px)] gap-y-16 min-[861px]:grid-cols-2 min-[861px]:gap-y-9">
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
            <ButtonLink href="/contact" arrow className="mt-7">Still have questions? Contact us</ButtonLink>
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
