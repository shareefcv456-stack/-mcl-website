import { PageBanner } from "@/components/layout/PageBanner";
import { SupportBand } from "@/components/layout/SupportBand";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SERVICES } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "MCL cargo services: air, sea, Lakshadweep and land cargo.",
  path: "/services",
  image: "/images/work1-2.jpg",
});

export default function ServicesPage() {
  return (
    <>
      <PageBanner title="Services" lead="Air, sea, Lakshadweep and land cargo — choose a service to see what's included." image="/images/work1-2.jpg" />
      <section className="section-y">
        <div className="container-site grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
          {SERVICES.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </section>
      <SupportBand />
    </>
  );
}
