import { EditorialManager } from "@/components/(admin)/editorial/editorial-manager";
import type { EditorialDraft } from "@/components/(admin)/editorial/editorial-editor-fields";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminNewsPage() {
  const items = await requireAdminRecords<EditorialDraft>("news");
  return <EditorialManager key="actualites" kind="news" initialItems={items} />;
}
