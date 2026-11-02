import { SupportBand } from "@/components/layout/SupportBand";
import { WhyChooseUs } from "@/components/home/Sections";
import { AboutHero, CompanyOverview, Journey, MissionVision, NetworkSection, ValuesSection } from "@/components/about/AboutSections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: "About Meem Continental Logistics (MCL) – our mission, values and why customers choose us.",
  path: "/about",
  image: "/images/container-ship.jpg",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyOverview />
      <MissionVision />
      <Journey />
      <ValuesSection />
      <NetworkSection />
      <WhyChooseUs />
      <SupportBand />
    </>
  );
}
