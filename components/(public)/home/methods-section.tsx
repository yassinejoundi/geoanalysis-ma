import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "./content";
import { SectionHeading } from "./section-heading";

export function MethodsSection({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent;
}) {
  return (
    <section className="home-band home-methods">
      <div className="home-section-inner">
        <div className="home-section-heading-row">
          <SectionHeading
            kicker={content.methods}
            title={content.methodsTitle}
          />
          <Link
            className="home-text-link"
            href={`/${locale}/expertises`}>
            {content.methodsLink} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-method-grid">
          {content.methodItems.map(([name, category], index) => (
              <div key={`${index}-${name}`}>
                <span aria-hidden="true" />
                <h3>{name}</h3>
                <p>{category}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
