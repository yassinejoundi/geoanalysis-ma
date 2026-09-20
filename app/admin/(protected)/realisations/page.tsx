import { ProjectManager } from "@/components/(admin)/realisations/project-manager";
import type { ProjectDraft } from "@/components/(admin)/realisations/project-editor-fields";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminProjectsPage() {
  const [projects, expertises] = await Promise.all([
    requireAdminRecords<ProjectDraft>("projects"),
    requireAdminRecords<import("@/lib/content/admin").AdminExpertise>("expertises"),
  ]);
  return <ProjectManager initialProjects={projects} initialExpertises={expertises} />;
}
