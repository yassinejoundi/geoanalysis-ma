import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/(public)/home/section-heading";

export function ExpertiseContextSection({
  detail,
  locale,
  copy,
}: {
  detail: ExpertiseDetail;
  locale: Locale;
  copy: { context: string; contextTitle: string; approach: string };
}) {
  return (
    <section className="expertise-context-section">
      <div className="expertise-context-copy">
        <SectionHeading kicker={copy.context} title={copy.contextTitle} />
        <p>{localize(detail.context, locale)}</p>
        <h2 className="expertise-subheading">{copy.approach}</h2>
        <p>{localize(detail.approach, locale)}</p>
      </div>
      <div className="expertise-detail-image" aria-hidden="true">
        {localize(detail.imageLabel, locale)}
      </div>
    </section>
  );
}
