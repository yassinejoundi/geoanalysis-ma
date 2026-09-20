import { SectionHeading } from "@/components/(public)/home/section-heading";
import { methodGroups } from "@/lib/content/site";
import { localize, type Locale } from "@/lib/i18n";

export function MethodsGroupsSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="methods-groups"
      aria-label={locale === "fr" ? "Groupes de méthodes" : "Method groups"}>
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
              <article className="methods-item" key={item}>
                <h3>{item}</h3>
                <p>{localize(group.itemDescriptions[item], locale)}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
