import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  center,
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  center?: boolean;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-12 flex flex-wrap items-end gap-6", center ? "justify-center text-center" : "justify-between")}>
      <div className={cn("max-w-[640px]", center && "mx-auto")}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Tag id={id} className="mb-3">{title}</Tag>
        {intro && <p className="m-0 text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function IconTile({ icon: Icon, tone = "brand", className }: { icon: LucideIcon; tone?: "brand" | "accent" | "dark"; className?: string }) {
  const tones = {
    brand: "bg-brand-50 text-brand",
    accent: "bg-accent-50 text-accent",
    dark: "bg-[rgb(127_138_255/0.15)] text-on-dark-accent",
  };
  return (
    <span className={cn("grid size-12 shrink-0 place-items-center rounded-[14px]", tones[tone], className)}>
      <Icon aria-hidden className="size-5" strokeWidth={1.8} />
    </span>
  );
}

/** Icon + title + text row used for benefits. */
export function Feature({ icon, title, text, tone }: { icon: LucideIcon; title: string; text: string; tone?: "brand" | "accent" }) {
  return (
    <div className="flex gap-4">
      <IconTile icon={icon} tone={tone} />
      <div>
        <h3 className="mb-1.5 text-xl">{title}</h3>
        <p className="m-0 text-[0.9375rem] text-muted">{text}</p>
      </div>
    </div>
  );
}

export const cardClass = "rounded-3xl border border-line bg-white p-6";
export const cardHoverClass = "transition duration-200 hover:-translate-y-[3px] hover:border-transparent hover:shadow-card";
