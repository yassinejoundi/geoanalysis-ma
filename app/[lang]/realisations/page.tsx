import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RealisationsArchiveSection } from "@/components/(public)/realisations/projects-list-section";
import {
  projectPageCopy,
  realisationsPageCopy,
} from "@/components/(public)/realisations/content";
import { localizedHref, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ProjectsPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Pick<ProjectsPageProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = projectPageCopy[lang];
  return {
    title: `${copy.indexTitle} | GEOANALYSIS`,
    description: copy.indexLead,
  };
}

export default async function ProjectIndex({
  params,
}: ProjectsPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const page = realisationsPageCopy[lang];

  return (
    <main className="realisations-page">
      <section
        className="realisations-hero"
        aria-labelledby="realisations-title">
        <div className="realisations-hero-copy">
          <p className="realisations-eyebrow">{page.heroKicker}</p>
          <h1 id="realisations-title">{page.heroTitle}</h1>
          <p className="realisations-hero-lead">{page.heroLead}</p>
          <ul className="realisations-domain-list">
            <li>{lang === "fr" ? "Géologie & mines" : "Geology & mining"}</li>
            <li>{lang === "fr" ? "Ressources en eau" : "Water resources"}</li>
            <li>{lang === "fr" ? "Cartographie & SIG" : "Mapping & GIS"}</li>
          </ul>
          <div className="realisations-hero-actions">
            <Link
              className="realisations-primary-action"
              href={localizedHref(lang, "contact")}>
              {page.contactAction}
            </Link>
            <Link className="realisations-secondary-action" href="#missions">
              {page.exploreAction}
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <figure className="realisations-hero-visual">
          <Image
            src="/realisations/terrain-strata.webp"
            alt={page.heroImageAlt}
            fill
            priority
            sizes="(max-width: 820px) 100vw, 52vw"
          />
          <figcaption>{page.heroImageCaption}</figcaption>
        </figure>
      </section>
      <RealisationsArchiveSection locale={lang} />
    </main>
  );
}
