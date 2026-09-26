import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/(public)/home/section-heading";

export function ExpertiseServicesSection({
  detail,
  locale,
  kicker,
  title,
}: {
  detail: ExpertiseDetail;
  locale: Locale;
  kicker: string;
  title: string;
}) {
  return (
    <section className="expertise-services" id="prestations">
      <div className="expertise-section-inner">
        <SectionHeading kicker={kicker} title={title} />
        <ol className="expertise-service-list">
          {detail.services.map((service) => (
            <li key={service.number}>
              <span aria-hidden="true">{service.number}</span>
              <div>
                <h3>{localize(service.name, locale)}</h3>
                <p>{localize(service.description, locale)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
