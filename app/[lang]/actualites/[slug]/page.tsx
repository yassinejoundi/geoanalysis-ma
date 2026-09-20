import type { Metadata } from "next";
import { newsPageCopy } from "@/components/(public)/actualites/content";
import { EditorialDetail } from "@/components/site/editorial-detail";
import { news } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) => news.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const entry = news.find((item) => item.slug === slug);
  if (!entry) notFound();
  return {
    title: `${localize(entry.title, lang)} | GEOANALYSIS`,
    description: localize(entry.teaser, lang),
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const entry = news.find((item) => item.slug === slug);
  if (!entry) notFound();
  const relatedEntries = news
    .filter((item) => item.id !== entry.id)
    .slice(0, 3);

  return (
    <EditorialDetail
      entry={entry}
      relatedEntries={relatedEntries}
      locale={lang}
      kind="actualites"
      copy={newsPageCopy[lang]}
    />
  );
}
