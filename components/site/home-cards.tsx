import Link from "next/link";
import type { EditorialEntry, Project } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return <div className="home-section-heading"><p className="home-kicker">{kicker}</p><h2>{title}</h2></div>;
}

export function ProjectCard({ project, locale, imageLabel }: { project: Project; locale: Locale; imageLabel: string }) {
  return <Link className="home-project-card" href={`/${locale}/realisations/${project.slug}`}><span className="home-placeholder home-project-placeholder" aria-hidden="true">{imageLabel}</span><span className="home-project-copy"><span className="home-project-meta">{localize(project.domain, locale)} <span aria-hidden="true">/</span> {project.location}</span><span className="home-project-title">{localize(project.title, locale)}</span><span className="home-project-teaser">{localize(project.teaser, locale)}</span></span></Link>;
}

export function EditorialCard({ entry, locale, kind, readLabel }: { entry: EditorialEntry; locale: Locale; kind: "actualites" | "articles"; readLabel?: string }) {
  return <Link className={kind === "actualites" ? "home-news-card" : "home-article-card"} href={`/${locale}/${kind}/${entry.slug}`}><span className="home-editorial-meta">{localize(entry.category, locale)}</span><span className="home-editorial-title">{localize(entry.title, locale)}</span><span className="home-editorial-date">{entry.date}{entry.readingTime && readLabel ? ` · ${entry.readingTime} ${readLabel}` : ""}</span></Link>;
}
