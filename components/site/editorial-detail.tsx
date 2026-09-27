import Image from "next/image";
import Link from "next/link";
import type { EditorialDetailEntry } from "@/lib/content/site";
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
            {entry.body[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {copy.sourceNote ? (
            <aside
              className="editorial-detail-source-note"
              aria-label={copy.sourceLabel}
            >
              <p>{copy.sourceLabel}</p>
              <div>{copy.sourceNote}</div>
            </aside>
          ) : null}
        </div>
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
