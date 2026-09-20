import Link from "next/link";
import type { EditorialEntry } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export type EditorialKind = "actualites" | "articles";

export function EditorialCard({
  entry,
  locale,
  kind,
  readLabel,
  headingLevel = 2,
}: {
  entry: EditorialEntry;
  locale: Locale;
  kind: EditorialKind;
  readLabel?: string;
  headingLevel?: 2 | 3;
}) {
  const Title = headingLevel === 3 ? "h3" : "h2";

  return (
    <Link
      className={`editorial-card editorial-card-${kind}`}
      href={`/${locale}/${kind}/${entry.slug}`}>
      <span className="editorial-card-image" aria-hidden="true">
        {entry.imageLabel}
      </span>
      <div className="editorial-card-content">
        <span className="editorial-card-meta">
          <span className="editorial-card-category">
            {localize(entry.category, locale)}
          </span>
          <span>{entry.date}</span>
        </span>
        <Title className="editorial-card-title">
          {localize(entry.title, locale)}
        </Title>
        <span className="editorial-card-teaser">
          {localize(entry.teaser, locale)}
        </span>
        {entry.readingTime && readLabel ? (
          <span className="editorial-card-reading-time">
            {entry.readingTime} {readLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
