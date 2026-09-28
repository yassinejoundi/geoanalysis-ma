import Link from "next/link";
import type { ExpertisePageContent } from "@/components/(public)/expertises/content";
import type { Locale } from "@/lib/i18n";

export function ExpertiseIndexSection({
  locale,
  content,
}: {
  locale: Locale;
  content: ExpertisePageContent;
}) {
  const areas = content.areas;

  return (
    <>
      <nav className="services-domain-nav" aria-label={content.indexNavLabel}>
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
        aria-label={content.indexSectionTitle}
      >
        <div className="services-catalog-inner">
          <div className="services-catalog-heading">
            <p className="home-kicker">{content.indexSectionKicker}</p>
            <h2>{content.indexSectionTitle}</h2>
          </div>
          <p className="services-catalog-lead">{content.indexSectionLead}</p>

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
