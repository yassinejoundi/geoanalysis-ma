import Link from "next/link";
import Image from "next/image";
import type { EditorialEntry, Project } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function ProjectCard({
  project,
  locale,
  imageLabel,
}: {
  project: Project;
  locale: Locale;
  imageLabel: string;
}) {
  return (
    <Link
      className="home-project-card"
      href={`/${locale}/realisations/${project.slug}`}>
      <span
        className="home-placeholder home-project-placeholder"
        aria-hidden="true">
        {imageLabel}
      </span>
      <span className="home-project-copy">
        <span className="home-project-meta">
          {localize(project.domain, locale)} <span aria-hidden="true">/</span>{" "}
          {project.location}
        </span>
        <span className="home-project-title">
          {localize(project.title, locale)}
        </span>
        <span className="home-project-teaser">
          {localize(project.teaser, locale)}
        </span>
      </span>
    </Link>
  );
}

export function EditorialCard({
  entry,
  locale,
  kind,
  readLabel,
  variant = "featured",
}: {
  entry: EditorialEntry;
  locale: Locale;
  kind: "actualites" | "articles";
  readLabel?: string;
  variant?: "featured" | "compact";
}) {
  return (
    <Link
      className={`home-editorial-card home-editorial-card-${kind} home-editorial-card-${variant}`}
      href={`/${locale}/${kind}/${entry.slug}`}>
      <span className="home-editorial-image">
        {entry.image ? (
          <Image
            src={entry.image.src}
            alt={localize(entry.image.alt, locale)}
            fill
            sizes={variant === "featured"
              ? "(min-width: 1360px) 760px, (min-width: 900px) 55vw, 100vw"
              : "(min-width: 900px) 180px, 30vw"}
          />
        ) : (
          <span className="home-editorial-image-label">{entry.imageLabel}</span>
        )}
      </span>
      <div className="home-editorial-copy">
        <div className="home-editorial-meta">
          <span>{localize(entry.category, locale)}</span>
          <span className="home-editorial-meta-divider" aria-hidden="true">·</span>
          {entry.dateISO ? (
            <time dateTime={entry.dateISO}>{localize(entry.date, locale)}</time>
          ) : (
            <span>{localize(entry.date, locale)}</span>
          )}
          {entry.readingTime && readLabel && (
            <span className="home-editorial-reading-time">
              {entry.readingTime} {readLabel}
            </span>
          )}
        </div>
        <h4 className="home-editorial-title">
          {localize(entry.title, locale)}
        </h4>
        {variant === "featured" && (
          <p className="home-editorial-teaser">
            {localize(entry.teaser, locale)}
          </p>
        )}
        <span className="home-editorial-card-arrow" aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
