import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectDetail } from "@/lib/content/project-details";
import { localize, type Locale } from "@/lib/i18n";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

export function ProjectResultsSection({
  detail,
  locale,
  copy,
}: {
  detail: ProjectDetail;
  locale: Locale;
  copy: { resultsKicker: string; resultsTitle: string };
}) {
  const results = parseArticleDocument(localize(detail.results, locale));
  return (
    <section className="project-results-section">
      <SectionHeading kicker={copy.resultsKicker} title={copy.resultsTitle} />
      <div className="project-description project-rich-content"><ArticleRichText document={results} /></div>
    </section>
  );
}
