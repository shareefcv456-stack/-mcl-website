"use client";

import { Suspense, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Package, Phone, X } from "lucide-react";
import { ArrowDot, buttonClass } from "@/components/ui/Button";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { NAV, SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils/cn";

/** Which nav item a path belongs to (detail pages highlight their listing). */
function activeHref(pathname: string | null) {
  if (!pathname) return null;
  if (pathname.startsWith("/service")) return "/services";
  if (pathname.startsWith("/blog")) return "/blogs";
  if (pathname.startsWith("/career")) return "/career";
  return pathname.replace(/\/$/, "") || "/";
}

function NavItems({ pathname, variant, onNavigate }: { pathname: string | null; variant: "bar" | "drawer"; onNavigate?: () => void }) {
  const active = activeHref(pathname);
  return NAV.map(({ label, href }) => {
    const current = href === active;
    return (
      <li key={href}>
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={current ? "page" : undefined}
          className={cn(
            variant === "bar"
              ? "block rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink transition-colors duration-200 ease-smooth hover:bg-soft hover:text-navy"
              : "flex items-center justify-between border-b border-line px-1 py-3.5 text-[1.0625rem] font-medium text-navy",
            current && (variant === "bar" ? "bg-brand-50 text-brand hover:bg-brand-50 hover:text-brand" : "text-brand"),
          )}
        >
          {label}
          {variant === "drawer" && <ArrowRight aria-hidden className="size-5" />}
        </Link>
      </li>
    );
  });
}

/** Reads the pathname for the active state; suspends safely during prerendering. */
function ActiveNavItems(props: { variant: "bar" | "drawer"; onNavigate?: () => void }) {
  return <NavItems pathname={usePathname()} {...props} />;
}

function Nav(props: { variant: "bar" | "drawer"; onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavItems pathname={null} {...props} />}>
      <ActiveNavItems {...props} />
    </Suspense>
  );
}

const Logo = ({ className, eager }: { className?: string; eager?: boolean }) => (
  <Image src="/images/logo-mark.png" alt="MCL logo" width={250} height={236} loading={eager ? "eager" : "lazy"} className={cn("h-[52px] w-auto", className)} />
);

/**
 * The logo links home. From any other page Next.js navigates and starts at the top by itself; on the home page a link
 * to "/" does nothing, so scroll back to the hero (and drop any #section from the address). Modified clicks (new tab,
 * new window) are left to the browser.
 */
function backToTop(e: MouseEvent<HTMLAnchorElement>) {
  if (location.pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (location.hash) history.pushState(null, "", "/");
  scrollTo({ top: 0 });
}

export function Header() {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const close = () => drawerRef.current?.close();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-[clamp(16px,4vw,40px)] py-3">
      <nav aria-label="Main" className="mx-auto flex max-w-[1200px] items-center gap-6 rounded-full border border-line/80 bg-white py-2 pr-2 pl-4 shadow-card">
        <Link href="/" aria-label="MCL – Meem Continental Logistics, home" onClick={backToTop} className="flex shrink-0 items-center">
          <Logo eager className="max-[480px]:h-[42px]" />
        </Link>
        <ul className="mx-auto hidden list-none gap-0.5 p-0 min-[1081px]:flex">
          <Nav variant="bar" />
        </ul>
        <div className="ml-auto flex shrink-0 items-center gap-2 min-[1081px]:ml-0">
          <Link href="/tracking" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[0.9375rem] font-semibold text-navy transition-colors duration-200 ease-smooth hover:bg-soft hover:text-navy min-[1081px]:inline-flex">
            <Package aria-hidden className="size-5" />
            Track
          </Link>
          <QuoteTrigger className={buttonClass({ arrow: true, className: "max-[480px]:hidden" })}>
            Get a Quote <ArrowDot />
          </QuoteTrigger>
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => drawerRef.current?.showModal()}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-white text-navy min-[1081px]:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </nav>

      <dialog
        ref={drawerRef}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(360px,88vw)] max-w-none animate-slide-in bg-white p-0 min-[1081px]:hidden"
      >
        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <Logo className="h-10" />
            <button type="button" aria-label="Close menu" onClick={close} className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-navy hover:bg-soft">
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ul className="drawer-items m-0 list-none p-0">
            <Nav variant="drawer" onNavigate={close} />
          </ul>
          <div className="mt-auto grid gap-2.5">
            <QuoteTrigger onClick={close} className={buttonClass({ block: true })}>Get a Quote</QuoteTrigger>
            <a href={`tel:${SITE.phone.tel}`} className={buttonClass({ variant: "ghost", block: true })}>
              <Phone aria-hidden className="size-5" />
              {SITE.phone.label}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
