import { StatCard } from "./stat-card";

export function MessageStatCard({ messages }: { messages: { status: string }[] }) {
  const newCount = messages.filter((message) => message.status === "new").length;

  return (
    <StatCard
      label="Messages"
    value={messages.length}
      detail={`${newCount} nouveau${newCount === 1 ? "" : "x"}`}
    />
  );
}
