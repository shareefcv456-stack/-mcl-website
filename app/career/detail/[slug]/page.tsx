import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { LinkListCard, ServicesListCard, WithSidebar } from "@/components/layout/Aside";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/RichText";
import { JOBS, getJob, jobHref } from "@/lib/content/careers";
import { formatDate } from "@/lib/content/blogs";
import { SITE } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo";

// Content pages: fully static. Unknown slugs render (and are cached) as a real 404 instead of a streamed 200.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/career/detail/[slug]">) {
  const job = getJob((await params).slug);
  if (!job) return {};
  return pageMetadata({
    title: `${job.title} – Job Details`,
    description: `${job.title} – ${job.employmentType.toLowerCase()} role at ${job.company}, ${job.location}.`,
    path: jobHref(job.slug),
    image: "/images/work1-3.jpg",
  });
}

export default async function JobPage({ params }: PageProps<"/career/detail/[slug]">) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  return (
    <>
      <PageBanner
        title={job.title}
        crumbs={[{ label: "Careers", href: "/career" }]}
        image="/images/work1-3.jpg"
        chips={[job.employmentType, job.location, `Posted ${formatDate(job.postedAt)}`]}
      />
      <WithSidebar
        aside={
          <>
            <LinkListCard title="Latest Jobs" links={JOBS.map((j) => ({ label: j.title, href: jobHref(j.slug) }))} current={jobHref(job.slug)} />
            <ServicesListCard />
            <div className="rounded-3xl bg-navy p-6 text-on-dark-muted">
              <h2 className="mb-3 text-[1.0625rem] text-white">Need any help?</h2>
              <p className="m-0 text-[0.9375rem]">Get in touch with us.</p>
              <div className="mt-4 grid gap-6">
                <ButtonLink href={`tel:${SITE.phone.tel}`} variant="white" block><Phone aria-hidden className="size-5" />{SITE.phone.label}</ButtonLink>
                <ButtonLink href={`mailto:${SITE.email}`} variant="ghost-light" block><Mail aria-hidden className="size-5" />Write email</ButtonLink>
              </div>
            </div>
          </>
        }
      >
        <h2 className="mb-4 text-[clamp(1.5rem,1.2rem+1vw,2rem)]">Job Details</h2>
        <Prose blocks={[{ type: "list", items: job.requirements }]} />
        <div id="apply" className="mt-12 rounded-3xl border border-line bg-white p-[clamp(20px,3vw,40px)]">
          <h2 className="mb-1 text-[clamp(1.5rem,1.2rem+1vw,2rem)]">Apply Now</h2>
          <p className="mb-6 text-muted">Position: <strong className="text-navy">{job.title}</strong></p>
          <ApplyForm position={job.title} />
        </div>
      </WithSidebar>
    </>
  );
}
