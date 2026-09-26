import { SectionHeading } from "@/components/(public)/home/section-heading";
import { methodGroups } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function MethodsGroupsSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="methods-groups"
      aria-label={locale === "fr" ? "Groupes de prestations" : "Service groups"}>
      {methodGroups.map((group) => (
        <section className="methods-group" key={group.id}>
          <div className="methods-group-heading">
            <SectionHeading
              kicker={group.id}
              title={localize(group.title, locale)}
            />
          </div>
          <div className="methods-grid">
            {group.items.map((item) => (
              <article className="methods-item" key={item.name.fr}>
                <h3>{localize(item.name, locale)}</h3>
                <p>{localize(item.description, locale)}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
