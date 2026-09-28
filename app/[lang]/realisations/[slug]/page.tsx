import type { Metadata } from "next";
import { projectPageCopy } from "@/components/(public)/realisations/content";
import { ProjectContactSection } from "@/components/(public)/realisations/project-contact-section";
import { ProjectDetailHero } from "@/components/(public)/realisations/project-detail-hero";
import { ProjectGallerySection } from "@/components/(public)/realisations/project-gallery-section";
import { ProjectOverviewSection } from "@/components/(public)/realisations/project-overview-section";
import { ProjectResultsSection } from "@/components/(public)/realisations/project-results-section";
import { getPublicProjectBySlug } from "@/lib/server/data/admin";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ProjectPageProps = PageProps<"/[lang]/realisations/[slug]">;

async function getProject(slug: string) {
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = await getProject(slug);
  return {
    title: `${localize(project.seoTitle, lang) || localize(project.title, lang)} | GEOANALYSIS`,
    description: localize(project.seoDescription, lang) || localize(project.teaser, lang),
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = await getProject(slug);

  const copy = projectPageCopy[lang];
  const detail = {
    description: project.context,
    methodology: project.methodology,
    results: project.results,
  };
  const hasDetails = Object.values(detail).some((value) => value.fr.trim() || value.en.trim());
  const hasOverview = [detail.description, detail.methodology].some(
    (value) => value.fr.trim() || value.en.trim(),
  );

  return (
    <main className="projects-page project-detail-page">
      <ProjectDetailHero
        project={project}
        locale={lang}
        backLabel={copy.detailBack}
      />
      <ProjectGallerySection gallery={project.gallery} title={localize(project.title, lang)} copy={copy} />
      {hasDetails && (
        <div className="project-detail-inner project-detail-content">
          {hasOverview && <ProjectOverviewSection detail={detail} locale={lang} copy={copy} />}
          {detail.results.fr.trim() || detail.results.en.trim() ? (
            <ProjectResultsSection detail={detail} locale={lang} copy={copy} />
          ) : null}
        </div>
      )}
      <ProjectContactSection
        locale={lang}
        title={copy.contactTitle}
        lead={copy.contactLead}
        action={copy.contactAction}
      />
    </main>
  );
}
