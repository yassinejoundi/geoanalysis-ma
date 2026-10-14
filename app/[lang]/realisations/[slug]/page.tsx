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
import { parseArticleDocument } from "@/lib/content/article-document";

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
  const hasContent = (value: { fr: string; en: string }) =>
    parseArticleDocument(value.fr).content.length > 0 || parseArticleDocument(value.en).content.length > 0;
  const hasDetails = Object.values(detail).some(hasContent);
  const hasOverview = [detail.description, detail.methodology].some(hasContent);

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
          {hasContent(detail.results) ? (
            <ProjectResultsSection detail={detail} locale={lang} copy={copy} />
          ) : null}
        </div>
      )}
      {project.resources?.length || project.files?.length ? (
        <section className="project-detail-resources" aria-label={lang === "fr" ? "Ressources du projet" : "Project resources"}>
          {project.resources?.length ? (
            <div className="editorial-detail-source-note editorial-detail-sources">
              <h2>{lang === "fr" ? "Ressources" : "Resources"}</h2>
              <ul>{project.resources.map((resource) => <li key={resource.url}>
                <a href={resource.url} rel="noopener noreferrer" target="_blank">{resource.text}</a>
              </li>)}</ul>
            </div>
          ) : null}
          {project.files?.length ? (
            <section className="editorial-files" aria-labelledby="project-files-heading">
              <h2 id="project-files-heading">{lang === "fr" ? "Fichiers à télécharger" : "Files to download"}</h2>
              <ul>{project.files.map((file) => <li key={file.id}>
                <a href={file.url} rel="noreferrer" target="_blank">
                  <span>{file.name}</span>
                  <small>{file.kind} · {file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} Ko` : `${(file.size / (1024 * 1024)).toFixed(1)} Mo`}</small>
                </a>
              </li>)}</ul>
            </section>
          ) : null}
        </section>
      ) : null}
      <ProjectContactSection
        locale={lang}
        title={copy.contactTitle}
        lead={copy.contactLead}
        action={copy.contactAction}
      />
    </main>
  );
}
