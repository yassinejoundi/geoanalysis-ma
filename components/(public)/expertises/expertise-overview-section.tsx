import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { SectionHeading } from "@/components/(public)/home/section-heading";
import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";

export function ExpertiseOverviewSection({
  detail,
  locale,
}: {
  detail: ExpertiseDetail;
  locale: Locale;
}) {
  const copy = expertisePageCopy[locale];

  return (
    <section className="expertise-overview-section">
      <div className="expertise-overview-inner">
        <SectionHeading kicker={copy.overview} title={copy.overviewTitle} />
        <p className="expertise-overview-copy">{localize(detail.overview, locale)}</p>
      </div>
    </section>
  );
}
