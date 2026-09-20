import type { Metadata } from "next";
import { ArticleIndexSection } from "@/components/(public)/articles/article-index-section";
import { articlePageCopy } from "@/components/(public)/articles/content";
import { PageHero } from "@/components/site/page-hero";
import { articles } from "@/lib/content/site";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = articlePageCopy[lang];
  return {
    title: `${copy.title} | GEOANALYSIS`,
    description: copy.description,
  };
}

export default async function ArticleIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = articlePageCopy[lang];

  return (
    <main className="articles-page">
      <PageHero kicker={copy.title} title={copy.title} lead={copy.lead} />
      <ArticleIndexSection
        entries={articles}
        locale={lang}
        readLabel={copy.read}
      />
    </main>
  );
}
