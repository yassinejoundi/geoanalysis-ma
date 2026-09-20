import Link from "next/link";
import { expertiseDetails } from "@/lib/content/expertise-details";
import type { Expertise } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/(public)/home/section-heading";

export function ExpertiseIndexSection({
  expertises,
  locale,
  copy,
}: {
  expertises: Expertise[];
  locale: Locale;
  copy: {
    indexSectionKicker: string;
    indexSectionTitle: string;
    openDetails: string;
  };
}) {
  return (
    <section className="expertise-index-section">
      <SectionHeading
        kicker={copy.indexSectionKicker}
        title={copy.indexSectionTitle}
      />
      <ul className="expertise-index-grid">
        {expertises.map((expertise) => (
          <li key={expertise.id}>
            <Link
              className="expertise-index-card"
              href={`/${locale}/expertises/${expertise.slug}`}>
              <span className="expertise-index-number">{expertise.number}</span>
              <span className="expertise-index-image" aria-hidden="true">
                {localize(expertiseDetails[expertise.id].imageLabel, locale)}
              </span>
              <span className="expertise-index-title">
                {localize(expertise.name, locale)}
              </span>
              <span className="expertise-index-summary">
                {localize(expertise.summary, locale)}
              </span>
              <ul className="expertise-index-services">
                {expertise.subServices.map((service) => (
                  <li key={service.name.fr}>
                    {localize(service.name, locale)}
                  </li>
                ))}
              </ul>
              <span className="expertise-index-action">
                {copy.openDetails}
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
