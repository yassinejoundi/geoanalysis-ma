import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ProjectDetail } from "@/lib/content/project-details";
import { localize, type Locale } from "@/lib/i18n";
import { ArticleRichText } from "@/components/site/article-rich-text";
import { parseArticleDocument } from "@/lib/content/article-document";

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
  const description = parseArticleDocument(localize(detail.description, locale));
  const methodology = parseArticleDocument(localize(detail.methodology, locale));
  return (
    <section className="project-overview-section">
      {description.content.length > 0 && (
        <div>
          <SectionHeading kicker={copy.descriptionKicker} title={copy.descriptionTitle} />
          <div className="project-description project-rich-content"><ArticleRichText document={description} /></div>
        </div>
      )}
      {methodology.content.length > 0 && (
        <div>
          <SectionHeading kicker={copy.methodologyKicker} title={copy.methodologyTitle} />
          <div className="project-description project-rich-content"><ArticleRichText document={methodology} /></div>
        </div>
      )}
    </section>
  );
}
