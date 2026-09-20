import Link from "next/link";
import { methodGroups } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";
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
            href={`/${locale}/methodes-technologies`}>
            {content.methodsLink} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-method-grid">
          {methodGroups.flatMap((group) =>
            group.items.slice(0, 2).map((method) => (
              <div key={`${group.id}-${method}`}>
                <span aria-hidden="true" />
                <h3>{method}</h3>
                <p>{localize(group.title, locale)}</p>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
