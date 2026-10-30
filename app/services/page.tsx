import { PageBanner } from "@/components/layout/PageBanner";
import { SupportBand } from "@/components/layout/SupportBand";
import { ServiceStack } from "@/components/services/ServiceStack";
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
      <section aria-label="Our services" className="section-y bg-soft">
        <div className="container-site max-w-[1120px]">
          <ServiceStack services={SERVICES} />
        </div>
      </section>
      <SupportBand />
    </>
  );
}
