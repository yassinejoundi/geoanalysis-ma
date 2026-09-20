import { MessagesManager } from "@/components/(admin)/messages/messages-manager";
import { AdminMessagesProvider } from "@/components/(admin)/shared/admin-messages-provider";
import type { AdminMessage } from "@/lib/content/admin";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminMessagesPage() {
  const messages = await requireAdminRecords<AdminMessage>("messages");
  return <AdminMessagesProvider initialMessages={messages}><MessagesManager /></AdminMessagesProvider>;
}
