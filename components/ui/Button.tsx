import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "white" | "ghost" | "ghost-light";

const VARIANTS: Record<Variant, string> = {
  primary: "border-transparent bg-brand text-white hover:bg-brand-700 hover:text-white",
  white: "border-transparent bg-white text-navy hover:bg-[#eef0f7] hover:text-navy",
  ghost: "border-line bg-transparent text-navy hover:bg-soft hover:text-navy",
  "ghost-light": "border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
};
const DOTS: Record<Variant, string> = {
  primary: "bg-white text-brand",
  white: "bg-navy text-white",
  ghost: "bg-navy text-white",
  "ghost-light": "bg-white text-navy",
};

export interface ButtonStyle {
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
  /** Adds the round arrow badge used on primary calls to action. */
  arrow?: boolean;
  className?: string;
}

export function buttonClass({ variant = "primary", size = "md", block, arrow, className }: ButtonStyle = {}) {
  return cn(
    "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border font-semibold leading-none transition active:translate-y-px disabled:cursor-progress disabled:opacity-60",
    size === "md" ? "min-h-12 px-[22px] text-[0.9375rem]" : "min-h-10 px-4 text-[0.9375rem]",
    arrow && "pr-1.5",
    block && "w-full",
    VARIANTS[variant],
    className,
  );
}

export function ArrowDot({ variant = "primary" }: { variant?: Variant }) {
  return (
    <span className={cn("grid size-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5", DOTS[variant])}>
      <ArrowRight aria-hidden className="size-[18px]" />
    </span>
  );
}

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

type LinkProps = ButtonStyle & { href: string; children: ReactNode } & Omit<ComponentProps<"a">, "href" | "className">;

/** Button-styled link; uses next/link for internal routes. */
export function ButtonLink({ href, children, variant, size, block, arrow, className, ...rest }: LinkProps) {
  const cls = buttonClass({ variant, size, block, arrow, className });
  const content = (
    <>
      {children}
      {arrow && <ArrowDot variant={variant} />}
    </>
  );
  return isInternal(href) ? (
    <Link href={href} className={cls} {...rest}>{content}</Link>
  ) : (
    <a href={href} className={cls} {...rest}>{content}</a>
  );
}

type ButtonProps = ButtonStyle & ComponentProps<"button">;

export function Button({ variant, size, block, arrow, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, size, block, arrow, className })} {...rest}>
      {children}
      {arrow && <ArrowDot variant={variant} />}
    </button>
  );
}

/** Small text link with a sliding arrow ("To Know More →"). */
export function ArrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold", className)}>
      {children}
      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-[3px]" />
    </span>
  );
}
