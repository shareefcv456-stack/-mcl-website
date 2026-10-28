import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

export interface Crumb {
  label: string;
  href: string;
}

/** Navy page header used by every inner page: breadcrumb, H1, optional lead and chips. */
export function PageBanner({
  title,
  crumbs = [],
  lead,
  image,
  chips,
  children,
}: {
  title: string;
  crumbs?: Crumb[];
  lead?: ReactNode;
  image?: string;
  chips?: string[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pt-[150px] pb-16 text-on-dark">
      {image && <Image src={image} alt="" fill loading="eager" sizes="100vw" className="object-cover opacity-35" />}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_21_51/0.95),rgb(11_21_51/0.55))]" />
      <div className="relative container-site">
        <nav aria-label="Breadcrumb" className="animate-enter">
          <ol className="mb-4 flex list-none flex-wrap gap-2 p-0 text-[0.8125rem]">
            {[{ label: "Home", href: "/" }, ...crumbs].map((c) => (
              <li key={c.href} className="after:ml-2 after:text-[#6b7699] after:content-['/']">
                <Link href={c.href} className="text-on-dark-accent hover:text-white">{c.label}</Link>
              </li>
            ))}
            <li aria-current="page" className="text-white">{title}</li>
          </ol>
        </nav>
        <h1 className="mb-3 animate-enter text-[length:var(--text-banner)] text-white [animation-delay:80ms]">{title}</h1>
        {lead && <p className="m-0 max-w-[60ch] animate-enter [animation-delay:160ms]">{lead}</p>}
        {chips && (
          <ul className="mt-6 flex animate-enter list-none flex-wrap gap-2 p-0 [animation-delay:240ms]">
            {chips.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[0.8125rem] font-semibold text-white">
                <Check aria-hidden className="size-3.5 text-on-dark-accent" />{c}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  );
}
