import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import type { Expertise } from "@/lib/content/site";
import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";

export function ExpertiseDetailHero({
  expertise,
  detail,
  locale,
  copy,
}: {
  expertise: Expertise;
  detail: ExpertiseDetail;
  locale: Locale;
  copy: { detailKicker: string; backToIndex: string };
}) {
  return (
    <>
      <div className="expertise-detail-back">
        <div className="expertise-detail-back-inner">
          <Link className="expertise-back-link" href={`/${locale}/expertises`}>
            <span aria-hidden="true">←</span> {copy.backToIndex}
          </Link>
        </div>
      </div>
      <PageHero
        kicker={`${expertise.number} — ${copy.detailKicker}`}
        title={localize(expertise.name, locale)}
        lead={localize(detail.intro, locale)}
      />
      <ul className="expertise-detail-services" aria-label={localize({ fr: "Sous-services", en: "Sub-services" }, locale)}>
        {expertise.subServices.map((service) => (
          <li key={service.name.fr}>{localize(service.name, locale)}</li>
        ))}
      </ul>
    </>
  );
}
