import { EditorialCard } from "@/components/site/editorial-card";
import { PublicContentEmptyState } from "@/components/site/public-content-empty-state";
import { articlePageCopy } from "@/components/(public)/articles/content";
import type { EditorialEntry } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";

export function ArticleIndexSection({
  entries,
  locale,
}: {
  entries: EditorialEntry[];
  locale: Locale;
}) {
  const copy = articlePageCopy[locale];

  return (
    <>
      <section className="articles-masthead" aria-labelledby="articles-heading">
        <div className="articles-masthead-inner">
          <div className="articles-masthead-copy">
            <p className="articles-eyebrow">{copy.kicker}</p>
            <h1 id="articles-heading">{copy.heading}</h1>
            <p className="articles-masthead-lead">{copy.lead}</p>
          </div>
          <aside className="articles-masthead-index" aria-label={copy.collection}>
            <p>{copy.collection}</p>
            <span className="articles-masthead-count">
              {String(entries.length).padStart(2, "0")}
            </span>
            <span className="articles-masthead-count-total">
              / {String(entries.length).padStart(2, "0")}
            </span>
            <span className="articles-masthead-caption">{copy.count}</span>
          </aside>
        </div>
      </section>

      <section className="articles-index-section" aria-labelledby="articles-index-heading">
        <div className="articles-index-inner">
          <header className="articles-index-heading">
            <div>
              <p className="articles-eyebrow">{copy.indexKicker}</p>
              <h2 id="articles-index-heading">{copy.indexTitle}</h2>
              <p>{copy.indexLead}</p>
            </div>
            <span className="articles-index-count">
              {String(entries.length).padStart(2, "0")} {copy.count}
            </span>
          </header>
          {entries.length === 0 ? (
            <PublicContentEmptyState kind="articles" locale={locale} />
          ) : (
            <div className="editorial-index-grid editorial-index-grid-articles">
              {entries.map((entry, index) => (
                <EditorialCard
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  kind="articles"
                  readLabel={copy.read}
                  featured={index === 0}
                  featuredLabel={copy.featured}
                  headingLevel={3}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
