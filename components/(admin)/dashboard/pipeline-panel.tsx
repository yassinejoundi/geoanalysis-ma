import Link from "next/link";
import type { AdminDashboardPipelineStage } from "@/lib/content/admin";

export function PipelinePanel({ stages }: { stages: AdminDashboardPipelineStage[] }) {
  return (
    <section className="panel pipeline-panel" aria-labelledby="dashboard-pipeline-title">
      <div className="panel-heading">
        <h2 id="dashboard-pipeline-title">Suivi commercial</h2>
        <Link className="panel-link" href="/admin/messages" aria-label="Voir tous les messages">
          Tout voir <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="pipeline-grid">
        {stages.map((stage) => (
          <li className={`pipeline-stage pipeline-${stage.tone}`} key={stage.id}>
            <span className="pipeline-label">{stage.label}</span>
            <span className="pipeline-value">{stage.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
