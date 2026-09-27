import type { Metadata } from "next";
import { newsPageCopy } from "@/components/(public)/actualites/content";
import { NewsIndexSection } from "@/components/(public)/actualites/news-index-section";
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
      <section className="news-masthead" aria-labelledby="news-page-title">
        <div className="news-masthead-inner">
          <div className="news-masthead-copy">
            <p className="news-masthead-eyebrow">GEOANALYSIS / {copy.title}</p>
            <h1 id="news-page-title">{copy.title}</h1>
            <p className="news-masthead-lead">{copy.lead}</p>
          </div>
          <div className="news-masthead-meta">
            <span>{copy.archiveLabel}</span>
            <span className="news-masthead-range">{copy.archiveRange}</span>
          </div>
        </div>
      </section>
      <NewsIndexSection entries={news} locale={lang} copy={copy} />
    </main>
  );
}
