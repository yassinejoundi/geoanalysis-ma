import { ProjectCard } from "@/components/(public)/home/cards";
import { projectDetails } from "@/lib/content/project-details";
import type { Project } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function ProjectsListSection({ projects, locale }: { projects: Project[]; locale: Locale }) {
  return (
    <section className="projects-list-section" aria-label={localize({ fr: "Liste des réalisations", en: "Project list" }, locale)}>
      <ul className="projects-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} locale={locale} imageLabel={localize(projectDetails[project.id].imageLabel, locale)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
