import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { SupportBand } from "@/components/layout/SupportBand";
import { QuoteCard, ServicesListCard, WithSidebar } from "@/components/layout/Aside";
import { OfferingCard } from "@/components/services/OfferingCard";
import { Prose } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/Section";
import { SERVICES, getService, serviceHref } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

// Content pages: fully static. Unknown slugs render (and are cached) as a real 404 instead of a streamed 200.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service/[slug]">) {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({ title: service.name, description: service.lede.slice(0, 150), path: serviceHref(service.slug), image: service.image });
}

export default async function ServicePage({ params }: PageProps<"/service/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();

  return (
    <>
      <PageBanner title={service.heading} crumbs={[{ label: "Services", href: "/services" }]} image={service.image} chips={service.highlights} />
      <WithSidebar aside={<><ServicesListCard current={serviceHref(service.slug)} /><QuoteCard /></>}>
        <Prose blocks={[{ type: "paragraph", text: service.lede, lede: true }, ...service.body]} />
      </WithSidebar>
      <section aria-labelledby="offerings-title" className="section-y bg-soft">
        <div className="container-site">
          <SectionHeading id="offerings-title" eyebrow={service.heading} title={service.offeringsTitle} />
          <div className="grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
            {service.offerings.map((o) => <OfferingCard key={o.title} offering={o} />)}
          </div>
        </div>
      </section>
      <SupportBand />
    </>
  );
}
