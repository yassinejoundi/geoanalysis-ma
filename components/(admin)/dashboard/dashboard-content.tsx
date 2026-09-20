import type { AdminDashboardPipelineStage, AdminDashboardSection } from "@/lib/content/admin";
import { PipelinePanel } from "./pipeline-panel";
import { RecentContentPanel } from "./recent-content-panel";
import { MessageStatCard } from "./message-stat-card";
import { StatCard } from "./stat-card";

export function DashboardContent({ stats, sections, pipeline, messages }: {
  stats: { label: string; value: number; detail: string }[];
  sections: AdminDashboardSection[];
  pipeline: AdminDashboardPipelineStage[];
  messages: { status: string }[];
}) {
  return (
    <main className="dashboard-content">
      <div className="stats-grid">
        {stats.map((stat) => stat.label === "Messages"
          ? <MessageStatCard key={stat.label} messages={messages} />
          : <StatCard key={stat.label} {...stat} />)}
      </div>
      <div className="lists-grid">
        {sections.map((section) => <RecentContentPanel key={section.id} section={section} />)}
      </div>
      <PipelinePanel stages={pipeline} />
    </main>
  );
}
