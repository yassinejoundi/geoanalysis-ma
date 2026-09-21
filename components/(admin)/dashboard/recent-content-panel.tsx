import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFileLines, faMapLocationDot, faNewspaper, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminDashboardSection } from "@/lib/content/admin";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";

const sectionIcons: Record<string, IconDefinition> = {
  projects: faMapLocationDot,
  articles: faFileLines,
  news: faNewspaper,
};

export function RecentContentPanel({ section }: { section: AdminDashboardSection }) {
  const titleId = `dashboard-${section.id}-title`;

  return (
    <section className="panel" aria-labelledby={titleId}>
      <div className="panel-heading">
        <div className="panel-heading-title">
          <span className="panel-heading-icon" aria-hidden="true">
            <FontAwesomeIcon icon={sectionIcons[section.id] ?? faFileLines} />
          </span>
          <h2 id={titleId}>{section.title}</h2>
        </div>
        <Link className="panel-link" href={section.href}>
          <span>{section.allLabel}</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      </div>
      <ul className="record-list">
        {section.items.length > 0
          ? section.items.map((item) => (
              <li className="record-row" key={item.id}>
                <span className="record-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={sectionIcons[section.id] ?? faFileLines} />
                </span>
                <span className="record-copy">
                  <span className="record-title">{item.title}</span>
                  <span className="record-meta">{item.meta}</span>
                </span>
                <StatusBadge status={item.state} />
              </li>
            ))
          : <li className="record-empty">Les nouveaux contenus apparaîtront ici.</li>}
      </ul>
    </section>
  );
}
