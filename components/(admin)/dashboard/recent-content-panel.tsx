import Link from "next/link";
import type { AdminDashboardSection } from "@/lib/content/admin";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";

export function RecentContentPanel({ section }: { section: AdminDashboardSection }) {
  const titleId = `dashboard-${section.id}-title`;

  return (
    <section className="panel" aria-labelledby={titleId}>
      <div className="panel-heading">
        <h2 id={titleId}>{section.title}</h2>
        <Link className="panel-link" href={section.href} aria-label={section.allLabel}>
          Tout voir <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="record-list">
        {section.items.map((item, index) => (
          <li className="record-row" key={item.id}>
            <span className={`record-thumb${index % 3 ? ` record-thumb-${index % 3 + 1}` : ""}`} aria-hidden="true" />
            <span className="record-copy">
              <span className="record-title">{item.title}</span>
              <span className="record-meta">{item.meta}</span>
            </span>
            <StatusBadge status={item.state} />
          </li>
        ))}
      </ul>
    </section>
  );
}
