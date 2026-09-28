import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectDetail } from "@/lib/content/project-details";
import { localize, type Locale } from "@/lib/i18n";

export function ProjectResultsSection({
  detail,
  locale,
  copy,
}: {
  detail: ProjectDetail;
  locale: Locale;
  copy: { resultsKicker: string; resultsTitle: string };
}) {
  return (
    <section className="project-results-section">
      <SectionHeading kicker={copy.resultsKicker} title={copy.resultsTitle} />
      <p className="project-description">{localize(detail.results, locale)}</p>
    </section>
  );
}
