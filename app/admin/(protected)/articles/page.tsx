import { EditorialManager } from "@/components/(admin)/editorial/editorial-manager";
import type { EditorialDraft } from "@/components/(admin)/editorial/editorial-editor-fields";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminArticlesPage() {
  const items = await requireAdminRecords<EditorialDraft>("articles");
  return <EditorialManager key="articles" kind="article" initialItems={items} />;
}
