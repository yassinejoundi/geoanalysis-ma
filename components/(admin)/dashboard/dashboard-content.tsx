import { adminDashboardPipeline, adminDashboardSections, adminDashboardStats } from "@/lib/content/admin";
import { PipelinePanel } from "./pipeline-panel";
import { RecentContentPanel } from "./recent-content-panel";
import { MessageStatCard } from "./message-stat-card";
import { StatCard } from "./stat-card";

export function DashboardContent() {
  return (
    <main className="dashboard-content">
      <div className="stats-grid">
        {adminDashboardStats.map((stat) => stat.label === "Messages"
          ? <MessageStatCard key={stat.label} />
          : <StatCard key={stat.label} {...stat} />)}
      </div>
      <div className="lists-grid">
        {adminDashboardSections.map((section) => <RecentContentPanel key={section.id} section={section} />)}
      </div>
      <PipelinePanel stages={adminDashboardPipeline} />
    </main>
  );
}
