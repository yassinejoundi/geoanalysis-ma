import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { serviceAreas } from "@/components/(public)/expertises/content";

export function ExpertiseIndexSection({
  locale,
  copy,
}: {
  locale: Locale;
  copy: {
    indexNavLabel: string;
    indexSectionKicker: string;
    indexSectionTitle: string;
    indexSectionLead: string;
  };
}) {
  const areas = serviceAreas[locale];

  return (
    <>
      <nav className="services-domain-nav" aria-label={copy.indexNavLabel}>
        <ul>
          {areas.map((area) => (
            <li key={area.id}>
              <Link href={`#service-area-${area.id}`}>
                <span>{area.number}</span>
                <span>{area.title}</span>
                <span aria-hidden="true">↘</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section
        className="services-catalog"
        id="services-list"
        aria-label={copy.indexSectionTitle}
      >
        <div className="services-catalog-inner">
          <div className="services-catalog-heading">
            <p className="home-kicker">{copy.indexSectionKicker}</p>
            <h2>{copy.indexSectionTitle}</h2>
          </div>
          <p className="services-catalog-lead">{copy.indexSectionLead}</p>

          <ol className="services-area-list">
            {areas.map((area) => (
              <li
                className="services-area"
                id={`service-area-${area.id}`}
                key={area.id}
              >
                <span className="services-area-number">{area.number}</span>
                <div className="services-area-content">
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                  <ul>
                    {area.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
