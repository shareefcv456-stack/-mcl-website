import { LegalPage, legalMetadata } from "@/components/layout/LegalPage";
import { LEGAL_PAGES } from "@/lib/content/legal";

export const metadata = legalMetadata(LEGAL_PAGES.privacy);

export default function PrivacyPolicyPage() {
  return <LegalPage page={LEGAL_PAGES.privacy} />;
}
