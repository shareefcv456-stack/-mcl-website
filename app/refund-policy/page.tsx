import { LegalPage, legalMetadata } from "@/components/layout/LegalPage";
import { LEGAL_PAGES } from "@/lib/content/legal";

export const metadata = legalMetadata(LEGAL_PAGES.refund);

export default function RefundPolicyPage() {
  return <LegalPage page={LEGAL_PAGES.refund} />;
}
