import type { Metadata } from "next";
import { DesignSystemSections } from "@/components/(public)/design-system/design-system-sections";
import { designSystemCopy } from "@/components/(public)/design-system/content";
import { PageHero } from "@/components/site/page-hero";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${designSystemCopy[lang].title} | GEOANALYSIS`,
    description: designSystemCopy[lang].description,
  };
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = designSystemCopy[lang];

  return (
    <main className="design-system-page">
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        lead={copy.description}
      />
      <DesignSystemSections locale={lang} />
    </main>
  );
}
