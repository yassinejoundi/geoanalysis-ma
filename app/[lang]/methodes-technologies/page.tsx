import type { Metadata } from "next";
import { MethodsGroupsSection } from "@/components/(public)/methodes-technologies/method-groups-section";
import { methodsPageCopy } from "@/components/(public)/methodes-technologies/content";
import { PageHero } from "@/components/site/page-hero";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = methodsPageCopy[lang];
  return { title: `${copy.title} | GEOANALYSIS`, description: copy.description };
}

export default async function MethodsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = methodsPageCopy[lang];

  return (
    <main className="methods-page">
      <PageHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />
      <MethodsGroupsSection locale={lang} />
    </main>
  );
}
