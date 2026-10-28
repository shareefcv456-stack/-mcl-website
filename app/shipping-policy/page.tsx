import { LegalPage, legalMetadata } from "@/components/layout/LegalPage";
import { LEGAL_PAGES } from "@/lib/content/legal";

export const metadata = legalMetadata(LEGAL_PAGES.shipping);

export default function ShippingPolicyPage() {
  return <LegalPage page={LEGAL_PAGES.shipping} />;
}
