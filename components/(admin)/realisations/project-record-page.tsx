import { notFound } from "next/navigation";
import { ProjectRecordEditor } from "@/components/(admin)/realisations/project-record-editor";
import type { AdminExpertise } from "@/lib/content/admin";
import type { ProjectDraft } from "@/lib/content/projects";
import { requireAdminRecords } from "@/lib/server/data/admin";

export async function ProjectRecordPage({ slug }: { slug: string }) {
  const [projects, expertises] = await Promise.all([
    requireAdminRecords<ProjectDraft>("projects"),
    requireAdminRecords<AdminExpertise>("expertises"),
  ]);
  const isNew = slug === "nouvelle";
  const initialProject = isNew ? null : projects.find((project) => project.id === slug || project.slug === slug) ?? null;
  if (!isNew && !initialProject) notFound();

  return <ProjectRecordEditor initialProject={initialProject} expertises={expertises} />;
}
