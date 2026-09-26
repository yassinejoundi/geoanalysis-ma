import type { Metadata } from "next";
import { OverviewSection } from "@/components/(public)/bureau/overview-section";
import { ValuesSection } from "@/components/(public)/bureau/values-section";
import { PageHero } from "@/components/site/page-hero";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const pageCopy = {
  fr: {
    title: "Le Bureau",
    lead: "Bureau d’études et de services en géologie, géophysique et environnement, basé à Marrakech.",
    description:
      "Découvrez les activités, les expertises et l’implantation de GEOANALYSIS à Marrakech.",
    imageLabel: "TERRAIN & ÉTUDES",
    valuesTitle: "Notre approche",
  },
  en: {
    title: "The Firm",
    lead: "A geology, geophysics and environmental consultancy based in Marrakech.",
    description:
      "Explore GEOANALYSIS activities, expertise and base in Marrakech.",
    imageLabel: "FIELDWORK & STUDIES",
    valuesTitle: "Our approach",
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
      <PageHero kicker={copy.title} title={copy.title} lead={copy.lead} />
      <OverviewSection locale={lang} imageLabel={copy.imageLabel} />
      <ValuesSection locale={lang} title={copy.valuesTitle} />
    </main>
  );
}
