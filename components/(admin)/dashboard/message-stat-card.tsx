"use client";

import { useAdminMessages } from "@/components/(admin)/shared/admin-messages-provider";
import { StatCard } from "./stat-card";

export function MessageStatCard() {
  const { messages } = useAdminMessages();
  const newCount = messages.filter((message) => message.status === "new").length;

  return (
    <StatCard
      label="Messages"
      value={messages.length}
      detail={`${newCount} nouveau${newCount === 1 ? "" : "x"}`}
    />
  );
}
