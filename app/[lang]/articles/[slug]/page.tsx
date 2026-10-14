import type { Metadata } from "next";
import { articlePageCopy } from "@/components/(public)/articles/content";
import { EditorialDetail } from "@/components/site/editorial-detail";
import { articles as articleFixtures } from "@/lib/content/site";
import { getPublicArticles } from "@/lib/server/data/admin";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

async function getArticle(slug: string) {
  const entry = (await getPublicArticles()).find((item) => item.slug === slug);
  if (!entry) notFound();
  return entry;
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    articleFixtures.map(({ slug }) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const entry = await getArticle(slug);
  return {
    title: `${localize(entry.seoTitle ?? entry.title, lang)} | GEOANALYSIS`,
    description: localize(entry.seoDescription ?? entry.teaser, lang),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const entry = await getArticle(slug);
  const relatedEntries = (await getPublicArticles())
    .filter((item) => item.id !== entry.id)
    .slice(0, 3);

  return (
    <EditorialDetail
      entry={entry}
      relatedEntries={relatedEntries}
      locale={lang}
      kind="articles"
      copy={articlePageCopy[lang]}
    />
  );
}
