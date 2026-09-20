import type { Metadata } from "next";
import { ProjectsFilterSection } from "@/components/(public)/realisations/projects-filter-section";
import { ProjectsListSection } from "@/components/(public)/realisations/projects-list-section";
import { projectPageCopy } from "@/components/(public)/realisations/content";
import { PageHero } from "@/components/site/page-hero";
import { expertises, projects } from "@/lib/content/site";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ProjectsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Pick<ProjectsPageProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = projectPageCopy[lang];
  return { title: `${copy.indexTitle} | GEOANALYSIS`, description: copy.indexLead };
}

export default async function ProjectIndex({ params, searchParams }: ProjectsPageProps) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(lang)) notFound();

  const requestedId = typeof query.expertise === "string" ? query.expertise : undefined;
  const activeExpertise = expertises.find((expertise) => expertise.id === requestedId);
  const visibleProjects = activeExpertise
    ? projects.filter((project) => project.expertiseId === activeExpertise.id)
    : projects;
  const copy = projectPageCopy[lang];

  return (
    <main className="projects-page">
      <PageHero kicker={copy.indexTitle} title={copy.indexTitle} lead={copy.indexLead} />
      <ProjectsFilterSection
        locale={lang}
        activeExpertiseId={activeExpertise?.id}
        resultCount={visibleProjects.length}
        copy={copy}
      />
      <ProjectsListSection projects={visibleProjects} locale={lang} />
    </main>
  );
}
