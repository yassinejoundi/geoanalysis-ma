import type { Metadata } from "next";
import { projectPageCopy } from "@/components/(public)/realisations/content";
import { ProjectContactSection } from "@/components/(public)/realisations/project-contact-section";
import { ProjectDetailHero } from "@/components/(public)/realisations/project-detail-hero";
import { ProjectGallerySection } from "@/components/(public)/realisations/project-gallery-section";
import { ProjectOverviewSection } from "@/components/(public)/realisations/project-overview-section";
import { ProjectResultsSection } from "@/components/(public)/realisations/project-results-section";
import { projectDetails } from "@/lib/content/project-details";
import { projects } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects.map(({ slug }) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return {
    title: `${localize(project.title, lang)} | GEOANALYSIS`,
    description: localize(project.teaser, lang),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  const copy = projectPageCopy[lang];
  const detail = projectDetails[project.id];

  return (
    <main className="projects-page project-detail-page">
      <ProjectDetailHero
        project={project}
        locale={lang}
        backLabel={copy.detailBack}
      />
      <ProjectGallerySection detail={detail} locale={lang} copy={copy} />
      <div className="project-detail-inner project-detail-content">
        <ProjectOverviewSection detail={detail} locale={lang} copy={copy} />
        <ProjectResultsSection detail={detail} locale={lang} copy={copy} />
      </div>
      <ProjectContactSection
        locale={lang}
        title={copy.contactTitle}
        lead={copy.contactLead}
        action={copy.contactAction}
      />
    </main>
  );
}
