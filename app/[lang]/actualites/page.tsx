import type { Metadata } from "next";
import { newsPageCopy } from "@/components/(public)/actualites/content";
import { NewsIndexSection } from "@/components/(public)/actualites/news-index-section";
import { PageHero } from "@/components/site/page-hero";
import { news } from "@/lib/content/site";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = newsPageCopy[lang];
  return {
    title: `${copy.title} | GEOANALYSIS`,
    description: copy.description,
  };
}

export default async function NewsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = newsPageCopy[lang];

  return (
    <main className="news-page">
      <PageHero kicker={copy.title} title={copy.title} lead={copy.lead} />
      <NewsIndexSection entries={news} locale={lang} />
    </main>
  );
}
