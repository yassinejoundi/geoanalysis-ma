import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { StatCard } from "./stat-card";

export function MessageStatCard({ messages, icon, tone }: {
  messages: { status: string }[];
  icon: IconDefinition;
  tone: string;
}) {
  const newCount = messages.filter((message) => message.status === "new").length;

  return (
    <StatCard
      label="Messages"
      value={messages.length}
      detail={`${newCount} nouveau${newCount === 1 ? "" : "x"} message${newCount === 1 ? "" : "s"}`}
      icon={icon}
      tone={tone}
    />
  );
}
