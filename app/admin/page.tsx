import { DashboardContent } from "@/components/(admin)/dashboard/dashboard-content";
import { messageStatuses, type AdminDashboardPipelineStage, type AdminDashboardSection, type AdminMessage, type AdminExpertise, type PublicationState } from "@/lib/content/admin";
import { requireAdminRecords } from "@/lib/server/data/admin";
import type { ProjectDraft } from "@/components/(admin)/realisations/project-editor-fields";
import type { EditorialDraft } from "@/components/(admin)/editorial/editorial-editor-fields";

export default async function AdminPage() {
  const [projects, expertises, articles, news, messages] = await Promise.all([
    requireAdminRecords<ProjectDraft>("projects"),
    requireAdminRecords<AdminExpertise>("expertises"),
    requireAdminRecords<EditorialDraft>("articles"),
    requireAdminRecords<EditorialDraft>("news"),
    requireAdminRecords<AdminMessage>("messages"),
  ]);
  const editorial = [...articles, ...news];
  const publishedProjects = projects.filter((item) => item.state === "published").length;
  const publishedEditorial = editorial.filter((item) => item.state === "published").length;
  const newMessages = messages.filter((item) => item.status === "new").length;
  const stats = [
    { label: "Projets", value: projects.length, detail: `${publishedProjects} publiés · ${projects.length - publishedProjects} brouillon${projects.length - publishedProjects === 1 ? "" : "s"}` },
    { label: "Expertises", value: expertises.length, detail: `${expertises.reduce((total, item) => total + item.subServices.length, 0)} sous-services` },
    { label: "Publications", value: editorial.length, detail: `${publishedEditorial} publiées · ${editorial.length - publishedEditorial} brouillon${editorial.length - publishedEditorial === 1 ? "" : "s"}` },
    { label: "Messages", value: messages.length, detail: `${newMessages} nouveau${newMessages === 1 ? "" : "x"}` },
  ];
  const section = <T extends { id: string; state: PublicationState; title: { fr: string }; date: string }>(items: T[], id: string, title: string, href: string, allLabel: string): AdminDashboardSection => ({
    id, title, href, allLabel,
    items: items.slice(0, 4).map((item) => ({ id: item.id, title: item.title.fr, meta: item.date, state: item.state })),
  });
  const sections = [
    section(projects, "projects", "Réalisations récentes", "/admin/realisations", "Voir toutes les réalisations"),
    section(articles, "articles", "Articles récents", "/admin/articles", "Voir tous les articles"),
    section(news, "news", "Actualités récentes", "/admin/actualites", "Voir toutes les actualités"),
  ];
  const pipeline: AdminDashboardPipelineStage[] = messageStatuses.map(({ id, label }) => ({
    id,
    label: label.fr,
    count: messages.filter((item) => item.status === id).length,
    tone: ({ new: "new", contacted: "qualified", talking: "progress", quoted: "sent", won: "won", lost: "lost" } as const)[id],
  }));
  return <DashboardContent stats={stats} sections={sections} pipeline={pipeline} messages={messages} />;
}
