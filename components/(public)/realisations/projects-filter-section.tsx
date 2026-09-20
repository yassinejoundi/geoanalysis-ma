import Link from "next/link";
import { expertises, type Expertise } from "@/lib/content/site";
import { localize, localizedHref, type Locale } from "@/lib/i18n";

export function ProjectsFilterSection({
  locale,
  activeExpertiseId,
  resultCount,
  copy,
}: {
  locale: Locale;
  activeExpertiseId?: Expertise["id"];
  resultCount: number;
  copy: { filterLabel: string; allDomains: string; activeFilter: string; projectCount: string };
}) {
  const activeExpertise = expertises.find((expertise) => expertise.id === activeExpertiseId);
  const filters = [
    { id: undefined, label: copy.allDomains },
    ...expertises.map((expertise) => ({ id: expertise.id, label: localize(expertise.name, locale) })),
  ];
  const activeLabel = activeExpertise ? localize(activeExpertise.name, locale) : copy.allDomains;

  return (
    <section className="projects-filter-section">
      <nav aria-label={copy.filterLabel}>
        <ul className="projects-filter-list">
          {filters.map((filter) => (
            <li key={filter.id ?? "all"}>
              <Link
                className="projects-filter-link"
                href={filter.id ? `${localizedHref(locale, "realisations")}?expertise=${filter.id}` : localizedHref(locale, "realisations")}
                aria-current={filter.id === activeExpertiseId ? "page" : undefined}
              >
                {filter.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="projects-active-filter">
        <span>{copy.activeFilter}: </span>{activeLabel} · {resultCount} {copy.projectCount}
      </p>
    </section>
  );
}
