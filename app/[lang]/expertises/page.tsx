import type { Metadata } from "next";
import { ExpertiseIndexSection } from "@/components/(public)/expertises/expertise-index-section";
import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { PageHero } from "@/components/site/page-hero";
import { expertises } from "@/lib/content/site";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = expertisePageCopy[lang];
  return {
    title: `${copy.indexTitle} | GEOANALYSIS`,
    description: copy.indexLead,
  };
}

export default async function ExpertiseIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = expertisePageCopy[lang];

  return (
    <main className="expertise-page">
      <PageHero kicker={copy.indexTitle} title={copy.indexTitle} lead={copy.indexLead} />
      <ExpertiseIndexSection expertises={expertises} locale={lang} copy={copy} />
    </main>
  );
}
