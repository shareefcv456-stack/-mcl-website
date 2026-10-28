import { PageBanner } from "@/components/layout/PageBanner";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <PageBanner title="Page not found" lead="The page you're looking for doesn't exist or has moved." />
      <section className="section-y">
        <div className="container-site flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>Back to home</ButtonLink>
          <ButtonLink href="/services" variant="ghost">Our services</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink>
        </div>
      </section>
    </>
  );
}
