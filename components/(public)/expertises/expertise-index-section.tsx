import Image from "next/image";
import Link from "next/link";
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
    <section className="expertise-index-section" id="expertise-catalog" aria-label={copy.indexSectionTitle}>
      <SectionHeading
        kicker={copy.indexSectionKicker}
        title={copy.indexSectionTitle}
      />
      <ul className="expertise-index-grid">
        {expertises.map((expertise) => (
          <li key={expertise.id}>
            <Link
              className="expertise-index-card"
              id={`expertise-${expertise.id}`}
              href={`/${locale}/expertises/${expertise.slug}`}>
              <span className="expertise-index-media">
                <Image
                  alt={localize(expertise.image.alt, locale)}
                  fill
                  sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 760px) calc(50vw - 30px), 32vw"
                  src={expertise.image.src}
                />
              </span>
              <div className="expertise-index-content">
                <span className="expertise-index-number">{expertise.number}</span>
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
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
