import Link from "next/link";
import { projects } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { ProjectCard } from "./cards";
import { SectionHeading } from "./section-heading";

export function ProjectsSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  return (
    <section className="home-section">
      <div className="home-section-heading-row">
        <SectionHeading
          kicker={content.projects}
          title={content.projectsTitle}
        />
        <Link className="home-text-link" href={`/${locale}/realisations`}>
          {content.projectsLink} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="home-project-grid">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            imageLabel={content.projectImage}
          />
        ))}
      </div>
    </section>
  );
}
