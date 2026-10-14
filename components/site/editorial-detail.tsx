import Image from "next/image";
import Link from "next/link";
import type { EditorialDetailEntry } from "@/lib/content/site";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { localize, type Locale } from "@/lib/i18n";
import { EditorialCard, type EditorialKind } from "./editorial-card";

export interface EditorialDetailCopy {
  back: string;
  related: string;
  read: string;
  contact?: string;
  archiveLabel?: string;
  sourceLabel?: string;
  sourceNote?: string;
  sources?: string;
  resources?: string;
  author?: string;
  files?: string;
  openFile?: string;
}

export function EditorialDetail({
  entry,
  relatedEntries,
  locale,
  kind,
  copy,
}: {
  entry: EditorialDetailEntry;
  relatedEntries: EditorialDetailEntry[];
  locale: Locale;
  kind: EditorialKind;
  copy: EditorialDetailCopy;
}) {
  return (
    <main className={`editorial-detail-page editorial-detail-page-${kind}`}>
      <section className={`editorial-detail-hero editorial-detail-hero-${kind}`}>
        <div className="editorial-detail-hero-inner">
          <Link className="editorial-back-link" href={`/${locale}/${kind}`}>
            <span aria-hidden="true">←</span> {copy.back}
          </Link>
          {copy.archiveLabel ? (
            <p className="editorial-detail-kicker">{copy.archiveLabel}</p>
          ) : null}
          <div className="editorial-detail-meta">
            <span className="editorial-detail-category">
              {localize(entry.category, locale)}
            </span>
            {entry.dateISO ? (
              <time dateTime={entry.dateISO}>
                {localize(entry.date, locale)}
              </time>
            ) : (
              <span>{localize(entry.date, locale)}</span>
            )}
            {entry.readingTime ? (
              <span>
                {entry.readingTime} {copy.read}
              </span>
            ) : null}
          </div>
          <h1>{localize(entry.title, locale)}</h1>
          <p className="editorial-detail-teaser">
            {localize(entry.teaser, locale)}
          </p>
          {kind === "articles" && entry.author ? (
            <p className="editorial-detail-author">
              <span>{copy.author ?? (locale === "fr" ? "Par" : "By")}</span> {entry.author}
            </p>
          ) : null}
        </div>
      </section>

      <article className={`editorial-detail-body editorial-detail-body-${kind}`}>
        <figure className="editorial-detail-image">
          {entry.image ? (
            <Image
              src={entry.image.src}
              alt={localize(entry.image.alt, locale)}
              fill
              preload
              sizes="(max-width: 760px) 100vw, 900px"
            />
          ) : (
            <span aria-hidden="true">{entry.imageLabel}</span>
          )}
        </figure>
        <div
          className={`editorial-detail-reading-layout editorial-detail-reading-layout-${kind}`}
        >
          <div className="editorial-detail-copy">
            {entry.richBody ? (
              <ArticleRichText document={entry.richBody[locale]} />
            ) : entry.body[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {entry.sources?.length ? (
            <aside
              className="editorial-detail-source-note editorial-detail-sources"
              aria-labelledby="editorial-sources-heading"
            >
              <h2 id="editorial-sources-heading">{copy.sources}</h2>
              <ul>
                {entry.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{localize(source.label, locale)}</a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : copy.sourceNote ? (
            <aside
              className="editorial-detail-source-note"
              aria-label={copy.sourceLabel}
            >
              <p>{copy.sourceLabel}</p>
              <div>{copy.sourceNote}</div>
            </aside>
          ) : null}
          {kind === "articles" && entry.resources?.length ? (
            <aside className="editorial-detail-source-note editorial-detail-sources" aria-labelledby="editorial-resources-heading">
              <h2 id="editorial-resources-heading">{copy.resources ?? (locale === "fr" ? "Ressources" : "Resources")}</h2>
              <ul>
                {entry.resources.map((resource) => (
                  <li key={resource.url}>
                    <a href={resource.url} rel="noopener noreferrer" target="_blank">{resource.text}</a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
        {kind === "articles" && entry.files?.length ? (
          <section className="editorial-files" aria-labelledby="editorial-files-heading">
            <h2 id="editorial-files-heading">{copy.files}</h2>
            <ul>
              {entry.files.map((file) => (
                <li key={file.id}>
                  <a href={file.url} rel="noreferrer" target="_blank" aria-label={`${copy.openFile}: ${file.name} (${file.kind})`}>
                    <span>{file.name}</span>
                    <small>{file.kind} · {file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} Ko` : `${(file.size / (1024 * 1024)).toFixed(1)} Mo`}</small>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {copy.contact ? (
          <Link className="editorial-contact-link" href={`/${locale}/contact`}>
            {copy.contact}
          </Link>
        ) : null}
      </article>

      <section className="editorial-related">
        <div className="editorial-related-inner">
          <h2>{copy.related}</h2>
          <div className="editorial-related-grid">
            {relatedEntries.map((related) => (
              <EditorialCard
                key={related.id}
                entry={related}
                locale={locale}
                kind={kind}
                readLabel={copy.read}
                headingLevel={3}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
