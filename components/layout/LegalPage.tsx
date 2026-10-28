import { PageBanner } from "@/components/layout/PageBanner";
import { LinkListCard, QuoteCard, WithSidebar } from "@/components/layout/Aside";
import { DefinitionList, RichText } from "@/components/ui/RichText";
import { LEGAL_PAGES } from "@/lib/content/legal";
import { FOOTER_EXPLORE } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo";
import type { LegalPage as LegalPageContent } from "@/types/content";

// Same labels as the footer ("Terms of Services"), matching the original sidebar.
const POLICY_LINKS = FOOTER_EXPLORE.filter((l) => Object.values(LEGAL_PAGES).some((p) => `/${p.slug}` === l.href));

export const legalMetadata = (page: LegalPageContent) =>
  pageMetadata({ title: page.title, description: `${page.title} of Meem Continental Logistics (MCL).`, path: `/${page.slug}` });

export function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <>
      <PageBanner title={page.title} image="/images/5.jpg" />
      <WithSidebar aside={<><LinkListCard title="Policies" links={POLICY_LINKS} current={`/${page.slug}`} /><QuoteCard /></>}>
        <article className="max-w-[72ch]">
          {page.sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className={`${i ? "mt-12" : ""} mb-4 text-[clamp(1.5rem,1.2rem+1vw,2rem)]`}>{s.heading}</h2>
              {s.intro && <p className="mb-4 text-[#3a4363]"><RichText value={s.intro} /></p>}
              {s.items && <DefinitionList items={s.items} />}
            </section>
          ))}
        </article>
      </WithSidebar>
    </>
  );
}
