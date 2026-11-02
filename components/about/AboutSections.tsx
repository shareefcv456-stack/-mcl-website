import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Eye, Globe, Plane, Ship, Target, Truck } from "lucide-react";
import { ArrowDot, ArrowLabel, ButtonLink, buttonClass } from "@/components/ui/Button";
import { NetworkBlueprint } from "@/components/about/NetworkBlueprint";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { CountUp } from "@/components/ui/CountUp";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { SectionHeading } from "@/components/ui/Section";
import { Benefits, StatImage } from "@/components/home/Sections";
import { CATEGORIES, DELIVERED_STAT, PROCESS, VALUES } from "@/lib/content/home";
import { serviceHref } from "@/lib/content/services";
import { cn } from "@/lib/utils/cn";

/** A distant airliner in side view, nose to the right, about 64 × 26 units, with a contrail fading out behind it. */
function DistantPlane() {
  return (
    <svg viewBox="-300 -16 340 32" className="h-auto w-[clamp(180px,24vw,340px)]" aria-hidden>
      <defs>
        <linearGradient id="about-contrail" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d="M-296 1.5 L-33 0.4" stroke="url(#about-contrail)" strokeWidth="1.6" strokeLinecap="round" />
      <g fill="#1b2a4f">
        <path d="M-30 0 C-30 -2.2 -26 -3 -20 -3 L22 -3 C27 -3 30 -1.5 31 0 C30 1.5 27 2.6 22 2.6 L-20 2.6 C-26 2.6 -30 1.6 -30 0 Z" />
        <path d="M-27.5 -2 L-33 -12.5 L-29 -12.5 L-20.5 -2.6 Z" />
        <path d="M-25 0.6 L-31.5 3.4 L-29 3.4 L-21.5 0.6 Z" />
        <path d="M5 1.2 L-7 9 L-3 9 L11 1.2 Z" />
        <path d="M3 -2.4 L-4.5 -6.5 L-2 -6.5 L8.5 -2.4 Z" fillOpacity="0.7" />
      </g>
    </svg>
  );
}

// Faint air links between a few points of light in the hero's sky, drawn in one after another (.net-draw).
const HERO_LINKS = ["M30 120 Q 160 20, 300 70", "M300 70 Q 420 0, 560 40", "M300 70 Q 440 80, 580 125"];
const HERO_NODES: [number, number][] = [[30, 120], [300, 70], [560, 40], [580, 125]];

/** Full-width cinematic About hero: the photo, a living sky and sea over it, a distant airliner and the air links. */
export function AboutHero() {
  return (
    <section aria-labelledby="about-title" className="relative isolate flex min-h-[max(640px,92svh)] overflow-hidden bg-navy text-white">
      <div className="hero-camera absolute inset-0">
        <Image src="/images/about-ship.jpg" alt="Loaded container ship under way on open sea" fill preload sizes="100vw" className="hero-backdrop object-cover object-[70%_60%] min-[861px]:object-[60%_55%]" />
      </div>
      {/* Ambience for the still photo (there is no licensed footage yet): its own clouds drift across the sky, two
          ripple layers slide over the water and a glint passes. The ship itself does not move; that needs footage.
          All transform/opacity, paused off screen, still for reduced motion. */}
      <PauseOffscreen aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34%] overflow-hidden opacity-60 mix-blend-screen [mask-image:linear-gradient(180deg,#000_45%,transparent_100%)]">
          <div className="hero-clouds absolute inset-y-0 -left-[15%] w-[130%] bg-[url(/images/sky-clouds.webp)] bg-cover bg-center" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden opacity-60 mix-blend-screen [mask-image:linear-gradient(180deg,transparent_0%,#000_45%)]">
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%]" />
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%] opacity-55 [scale:-1_1]" />
        </div>
        <span className="hero-glint absolute bottom-[8%] left-[30%] h-[24%] w-[40%] bg-[radial-gradient(closest-side,rgb(85_184_242/0.16),transparent)] mix-blend-screen" />
        {/* The airliner crosses the sky on its own slow course; with reduced motion it simply holds its place. */}
        <div className="absolute top-[13%] left-[52%] min-[861px]:top-[16%]">
          <div className="about-plane">
            <DistantPlane />
          </div>
        </div>
        <svg viewBox="0 0 600 150" className="absolute top-[11%] right-[2%] hidden w-[46%] min-[641px]:block" fill="none">
          {HERO_LINKS.map((d, i) => (
            <path key={d} d={d} pathLength={1} className="net-draw" style={{ "--i": i } as CSSProperties} stroke="#fff" strokeOpacity={0.45} strokeWidth={1.1} strokeLinecap="round" />
          ))}
          {HERO_NODES.map(([x, y], i) => (
            <g key={x}>
              <circle cx={x} cy={y} r={7} className="net-node" style={{ "--i": i } as CSSProperties} stroke="#55b8f2" strokeWidth={1} />
              <circle cx={x} cy={y} r={2.8} fill="#fff" />
            </g>
          ))}
        </svg>
      </PauseOffscreen>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgb(7_27_58/0.92)_0%,rgb(7_27_58/0.78)_45%,rgb(7_27_58/0.3)_72%,rgb(7_27_58/0.2)_100%)] min-[861px]:bg-[linear-gradient(90deg,rgb(7_27_58/0.9)_0%,rgb(7_27_58/0.7)_34%,rgb(7_27_58/0.15)_60%,rgb(7_27_58/0)_74%),linear-gradient(0deg,rgb(7_27_58/0.6)_0%,rgb(7_27_58/0)_35%)]" />
      <div className="relative z-10 container-site flex flex-col justify-end pt-[140px] pb-[clamp(48px,8vh,96px)]">
        <nav aria-label="Breadcrumb" className="animate-enter">
          <ol className="mb-5 flex list-none flex-wrap gap-2 p-0 text-[0.8125rem]">
            <li className="after:ml-2 after:text-[#8b97b8] after:content-['/']">
              <Link href="/" className="-my-1 inline-block py-1 text-on-dark-accent hover:text-white">Home</Link>
            </li>
            <li aria-current="page" className="text-white">About Us</li>
          </ol>
        </nav>
        <h1 id="about-title" className="mb-5 max-w-[14ch] font-medium text-white">
          <span className="hero-word [--i:0]">Moving</span> <span className="hero-word [--i:1]">the</span>{" "}
          <span className="hero-word [--i:2]">World</span>{" "}
          <b className="hero-word bg-[linear-gradient(90deg,#fff,#9fd6f7)] bg-clip-text font-semibold text-transparent [--i:3]">Together.</b>
        </h1>
        <p className="mb-8 max-w-[52ch] animate-enter text-lg text-[#dfe4f2] [animation-delay:160ms] min-[641px]:text-xl">
          At MCL, we are more than a logistics company — we are your global partner, committed to delivering innovative,
          reliable and sustainable shipping solutions.
        </p>
        <div className="flex animate-enter flex-wrap items-center gap-x-4 gap-y-3 [animation-delay:240ms]">
          <QuoteTrigger className={buttonClass({ variant: "white", arrow: true })}>
            Get a Quote <ArrowDot variant="white" />
          </QuoteTrigger>
          <ButtonLink href="/services" variant="ghost-light">Our Services</ButtonLink>
        </div>
        <p className="mt-8 mb-0 max-w-[48ch] animate-enter border-l-2 border-[#55b8f2] pl-4 text-[0.9375rem] text-[#c9d0e4] [animation-delay:320ms]">
          Meem Continental Logistics (MCL) — your trusted partner in global logistics.
        </p>
      </div>
    </section>
  );
}

// Facts MCL already states: delivered goods (home), "over 150 countries" (Air Cargo), its three modes and categories.
const STATS = [
  { value: DELIVERED_STAT.value, label: DELIVERED_STAT.label },
  { value: "150+", label: "Countries we deliver to" },
  { value: "3", label: "Modes: land, sea and air" },
  { value: String(CATEGORIES.length), label: "Shipment categories" },
];

export function CompanyOverview() {
  return (
    <section aria-labelledby="who-title" className="section-y overflow-x-clip">
      <div className="container-site">
        <div className="grid items-center gap-[clamp(40px,5vw,80px)] min-[861px]:grid-cols-2">
          <StatImage src="/images/5.jpg" alt="MCL cargo operations" replay />
          <Reveal variant="stagger">
            <span className="eyebrow">Who we are</span>
            <h2 id="who-title" className="mb-4">Meem Continental Logistics (MCL)</h2>
            <p className="text-[1.0625rem] leading-[1.75]">
              MCL has been a pioneer in the logistics field for several years, offering top-notch transportation services to
              businesses worldwide. Our team of professionals is dedicated to providing reliable, efficient, and timely
              logistics solutions, ensuring your cargo reaches its destination safely and on time.
            </p>
            <Benefits />
          </Reveal>
        </div>
        <Reveal as="ul" variant="stagger" className="m-0 mt-[clamp(56px,7vw,96px)] grid list-none grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line p-0 min-[861px]:grid-cols-4">
          {STATS.map((s) => (
            <li key={s.label} className="bg-white px-5 py-6 min-[641px]:px-7 min-[641px]:py-8">
              <strong className="block font-display text-[clamp(2rem,1.6rem+1.6vw,3rem)] leading-none font-semibold text-navy">
                <CountUp value={s.value} delay={200} />
              </strong>
              <span className="mt-2 block text-[0.9375rem] text-muted">{s.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const PURPOSE = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Our mission is to be the most trusted and professional logistics provider, continually working towards enhancing customer satisfaction through innovative solutions and exceptional service.",
  },
  {
    // MCL has no separate published vision statement; this is its own stated belief from the original About copy.
    icon: Eye,
    title: "Our Vision",
    text: "At MCL, we believe in building long-lasting relationships with our clients by understanding their unique needs and delivering customized solutions.",
  },
];

/** Mission and Vision as two glass panels over a dimmed aerial of a ship at sea. */
export function MissionVision() {
  return (
    <section aria-labelledby="purpose-title" className="relative isolate overflow-hidden bg-navy py-[clamp(72px,9vw,128px)] text-on-dark">
      <div aria-hidden className="scroll-depth absolute -inset-y-10 inset-x-0 -z-10 [--depth:28px]">
        <Image src="/images/work1-2.jpg" alt="" fill sizes="100vw" className="object-cover object-center opacity-45" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_15%_10%,rgb(38_57_232/0.35),transparent_70%),linear-gradient(180deg,rgb(7_27_58/0.82),rgb(7_27_58/0.94))]" />
      <div className="container-site">
        <Reveal className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="eyebrow text-[#9fd6f7]">Our purpose</span>
          <h2 id="purpose-title" className="reveal-heading m-0 text-white">What we work towards</h2>
        </Reveal>
        <Reveal variant="stagger" className="grid grid-cols-1 gap-6 min-[861px]:grid-cols-2">
          {PURPOSE.map((p) => (
            <article key={p.title} className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-[clamp(28px,3.5vw,48px)] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] backdrop-blur-md transition duration-500 ease-smooth hover:-translate-y-1 hover:border-[#55b8f2]/50 hover:bg-white/[0.1]">
              <span aria-hidden className="absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(85_184_242/0.28),transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(145deg,#55b8f2,var(--color-brand))] text-white shadow-[0_14px_28px_-12px_rgb(38_57_232/0.8),inset_0_1px_0_rgb(255_255_255/0.4)]">
                <p.icon aria-hidden className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mb-3 text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)] text-white">{p.title}</h3>
              <p className="m-0 text-[1.0625rem] leading-[1.75] text-[#d3d9ea]">{p.text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * MCL publishes no dated company history, so instead of invented milestones the timeline follows a shipment
 * through MCL's own six working steps. The line fills as it scrolls past (.journey-fill, where supported).
 */
export function Journey() {
  return (
    <section aria-labelledby="journey-title" className="section-y overflow-x-clip">
      <div className="container-site">
        <SectionHeading id="journey-title" center eyebrow="The MCL journey" title="From booking to delivery" intro="Every shipment follows the same careful path with us." />
        <div className="journey relative mx-auto max-w-[960px]">
          <span aria-hidden className="absolute top-2 bottom-2 left-[23px] w-px bg-line min-[861px]:left-1/2">
            <span className="journey-fill absolute inset-0 origin-top bg-[linear-gradient(180deg,#55b8f2,var(--color-brand))]" />
          </span>
          <Reveal as="ol" variant="stagger" className="relative m-0 grid list-none gap-6 p-0 min-[861px]:gap-4">
            {PROCESS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4 min-[861px]:not-first:-mt-14 min-[861px]:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] min-[861px]:gap-8">
                <span className="relative z-10 grid size-12 place-items-center rounded-full border-4 border-white bg-[linear-gradient(145deg,#55b8f2,var(--color-brand))] text-white shadow-[0_10px_20px_-10px_rgb(38_57_232/0.8)] min-[861px]:col-start-2 min-[861px]:row-start-1 min-[861px]:size-14">
                  <s.icon aria-hidden className="size-5" strokeWidth={1.8} />
                </span>
                <article className={`rounded-2xl border border-line bg-white p-5 shadow-[0_18px_40px_-28px_rgb(11_21_51/0.45)] transition duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-100 min-[861px]:row-start-1 min-[861px]:p-6 ${i % 2 ? "min-[861px]:col-start-3" : "min-[861px]:col-start-1 min-[861px]:text-right"}`}>
                  <span className="mb-1 block text-[0.8125rem] font-semibold tracking-[0.08em] text-brand tabular-nums">STEP {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mb-1.5 text-[1.1875rem] leading-snug">{s.title}</h3>
                  <p className="m-0 text-[0.9375rem] text-muted">{s.text}</p>
                </article>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Our Values backdrop, "a global logistics world" (styles: .values-world in globals.css). Back to front: a pale sky whose
// light slowly breathes, two cloud banks drifting at different speeds, a wireframe globe turning as it rises over the
// sea horizon with air links lighting up across its face, a distant port on the horizon, and the sea itself, which the
// glass cards sit over. Each layer drifts a few pixels against the scroll (.scroll-depth). Everything is decorative,
// paused off screen and still for reduced motion; phones get a lighter version (no far clouds, port or card links).
// --vw-globe / --vw-horizon (on the section) size the globe and set where the sea horizon cuts it.
const GLOBE_R = 96;
/** A meridian as a half-ellipse bulging `k` units sideways (a cubic: control points 4/3 of the bulge). */
const meridian = (k: number) => `M0 ${-GLOBE_R} C ${k} ${-GLOBE_R}, ${k} ${GLOBE_R}, 0 ${GLOBE_R}`;
const MERIDIAN_SWEEP = [-128, -64, 0, 64, 128].map(meridian).join(";");
const PARALLELS = [-60, -30, 0, 30, 60].map((lat) => {
  const a = (lat * Math.PI) / 180;
  return { y: GLOBE_R * Math.sin(a), rx: GLOBE_R * Math.cos(a) };
});
// The heading sits over the globe's upper middle, so the network keeps to its flanks and to the band under the subtitle.
const GLOBE_NODES: [number, number][] = [[-60, -64], [-82, -22], [-62, 14], [58, -68], [82, -26], [64, 12], [-26, 22], [26, 20]];
const GLOBE_LINKS: [number, number][] = [[0, 1], [1, 2], [3, 4], [4, 5], [2, 6], [6, 7], [7, 5]];
/** An air link between two nodes, bowed away from the globe's centre like a great-circle arc. */
const arc = ([ax, ay]: [number, number], [bx, by]: [number, number]) => `M${ax} ${ay} Q ${((ax + bx) / 2) * 1.35} ${((ay + by) / 2) * 1.35 - 8}, ${bx} ${by}`;

function NetworkGlobe() {
  return (
    <svg viewBox="-115 -115 230 230" className="size-full overflow-visible" fill="none">
      <defs>
        <radialGradient id="vw-globe" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d4ebfb" />
          <stop offset="1" stopColor="#7cbcec" />
        </radialGradient>
        <radialGradient id="vw-atmosphere">
          <stop offset="0.8" stopColor="#55b8f2" stopOpacity="0.32" />
          <stop offset="1" stopColor="#55b8f2" stopOpacity="0" />
        </radialGradient>
        <clipPath id="vw-globe-clip"><circle r={GLOBE_R} /></clipPath>
      </defs>
      <circle r={114} fill="url(#vw-atmosphere)" />
      <circle r={GLOBE_R} fill="url(#vw-globe)" />
      <g clipPath="url(#vw-globe-clip)" stroke="#fff" strokeWidth={0.7}>
        {PARALLELS.map((p) => <ellipse key={p.y} cy={p.y} rx={p.rx} ry={p.rx * 0.16} strokeOpacity={0.55} />)}
        {/* Meridians sweep from one limb to the other, out of step, so the globe reads as slowly turning. */}
        <g className="motion-reduce:hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={meridian(0)} strokeOpacity={0}>
              <animate attributeName="d" values={MERIDIAN_SWEEP} dur="36s" begin={`${-i * 6}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0;0.6;0.6;0" keyTimes="0;0.2;0.8;1" dur="36s" begin={`${-i * 6}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
        <g className="hidden motion-reduce:inline" strokeOpacity={0.5}>
          {[-96, -40, 40, 96].map((k) => <path key={k} d={meridian(k)} />)}
        </g>
      </g>
      <circle r={GLOBE_R} stroke="#fff" strokeOpacity={0.9} strokeWidth={1.2} />
      {/* Phones show the plain turning globe: at that size the network would cross the heading. */}
      <g className="max-[640px]:hidden">
      {GLOBE_LINKS.map(([a, b], i) => (
        <path key={`${a}-${b}`} id={`vw-link-${i}`} d={arc(GLOBE_NODES[a], GLOBE_NODES[b])} pathLength={1} className="net-draw" style={{ "--i": i } as CSSProperties} stroke="var(--color-brand)" strokeOpacity={0.55} strokeWidth={1} strokeLinecap="round" />
      ))}
      {/* Points of light travelling a few of the links. */}
      <g className="motion-reduce:hidden">
        {[0, 3, 5, 6].map((i) => (
          <circle key={i} r={1.8} fill="#fff" stroke="#55b8f2" strokeWidth={0.8}>
            <animateMotion dur={`${5 + i}s`} begin={`${3 + i * 0.7}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0;1">
              <mpath href={`#vw-link-${i}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
      {GLOBE_NODES.map(([x, y], i) => (
        <g key={x}>
          <circle cx={x} cy={y} r={5.5} className="net-node" style={{ "--i": i } as CSSProperties} stroke="#55b8f2" strokeWidth={0.8} />
          <circle cx={x} cy={y} r={2.2} fill="var(--color-brand)" stroke="#fff" strokeWidth={0.8} />
        </g>
      ))}
      </g>
    </svg>
  );
}

/** A distant port on the horizon (viewBox 300 × 60, standing on y = 60): gantry cranes, container stacks, a berthed ship. */
function DistantPort({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 300 60" className={cn("h-auto w-full", flip && "-scale-x-100")} fill="#1d3e6e">
      {[[40, 30], [96, 36], [150, 28]].map(([x, h]) => (
        <g key={x}>
          <rect x={x} y={60 - h} width={2} height={h} />
          <rect x={x + 14} y={60 - h} width={2} height={h} />
          <rect x={x - 22} y={60 - h - 3} width={52} height={3} />
          <rect x={x + 6} y={60 - h - 9} width={6} height={6} />
          <path d={`M${x + 1} ${60 - h - 3} L${x + 9} ${60 - h - 14} L${x + 15} ${60 - h - 3}`} stroke="#1d3e6e" strokeWidth={1} fill="none" />
        </g>
      ))}
      {[[176, 12], [190, 18], [204, 9], [218, 15], [232, 6]].map(([x, h]) => <rect key={x} x={x} y={60 - h} width={13} height={h} />)}
      <path d="M0 52 H120 L114 60 H6 Z" />
      <rect x={14} y={44} width={12} height={8} />
    </svg>
  );
}

// Card links: from one point under the heading, a thin line fans out to each of the five cards (5 across only).
const CARD_LINKS = [100, 300, 500, 700, 900].map((x) => `M500 0 C 500 46, ${x} 26, ${x} 72`);

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="values-world section-y relative isolate overflow-hidden [--vw-globe:clamp(300px,40vw,540px)] [--vw-globe-top:clamp(28px,4vw,48px)] [--vw-horizon:calc(var(--vw-globe-top)+var(--vw-globe)*0.64)] bg-[linear-gradient(180deg,#e2f0fc_0%,#eef7ff_45%,#f7fbff_80%,#fff_100%)]">
      <PauseOffscreen aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="vw-light absolute -top-[20%] left-1/2 h-[80%] w-[90%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),rgb(255_255_255/0))]" />
        <div className="scroll-depth absolute inset-x-0 top-0 h-[46%] overflow-hidden opacity-45 [--depth:36px] [mask-image:linear-gradient(180deg,transparent,#000_25%,#000_60%,transparent)]">
          <div className="hero-clouds absolute inset-y-0 -left-[15%] w-[130%] bg-[url(/images/sky-clouds.webp)] bg-cover bg-center mix-blend-luminosity" />
        </div>
        <div className="scroll-depth absolute inset-x-0 top-[18%] hidden h-[30%] overflow-hidden opacity-30 [--depth:20px] [mask-image:linear-gradient(180deg,transparent,#000_40%,transparent)] min-[641px]:block">
          <div className="vw-clouds-far absolute inset-y-0 -left-[15%] w-[130%] bg-[url(/images/sky-clouds.webp)] bg-cover bg-center [scale:-1_1]" />
        </div>
        {/* The globe rises over the horizon; the sea below is drawn after it, so it hides the globe's lower part. */}
        <div className="absolute top-[var(--vw-globe-top)] left-1/2 size-[var(--vw-globe)] -translate-x-1/2">
          <div className="scroll-depth size-full [--depth:22px]"><NetworkGlobe /></div>
        </div>
        <div className="absolute inset-x-0 top-[var(--vw-horizon)] bottom-0">
          <div className="scroll-depth absolute inset-x-0 -top-[clamp(36px,4.2vw,60px)] hidden justify-between px-[2%] [--depth:8px] min-[641px]:flex">
            <div className="w-[clamp(200px,24vw,340px)] opacity-25"><DistantPort /></div>
            <div className="w-[clamp(200px,24vw,340px)] opacity-25"><DistantPort flip /></div>
          </div>
          <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(180deg,#000_55%,transparent)]">
            <Image src="/images/ocean-texture.jpg" alt="" fill sizes="100vw" className="object-cover object-top opacity-70 saturate-[0.8]" />
            <div className="vw-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%] opacity-40 mix-blend-screen" />
            {/* Distance haze: the sea pales toward the horizon and under the cards, a gradient, not a blur. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(234_245_255/0.75)_0%,rgb(234_245_255/0.35)_14%,rgb(247_251_255/0.6)_60%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/90" />
          </div>
        </div>
      </PauseOffscreen>
      <div className="container-site">
        <SectionHeading id="values-title" center eyebrow="What drives us" title="Our Values" intro="The principles that move us forward." />
        <PauseOffscreen aria-hidden className="pointer-events-none -mt-10 mb-2 hidden min-[1280px]:block">
          <svg viewBox="0 0 1000 72" preserveAspectRatio="none" className="h-[72px] w-full overflow-visible" fill="none">
            {CARD_LINKS.map((d, i) => (
              <g key={d}>
                <path id={`vw-card-${i}`} d={d} pathLength={1} className="net-draw" style={{ "--i": i } as CSSProperties} stroke="#55b8f2" strokeOpacity={0.7} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
                <circle r={2.4} fill="#fff" stroke="var(--color-brand)" strokeWidth={1} vectorEffect="non-scaling-stroke" className="motion-reduce:hidden" opacity={0}>
                  <animateMotion dur="3.2s" begin={`${2.5 + i * 0.45}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0;1"><mpath href={`#vw-card-${i}`} /></animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="3.2s" begin={`${2.5 + i * 0.45}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
            <circle cx={500} cy={0} r={4} fill="var(--color-brand)" stroke="#fff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </svg>
        </PauseOffscreen>
        <Reveal as="ul" variant="stagger" className="m-0 flex list-none flex-wrap justify-center gap-5 p-0 min-[1280px]:gap-6">
          {VALUES.map((v, i) => (
            <li key={v.title} className="w-full min-[540px]:w-[calc((100%-20px)/2)] min-[861px]:w-[calc((100%-40px)/3)] min-[1280px]:w-[calc((100%-96px)/5)]">
              <Tilt max={7} className="group h-full">
                <article className="relative h-full overflow-hidden rounded-3xl border border-white/80 bg-[linear-gradient(160deg,rgb(255_255_255/0.88),rgb(236_246_255/0.66))] p-6 shadow-[0_24px_50px_-30px_rgb(11_21_51/0.45),inset_0_1px_0_rgb(255_255_255)] backdrop-blur-md transition-[box-shadow,border-color,translate] duration-500 ease-smooth group-hover:-translate-y-1.5 group-hover:border-[#55b8f2]/60 group-hover:shadow-[0_30px_60px_-26px_rgb(38_57_232/0.45),0_0_0_4px_rgb(85_184_242/0.12)]">
                  <span aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full bg-[radial-gradient(closest-side,rgb(85_184_242/0.3),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span aria-hidden className="absolute top-5 right-6 font-display text-sm font-semibold text-brand/35 tabular-nums">0{i + 1}</span>
                  <span className="vw-icon relative mb-5 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(145deg,#7fd0fb,#55b8f2_30%,var(--color-brand)_85%)] text-white shadow-[0_16px_28px_-12px_rgb(38_57_232/0.75),inset_0_1px_0_rgb(255_255_255/0.6),inset_0_-4px_0_rgb(7_27_58/0.22)]">
                    <span aria-hidden className="absolute inset-x-2 top-1 h-1/3 rounded-full bg-white/25 blur-[2px]" />
                    <v.icon aria-hidden className="relative size-6 drop-shadow-[0_2px_2px_rgb(7_27_58/0.35)]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mb-2 text-xl leading-snug">{v.title}</h3>
                  <p className="m-0 text-[0.9375rem] leading-[1.6] text-ink/80">{v.text}</p>
                </article>
              </Tilt>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const NETWORK = [
  { icon: Plane, title: "Air Freight", text: "For time-sensitive shipments, the fastest and most efficient delivery.", href: serviceHref("air-freight-services") },
  { icon: Ship, title: "Sea Freight", text: "Cost-effective and secure shipping solutions for your cargo.", href: serviceHref("ocean-freight") },
  { icon: Truck, title: "Land Transport", text: "Reliable and efficient land transportation, delivering your cargo safely.", href: serviceHref("land-transportation") },
  { icon: Globe, title: "Global Network", text: "Convenient and reliable delivery to over 150 countries.", href: "/services" },
];

export function NetworkSection() {
  return (
    <section aria-labelledby="network-title" className="section-y overflow-x-clip">
      <div className="container-site">
        <SectionHeading id="network-title" eyebrow="Our network" title="Connected across air, sea and land" intro="Comprehensive transportation solutions across land, sea, and air, from the port to the doorstep." />
        <NetworkBlueprint />
        <Reveal as="ul" variant="stagger" className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {NETWORK.map((n) => (
            <li key={n.title}>
              <Link href={n.href} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_22px_44px_-30px_rgb(11_21_51/0.5)] transition duration-300 ease-smooth hover:-translate-y-1 hover:border-[#55b8f2]/50 hover:shadow-[0_28px_56px_-30px_rgb(38_57_232/0.45)]">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,#55b8f2,var(--color-brand))] transition-transform duration-500 ease-smooth group-hover:scale-x-100" />
                <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-[linear-gradient(145deg,#55b8f2,var(--color-brand)_80%)] text-white shadow-[0_12px_22px_-10px_rgb(38_57_232/0.7),inset_0_1px_0_rgb(255_255_255/0.4)]">
                  <n.icon aria-hidden className="size-5" strokeWidth={1.8} />
                </span>
                <span className="mb-1.5 block font-display text-lg font-semibold text-navy">{n.title}</span>
                <span className="mb-4 block text-[0.9375rem] leading-relaxed text-muted">{n.text}</span>
                <span className="mt-auto"><ArrowLabel>Learn more</ArrowLabel></span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
