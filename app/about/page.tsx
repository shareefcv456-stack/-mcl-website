import { PageBanner } from "@/components/layout/PageBanner";
import { SupportBand } from "@/components/layout/SupportBand";
import { Benefits, StatImage, WhyChooseUs } from "@/components/home/Sections";
import { IconTile, SectionHeading, cardClass } from "@/components/ui/Section";
import { VALUES } from "@/lib/content/home";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "About Us",
  description: "About Meem Continental Logistics (MCL) – our mission, values and why customers choose us.",
  path: "/about",
  image: "/images/container-ship.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About Us" lead="Meem Continental Logistics (MCL) — your trusted partner in global logistics." image="/images/container-ship.jpg" />

      <section className="section-y overflow-x-clip">
        <div className="container-site grid items-center gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
          <Reveal variant="stagger">
            <span className="eyebrow">Who we are</span>
            <h2 className="mb-4">Meem Continental Logistics (MCL)</h2>
            <p>
              MCL has been a pioneer in the logistics field for several years, offering top-notch transportation services to
              businesses worldwide. Our team of professionals is dedicated to providing reliable, efficient, and timely
              logistics solutions, ensuring your cargo reaches its destination safely and on time.
            </p>
            <p>
              Our mission is to be the most trusted and professional logistics provider, continually working towards
              enhancing customer satisfaction through innovative solutions and exceptional service. At MCL, we believe in
              building long-lasting relationships with our clients by understanding their unique needs and delivering
              customized solutions.
            </p>
            <Benefits />
          </Reveal>
          <StatImage src="/images/5.jpg" alt="MCL cargo operations" />
        </div>
      </section>

      <section aria-labelledby="values-title" className="section-y bg-soft">
        <div className="container-site">
          <SectionHeading id="values-title" center eyebrow="What drives us" title="Our Values" />
          <Reveal as="ul" variant="stagger" className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 p-0">
            {VALUES.map((v) => (
              <li key={v.title} className={`${cardClass} text-center`}>
                <IconTile icon={v.icon} className="mx-auto mb-4" />
                <h3 className="m-0 text-xl">{v.title}</h3>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <WhyChooseUs />
      <SupportBand />
    </>
  );
}
