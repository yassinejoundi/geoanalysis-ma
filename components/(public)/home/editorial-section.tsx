import Link from "next/link";
import { articles, news } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { EditorialCard } from "./cards";

export function EditorialSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  if (news.length === 0 && articles.length === 0) return null;

  const newsEntries = news.slice(0, 3);
  const articleEntries = articles.slice(0, 2);

  return (
    <section
      className="home-band home-editorial"
      aria-labelledby="home-editorial-title">
      <div className="home-section-inner home-editorial-inner">
        <header className="home-editorial-header">
          <div>
            <p className="home-kicker">{content.editorialKicker}</p>
            <h2 id="home-editorial-title">{content.editorialTitle}</h2>
          </div>
          <span className="home-editorial-edition" aria-hidden="true">
            GEOANALYSIS <span>·</span> {content.editorialLocation.toLocaleUpperCase(locale)}
          </span>
        </header>

        <div className="home-editorial-grid">
          {newsEntries.length > 0 && (
            <section
              className="home-editorial-column home-editorial-news"
              aria-labelledby="home-news-title">
              <div className="home-editorial-column-heading">
                <div>
                  <p className="home-kicker">
                    {content.newsKicker}
                  </p>
                  <h3 id="home-news-title">{content.news}</h3>
                </div>
                <Link
                  className="home-editorial-all-link"
                  href={`/${locale}/actualites`}>
                  {content.allNews}<span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="home-editorial-feature-list">
                {newsEntries[0] && (
                  <EditorialCard
                    entry={newsEntries[0]}
                    locale={locale}
                    kind="actualites"
                    variant="featured"
                  />
                )}
                <div className="home-editorial-compact-list">
                  {newsEntries.slice(1).map((entry) => (
                    <EditorialCard
                      key={entry.id}
                      entry={entry}
                      locale={locale}
                      kind="actualites"
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {articleEntries.length > 0 && (
            <section
              className="home-editorial-column home-editorial-articles"
              aria-labelledby="home-articles-title">
              <div className="home-editorial-column-heading">
                <div>
                  <p className="home-kicker">
                    {content.articlesKicker}
                  </p>
                  <h3 id="home-articles-title">{content.articles}</h3>
                </div>
                <Link
                  className="home-editorial-all-link"
                  href={`/${locale}/articles`}>
                  {content.allArticles}<span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="home-editorial-feature-list">
                {articleEntries[0] && (
                  <EditorialCard
                    entry={articleEntries[0]}
                    locale={locale}
                    kind="articles"
                    readLabel={content.read}
                    variant="featured"
                  />
                )}
                <div className="home-editorial-compact-list">
                  {articleEntries.slice(1).map((entry) => (
                    <EditorialCard
                      key={entry.id}
                      entry={entry}
                      locale={locale}
                      kind="articles"
                      readLabel={content.read}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
