import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";

export function ExpertiseCapabilitiesSection({
  detail,
  locale,
  copy,
}: {
  detail: ExpertiseDetail;
  locale: Locale;
  copy: { technologies: string; deliverables: string; audience: string };
}) {
  const groups = [
    { title: copy.technologies, items: detail.technologies },
    { title: copy.deliverables, items: detail.deliverables },
    { title: copy.audience, items: detail.audience },
  ];

  return (
    <section className="expertise-capabilities">
      {groups.map((group) => (
        <div key={group.title}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.fr}>{localize(item, locale)}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
