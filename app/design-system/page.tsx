import type { ReactNode } from "react";
import { Globe, Plane } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { Alert } from "@/components/ui/Alert";
import { ArrowLabel, Button, ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Field, inputClass } from "@/components/ui/Field";
import { IconTile, cardClass } from "@/components/ui/Section";
import { CategoryTile } from "@/components/home/Sections";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CATEGORIES } from "@/lib/content/home";
import { SERVICES } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Design System",
  description: "MCL design tokens and components.",
  path: "/design-system",
  noindex: true,
});

const SWATCHES = [
  ["brand", "#2C35D4", "Primary — sampled from the MCL logo"],
  ["brand-700", "#2229B0", "Primary hover"],
  ["brand-50", "#EEF0FF", "Tint"],
  ["accent", "#6A38D9", "Purple secondary, used sparingly"],
  ["navy", "#0B1533", "Headings, dark surfaces"],
  ["ink", "#2A3350", "Body text"],
  ["muted", "#5B6480", "Secondary text"],
  ["soft", "#F5F7FB", "Alternate sections"],
  ["line", "#E3E6EF", "Borders"],
  ["success", "#12805C", "Success"],
  ["danger", "#C42B2B", "Errors"],
  ["warn-50", "#FFF6E5", "Not-connected / not-sent notices"],
];

const Block = ({ title, children, note }: { title: string; children?: ReactNode; note?: string }) => (
  <section className="border-t border-line py-8 first:border-0 first:pt-0">
    <h2 className="mb-2">{title}</h2>
    {note && <p className="mb-6 text-muted">{note}</p>}
    {children}
  </section>
);

export default function DesignSystemPage() {
  return (
    <>
      <PageBanner title="MCL Design System" lead="Tokens and components used across every page. Tokens live in app/globals.css (@theme); components in /components. Internal reference — not linked from public navigation." />
      <div className="section-y container-site">
        <Block title="Colour" note="Tailwind theme colours, e.g. bg-brand, text-navy, border-line.">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {SWATCHES.map(([name, hex, use]) => (
              <div key={name} className="overflow-hidden rounded-2xl border border-line text-[0.8125rem]">
                <i className="block h-[72px]" style={{ background: hex }} />
                <div className="px-3 py-2.5"><b className="block text-navy">{name}</b>{hex} · {use}</div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography" note="Inter Tight (display) + Inter (body), self-hosted with next/font. Fluid sizes via clamp().">
          <p className="m-0 font-display text-[length:var(--text-h1)] leading-tight font-semibold tracking-[-0.035em] text-navy">H1 — Your Global Logistics Partner.</p>
          <p className="font-display text-[length:var(--text-h2)] font-semibold tracking-[-0.03em] text-navy">H2 — Working Process For Services</p>
          <p className="font-display text-[length:var(--text-h3)] font-semibold text-navy">H3 — Air Cargo Services</p>
          <p className="text-xl text-muted">Lead — Delivering Excellence in Land, Sea, and Air Cargo Transportation.</p>
          <p>Body 17px / 1.65 — At MCL, we prioritize customer satisfaction and strive to deliver excellence in every shipment.</p>
          <span className="eyebrow">Eyebrow label</span>
        </Block>

        <Block title="Spacing & layout" note="Tailwind's 4px scale. Container 1200px with a 16–40px fluid gutter (container-site); sections pad 64–112px (section-y). Grids collapse 4 → 2 → 1; split layouts stack below 768–860px; the nav becomes a drawer below 1081px.">
          <div className="flex flex-wrap items-end gap-3">
            {[1, 2, 4, 6, 8, 12, 16, 24].map((n) => (
              <div key={n} className="text-center text-xs text-muted">
                <span className="mb-1 block h-6 bg-brand" style={{ width: n * 4 }} />{n * 4}px
              </div>
            ))}
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button arrow>Primary + arrow</Button>
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Sending…</Button>
            <ButtonLink href="/services" className="group" variant="ghost"><ArrowLabel>Text link</ArrowLabel></ButtonLink>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 rounded-2xl bg-navy p-6">
            <Button variant="white" arrow>White + arrow</Button>
            <Button variant="ghost-light">Ghost light</Button>
          </div>
        </Block>

        <Block title="Form fields & states" note="Errors are linked to inputs with aria-describedby and announced; inputs get aria-invalid.">
          <div className="grid gap-6 md:grid-cols-3">
            <Field id="ds-default" label="Default" required><input id="ds-default" className={inputClass} placeholder="Placeholder" /></Field>
            <Field id="ds-error" label="Error" required error="Enter a valid email address, e.g. name@example.com.">
              <input id="ds-error" className={inputClass} defaultValue="name@" aria-invalid aria-describedby="ds-error-err" />
            </Field>
            <Field id="ds-hint" label="With hint" hint="You'll find this number on your booking receipt.">
              <input id="ds-hint" className={inputClass} placeholder="MCL12345678" aria-describedby="ds-hint-hint" />
            </Field>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Alert tone="success" title="Success">Only shown when a real email provider accepts the message.</Alert>
            <Alert tone="error" title="Error">Please fix the highlighted fields.</Alert>
            <Alert tone="info" title="Info">Neutral status.</Alert>
            <Alert tone="warn" title="Not sent — online delivery isn't set up yet.">Shown while no backend is connected.</Alert>
          </div>
        </Block>

        <Block title="Cards & icons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard service={SERVICES[0]} />
            <div className={cardClass}>
              <IconTile icon={Globe} className="mb-4" />
              <h3 className="mb-2">Feature card</h3>
              <p className="m-0 text-[0.9375rem] text-muted">Icon tile, title and short copy. Dark variant inside navy sections.</p>
            </div>
            <div className={`${cardClass} flex flex-wrap content-start gap-3`}>
              <IconTile icon={Plane} />
              <IconTile icon={Plane} tone="accent" />
              <span className="rounded-2xl bg-navy p-0"><IconTile icon={Plane} tone="dark" /></span>
            </div>
            <CategoryTile category={CATEGORIES[1]} className="aspect-auto! min-h-[260px]" />
          </div>
        </Block>

        <Block title="Accordion" note="Native <details>: keyboard accessible, no client JavaScript.">
          <div className="max-w-[720px]">
            <Faq items={[{ question: "First item (open by default)", answer: "Answer text." }, { question: "Second item", answer: "Answer text." }]} />
          </div>
        </Block>

        <Block title="Shared components" note="Header (floating bar, active page, Track + Get a Quote), mobile drawer and quote dialog (native <dialog>: focus trap, Escape, focus return), footer, page banner, sidebar cards, support band and WhatsApp button are shared React components used by every page." />
      </div>
    </>
  );
}
