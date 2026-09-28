import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getPublicProjects } from "@/lib/server/data/admin";
import type { HomeContent } from "./content";
import { ProjectCard } from "./cards";
import { SectionHeading } from "./section-heading";

export async function ProjectsSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  const projects = await getPublicProjects();
  if (projects.length === 0) return null;

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
