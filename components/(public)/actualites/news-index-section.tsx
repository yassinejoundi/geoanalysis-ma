import Image from "next/image";
import Link from "next/link";
import { EditorialCard } from "@/components/site/editorial-card";
import { PublicContentEmptyState } from "@/components/site/public-content-empty-state";
import { newsPageCopy } from "@/components/(public)/actualites/content";
import type { EditorialEntry } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function NewsIndexSection({
  entries,
  locale,
  copy,
}: {
  entries: EditorialEntry[];
  locale: Locale;
  copy: (typeof newsPageCopy)[Locale];
}) {
  const [featured, ...archive] = entries;

  return (
    <section className="news-index-section" aria-labelledby="news-index-title">
      <div className="news-index-inner">
        <header className="news-index-heading">
          <div>
            <p className="news-index-eyebrow">{copy.indexEyebrow}</p>
            <h2 id="news-index-title">{copy.indexTitle}</h2>
          </div>
          <p className="news-index-count">
            <span>{String(entries.length).padStart(2, "0")}</span>
            {locale === "fr" ? " archives" : " stories"}
          </p>
        </header>

        <p className="news-source-note">{copy.sourceNote}</p>

        {featured ? (
          <div className="news-index-grid">
            <Link
              className="news-feature"
              href={`/${locale}/actualites/${featured.slug}`}
            >
              <span className="news-feature-image">
                {featured.image ? (
                  <Image
                    src={featured.image.src}
                    alt={localize(featured.image.alt, locale)}
                    fill
                    preload
                    sizes="(max-width: 760px) 100vw, 58vw"
                  />
                ) : (
                  featured.imageLabel
                )}
              </span>
              <span className="news-feature-copy">
                <span className="news-card-meta">
                  <span className="news-card-category">
                    {localize(featured.category, locale)}
                  </span>
                  {featured.dateISO ? (
                    <time dateTime={featured.dateISO}>
                      {localize(featured.date, locale)}
                    </time>
                  ) : (
                    <span>{localize(featured.date, locale)}</span>
                  )}
                </span>
                <h3 className="news-feature-title">
                  {localize(featured.title, locale)}
                </h3>
                <span className="news-feature-teaser">
                  {localize(featured.teaser, locale)}
                </span>
                <span className="news-feature-link">{copy.openStory}</span>
              </span>
            </Link>

            {archive.length > 0 ? (
              <ul className="news-secondary-grid">
                {archive.map((entry) => (
                  <li key={entry.id}>
                    <EditorialCard
                      entry={entry}
                      locale={locale}
                      kind="actualites"
                      headingLevel={3}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <PublicContentEmptyState kind="news" locale={locale} />
        )}
      </div>
    </section>
  );
}
