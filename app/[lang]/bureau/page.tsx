import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FirmStorySections } from "@/components/(public)/bureau/firm-story-sections";
import { ValuesSection } from "@/components/(public)/bureau/values-section";
import { firmDomains } from "@/lib/content/firm";
import { isLocale, localize, localizedHref } from "@/lib/i18n";
import { notFound } from "next/navigation";

const pageCopy = {
  fr: {
    title: "Le Bureau",
    description:
      "Découvrez les expertises de GEOANALYSIS et son bureau d’études basé à Marrakech.",
    heroKicker: "GEOANALYSIS · MARRAKECH, MAROC",
    heroTitle: "Lire le terrain. Éclairer vos projets.",
    heroLead:
      "Bureau d’études et de services en géologie, géophysique et environnement, GEOANALYSIS accompagne vos projets depuis Marrakech.",
    imageAlt: "Équipe GEOANALYSIS sur un chantier de forage en terrain montagneux.",
    imageLabel: "TRAVAUX DE TERRAIN",
    imageCaption: "Reconnaissance et suivi de forage",
    fieldsLabel: "Domaines d’intervention",
    primaryAction: "Parlons de votre projet",
    secondaryAction: "Nos domaines",
    valuesTitle: "Une exigence partagée, à chaque mission",
  },
  en: {
    title: "The Firm",
    description:
      "Explore GEOANALYSIS expertise and its geology, geophysics and environmental consultancy in Marrakech.",
    heroKicker: "GEOANALYSIS · MARRAKECH, MOROCCO",
    heroTitle: "Read the ground. Guide what comes next.",
    heroLead:
      "GEOANALYSIS is a geology, geophysics and environmental consultancy based in Marrakech.",
    imageAlt: "GEOANALYSIS team at a drilling site in mountainous terrain.",
    imageLabel: "FIELD STUDIES",
    imageCaption: "Site reconnaissance and drilling support",
    fieldsLabel: "Areas of expertise",
    primaryAction: "Discuss your project",
    secondaryAction: "Explore our expertise",
    valuesTitle: "One standard across every assignment",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = pageCopy[lang];
  return { title: `${title} | GEOANALYSIS`, description };
}

export default async function FirmPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = pageCopy[lang];

  return (
    <main className="firm-page">
      <section className="firm-hero" aria-labelledby="firm-page-title">
        <div className="firm-hero-inner">
          <div className="firm-hero-copy">
            <p className="firm-hero-kicker">{copy.heroKicker}</p>
            <h1 id="firm-page-title">{copy.heroTitle}</h1>
            <p className="firm-hero-lead">{copy.heroLead}</p>
            <div className="firm-hero-actions">
              <Link
                className="firm-primary-action"
                href={localizedHref(lang, "/contact")}>
                {copy.primaryAction}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="firm-secondary-action" href="#firm-domains">
                {copy.secondaryAction}
              </Link>
            </div>
            <ul className="firm-hero-fields" aria-label={copy.fieldsLabel}>
              {firmDomains.map((domain) => (
                <li key={domain.number}>{localize(domain.title, lang)}</li>
              ))}
            </ul>
          </div>
          <figure className="firm-hero-media">
            <Image
              alt={copy.imageAlt}
              fill
              preload
              sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1360px) 48vw, 640px"
              src="/firm-fieldwork.jpg"
            />
            <figcaption>
              <span>{copy.imageLabel}</span>
              <span>{copy.imageCaption}</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <FirmStorySections locale={lang} />
      <ValuesSection locale={lang} title={copy.valuesTitle} />
    </main>
  );
}
