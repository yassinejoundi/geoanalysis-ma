import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectDetail } from "@/lib/content/project-details";
import { localize, type Locale } from "@/lib/i18n";

export function ProjectOverviewSection({
  detail,
  locale,
  copy,
}: {
  detail: ProjectDetail;
  locale: Locale;
  copy: {
    descriptionKicker: string;
    descriptionTitle: string;
    methodologyKicker: string;
    methodologyTitle: string;
  };
}) {
  return (
    <section className="project-overview-section">
      <div>
        <SectionHeading
          kicker={copy.descriptionKicker}
          title={copy.descriptionTitle}
        />
        <p className="project-description">
          {localize(detail.description, locale)}
        </p>
      </div>
      <div>
        <SectionHeading
          kicker={copy.methodologyKicker}
          title={copy.methodologyTitle}
        />
        <ol className="project-method-list">
          {detail.methods.map((method, index) => (
            <li key={`${index}-${method.fr}`}>{localize(method, locale)}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
