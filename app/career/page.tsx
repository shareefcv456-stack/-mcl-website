import { Briefcase, MapPin } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading, cardClass, cardHoverClass } from "@/components/ui/Section";
import { CAREERS_INTRO, JOBS, jobHref } from "@/lib/content/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Careers at Meem Continental Logistics – current job openings.",
  path: "/career",
  image: "/images/work1-3.jpg",
});

export default function CareersPage() {
  return (
    <>
      {/* The live page's heading reads "Contact Us" (a template slip) — shown as "Careers" here, noted in README. */}
      <PageBanner title="Careers" lead={CAREERS_INTRO} image="/images/work1-3.jpg" />
      <section className="section-y">
        <div className="container-site max-w-[968px]">
          <SectionHeading
            eyebrow="Open positions"
            title="Find the perfect jobs"
            action={<span className="text-muted">{JOBS.length} {JOBS.length === 1 ? "opening" : "openings"}</span>}
          />
          <ul className="m-0 grid list-none gap-4 p-0">
            {JOBS.map((job) => (
              <li key={job.slug} className={`${cardClass} ${cardHoverClass} flex flex-wrap items-center justify-between gap-4`}>
                <div>
                  <span className="mb-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[0.8125rem] font-semibold text-brand">{job.employmentType}</span>
                  <h3 className="mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.9375rem] text-muted">
                    <span className="inline-flex items-center gap-1.5"><Briefcase aria-hidden className="size-4" />{job.company}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden className="size-4" />{job.location}</span>
                  </div>
                </div>
                <ButtonLink href={jobHref(job.slug)} arrow aria-label={`View details: ${job.title}`}>View Details</ButtonLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
