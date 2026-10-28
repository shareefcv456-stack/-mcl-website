import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  AboutIntro, BlogsSection, CategoriesSection, FaqSection, PortfolioSection, ProcessSection, ServicesSection,
  Testimonials, VolumeSection, WhyChooseUs,
} from "@/components/home/Sections";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | Your Global Logistics Partner` },
  alternates: { canonical: "/" },
};

// Section order follows the approved homepage structure.
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <ServicesSection />
      <CategoriesSection />
      <ProcessSection />
      <WhyChooseUs />
      <VolumeSection />
      <PortfolioSection />
      <Testimonials />
      <FaqSection />
      <BlogsSection />
    </>
  );
}
