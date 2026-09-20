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
      <dl className="project-results-list">
        {detail.results.map((result) => (
          <div key={`${result.value}-${result.label.fr}`}>
            <dt>{result.value}</dt>
            <dd>{localize(result.label, locale)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
