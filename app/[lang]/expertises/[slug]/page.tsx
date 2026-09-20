import type { Metadata } from "next";
import { ExpertiseCapabilitiesSection } from "@/components/(public)/expertises/expertise-capabilities-section";
import { ExpertiseContextSection } from "@/components/(public)/expertises/expertise-context-section";
import { ExpertiseDetailHero } from "@/components/(public)/expertises/expertise-detail-hero";
import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { ExpertiseMethodologySection } from "@/components/(public)/expertises/expertise-methodology-section";
import { ExpertiseRelatedProjectsSection } from "@/components/(public)/expertises/expertise-related-projects-section";
import { expertiseDetails } from "@/lib/content/expertise-details";
import { expertises, projects } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) => expertises.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const expertise = expertises.find((entry) => entry.slug === slug);
  if (!expertise) notFound();
  return {
    title: `${localize(expertise.name, lang)} | GEOANALYSIS`,
    description: localize(expertiseDetails[expertise.id].intro, lang),
  };
}

export default async function ExpertisePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const expertise = expertises.find((entry) => entry.slug === slug);
  if (!expertise) notFound();

  const copy = expertisePageCopy[lang];
  const detail = expertiseDetails[expertise.id];
  const relatedProjects = projects.filter((project) => project.expertiseId === expertise.id);

  return (
    <main className="expertise-page">
      <ExpertiseDetailHero expertise={expertise} detail={detail} locale={lang} copy={copy} />
      <ExpertiseContextSection detail={detail} locale={lang} copy={copy} />
      <ExpertiseMethodologySection detail={detail} locale={lang} kicker={copy.methodologyKicker} title={copy.methodology} />
      <ExpertiseCapabilitiesSection detail={detail} locale={lang} copy={copy} />
      <ExpertiseRelatedProjectsSection
        projects={relatedProjects}
        locale={lang}
        kicker={copy.relatedProjectsKicker}
        title={copy.relatedProjects}
        imageLabel={copy.projectImage}
      />
    </main>
  );
}
