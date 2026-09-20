import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import type { Project } from "@/lib/content/site";
import { localize, localizedHref, type Locale } from "@/lib/i18n";

export function ProjectDetailHero({
  project,
  locale,
  backLabel,
}: {
  project: Project;
  locale: Locale;
  backLabel: string;
}) {
  return (
    <>
      <div className="project-detail-back">
        <div className="project-detail-back-inner">
          <Link
            className="project-back-link"
            href={localizedHref(locale, "realisations")}>
            <span aria-hidden="true">←</span> {backLabel}
          </Link>
        </div>
      </div>
      <PageHero
        kicker={`${localize(project.domain, locale)} / ${project.location}`}
        title={localize(project.title, locale)}
        lead={localize(project.teaser, locale)}
      />
    </>
  );
}
