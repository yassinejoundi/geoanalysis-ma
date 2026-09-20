import { PartnersManager } from "@/components/(admin)/partenaires/partners-manager";
import type { PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminPartnersPage() {
  const partners = await requireAdminRecords<PartnerDraft>("partners");
  return <PartnersManager initialPartners={partners} />;
}
