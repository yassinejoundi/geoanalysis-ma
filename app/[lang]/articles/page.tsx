import type { Metadata } from "next";
import { ArticleIndexSection } from "@/components/(public)/articles/article-index-section";
import { articlePageCopy } from "@/components/(public)/articles/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getPublicArticles } from "@/lib/server/data/admin";

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

  return (
    <main className="articles-page">
      <ArticleIndexSection entries={await getPublicArticles()} locale={lang} />
    </main>
  );
}
