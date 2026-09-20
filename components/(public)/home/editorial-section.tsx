import Link from "next/link";
import { articles, news } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { EditorialCard } from "./cards";
import { SectionHeading } from "./section-heading";

export function EditorialSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  const newsKicker = locale === "fr" ? "La vie du bureau" : "From the firm";
  const articlesKicker = locale === "fr" ? "Nos analyses" : "Expert insight";
  return (
    <section className="home-band home-editorial">
      <div className="home-section-inner home-editorial-grid">
        <div>
          <div className="home-section-heading-row">
            <SectionHeading kicker={newsKicker} title={content.news} />
            <Link className="home-text-link" href={`/${locale}/actualites`}>
              {content.all} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="home-news-list">
            {news.slice(0, 3).map((entry) => (
              <EditorialCard
                key={entry.id}
                entry={entry}
                locale={locale}
                kind="actualites"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="home-section-heading-row">
            <SectionHeading kicker={articlesKicker} title={content.articles} />
            <Link className="home-text-link" href={`/${locale}/articles`}>
              {content.all} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="home-article-list">
            {articles.slice(0, 2).map((entry) => (
              <EditorialCard
                key={entry.id}
                entry={entry}
                locale={locale}
                kind="articles"
                readLabel={content.read}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
