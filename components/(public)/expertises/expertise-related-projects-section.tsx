import { ProjectCard } from "@/components/(public)/home/cards";
import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { Project } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n";

export function ExpertiseRelatedProjectsSection({
  projects,
  locale,
  kicker,
  title,
  imageLabel,
}: {
  projects: Project[];
  locale: Locale;
  kicker: string;
  title: string;
  imageLabel: string;
}) {
  return (
    <section className="expertise-related-projects">
      <div className="expertise-section-inner">
        <SectionHeading kicker={kicker} title={title} />
        <ul className="expertise-project-grid">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                project={project}
                locale={locale}
                imageLabel={imageLabel}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
