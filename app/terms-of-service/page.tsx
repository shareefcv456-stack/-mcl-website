import { LegalPage, legalMetadata } from "@/components/layout/LegalPage";
import { LEGAL_PAGES } from "@/lib/content/legal";

export const metadata = legalMetadata(LEGAL_PAGES.terms);

export default function TermsOfServicePage() {
  return <LegalPage page={LEGAL_PAGES.terms} />;
}
