import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/(public)/home/section-heading";

export function ExpertiseMethodologySection({
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
    <section className="expertise-methodology">
      <div className="expertise-section-inner">
        <SectionHeading kicker={kicker} title={title} />
        <ol className="expertise-method-list">
          {detail.methods.map((method) => (
            <li key={method.number}>
              <span>{method.number}</span>
              <h3>{localize(method.name, locale)}</h3>
              <p>{localize(method.description, locale)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
