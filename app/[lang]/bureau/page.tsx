import type { Metadata } from "next";
import { OverviewSection } from "@/components/(public)/bureau/overview-section";
import { ValuesSection } from "@/components/(public)/bureau/values-section";
import { PageHero } from "@/components/site/page-hero";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const pageCopy = {
  fr: {
    title: "Le Bureau", lead: "Une structure technique construite autour de la qualité de la donnée et de la traçabilité méthodologique.",
    description: "Découvrez GEOANALYSIS, bureau d’études à Marrakech, sa mission, ses équipes, ses moyens et ses principes.",
    imageLabel: "IMAGE — ÉQUIPE / LABORATOIRE", valuesTitle: "Nos valeurs",
  },
  en: {
    title: "The Firm", lead: "A technical organisation built around data quality and methodological traceability.",
    description: "Meet GEOANALYSIS, a Marrakech-based consultancy: our mission, team, resources and principles.",
    imageLabel: "IMAGE — TEAM / LABORATORY", valuesTitle: "Our values",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = pageCopy[lang];
  return { title: `${title} | GEOANALYSIS`, description };
}

export default async function FirmPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = pageCopy[lang];

  return (
    <main className="firm-page">
      <PageHero kicker={copy.title} title={copy.title} lead={copy.lead}/>
      <OverviewSection locale={lang} imageLabel={copy.imageLabel}/>
      <ValuesSection locale={lang} title={copy.valuesTitle}/>
    </main>
  );
}
