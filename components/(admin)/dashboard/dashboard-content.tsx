import type { AdminDashboardPipelineStage, AdminDashboardSection } from "@/lib/content/admin";
import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faBullseye, faChartColumn, faEnvelope, faFolderOpen, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PipelinePanel } from "./pipeline-panel";
import { RecentContentPanel } from "./recent-content-panel";
import { MessageStatCard } from "./message-stat-card";
import { StatCard } from "./stat-card";

const metricAppearance: Record<string, { icon: IconDefinition; tone: string }> = {
  Projets: { icon: faFolderOpen, tone: "projects" },
  Expertises: { icon: faBullseye, tone: "expertises" },
  Publications: { icon: faNewspaper, tone: "publications" },
  Messages: { icon: faEnvelope, tone: "messages" },
};

export function DashboardContent({ stats, sections, pipeline, messages }: {
  stats: { label: string; value: number; detail: string }[];
  sections: AdminDashboardSection[];
  pipeline: AdminDashboardPipelineStage[];
  messages: { status: string }[];
}) {
  return (
    <main className="dashboard-content">
      <section className="dashboard-welcome" aria-labelledby="dashboard-welcome-title">
        <div className="dashboard-welcome-copy">
          <p className="dashboard-kicker">Aperçu de votre activité</p>
          <h2 id="dashboard-welcome-title">Le site en un coup d’œil</h2>
          <p>Suivez vos contenus, vos publications et les demandes reçues.</p>
        </div>
        <nav className="dashboard-actions" aria-label="Accès rapides">
          <Link className="dashboard-shortcut dashboard-shortcut-primary" href="/admin/realisations">
            <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
            <span>Gérer les réalisations</span>
            <FontAwesomeIcon className="dashboard-shortcut-arrow" icon={faArrowRight} aria-hidden="true" />
          </Link>
          <Link className="dashboard-shortcut dashboard-shortcut-secondary" href="/admin/messages">
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            <span>Gérer les messages</span>
            <FontAwesomeIcon className="dashboard-shortcut-arrow" icon={faArrowRight} aria-hidden="true" />
          </Link>
        </nav>
      </section>
      <section className="stats-grid" aria-label="Indicateurs clés">
        {stats.map((stat) => {
          const appearance = metricAppearance[stat.label] ?? { icon: faChartColumn, tone: "default" };
          return stat.label === "Messages"
            ? <MessageStatCard key={stat.label} messages={messages} icon={appearance.icon} tone={appearance.tone} />
            : <StatCard key={stat.label} {...stat} {...appearance} />;
        })}
      </section>
      <div className="lists-grid">
        {sections.map((section) => <RecentContentPanel key={section.id} section={section} />)}
      </div>
      <PipelinePanel stages={pipeline} />
    </main>
  );
}
