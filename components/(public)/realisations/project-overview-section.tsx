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
      {localize(detail.description, locale).trim() && (
        <div>
          <SectionHeading kicker={copy.descriptionKicker} title={copy.descriptionTitle} />
          <p className="project-description">{localize(detail.description, locale)}</p>
        </div>
      )}
      {localize(detail.methodology, locale).trim() && (
        <div>
          <SectionHeading kicker={copy.methodologyKicker} title={copy.methodologyTitle} />
          <p className="project-description">{localize(detail.methodology, locale)}</p>
        </div>
      )}
    </section>
  );
}
