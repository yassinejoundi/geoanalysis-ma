import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StatCardProps = {
  label: string;
  value: number;
  detail: string;
  icon: IconDefinition;
  tone: string;
};

export function StatCard({ label, value, detail, icon, tone }: StatCardProps) {
  return (
    <article className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-topline">
        <h2>{label}</h2>
        <span className="stat-icon" aria-hidden="true">
          <FontAwesomeIcon icon={icon} />
        </span>
      </div>
      <div className="stat-value">{value.toLocaleString("fr-FR")}</div>
      <p>{detail}</p>
    </article>
  );
}
