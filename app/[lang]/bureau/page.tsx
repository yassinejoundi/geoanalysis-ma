import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { firmContentBlocks, firmValues } from "@/lib/content/firm";
import { isLocale, localize } from "@/lib/i18n";
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
      <section className="firm-overview" aria-label={lang === "fr" ? "Présentation du bureau" : "About the firm"}>
        <div className="firm-image-placeholder" aria-hidden="true">{copy.imageLabel}</div>
        <div className="firm-content-blocks">{firmContentBlocks.map((block) => <article className="firm-content-block" key={block.title.fr}><h2>{localize(block.title, lang)}</h2><p>{localize(block.description, lang)}</p></article>)}</div>
      </section>
      <section className="firm-values" aria-labelledby="firm-values-title">
        <div className="firm-values-inner"><h2 id="firm-values-title">{copy.valuesTitle}</h2><ul>{firmValues.map((value) => <li key={value.number}><span className="firm-value-number">{value.number}</span><h3>{localize(value.title, lang)}</h3><p>{localize(value.description, lang)}</p></li>)}</ul></div>
      </section>
    </main>
  );
}
