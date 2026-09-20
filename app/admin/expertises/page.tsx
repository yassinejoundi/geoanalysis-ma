import { ExpertiseManager } from "@/components/(admin)/expertises/expertise-manager";
import type { AdminExpertise } from "@/lib/content/admin";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminExpertisePage() {
  const expertises = await requireAdminRecords<AdminExpertise>("expertises");
  return <ExpertiseManager initialExpertises={expertises} />;
}
