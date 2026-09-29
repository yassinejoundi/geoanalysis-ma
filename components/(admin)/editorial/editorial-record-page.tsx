import { notFound } from "next/navigation";
import { EditorialRecordEditor } from "@/components/(admin)/editorial/editorial-record-editor";
import type { EditorialDraft, EditorialKind } from "@/components/(admin)/editorial/editorial-editor-fields";
import type { LocalizedText } from "@/lib/i18n";
import { requireAdminRecords } from "@/lib/server/data/admin";

export async function EditorialRecordPage({ kind, slug }: { kind: EditorialKind; slug: string }) {
  const isArticle = kind === "article";
  const items = await requireAdminRecords<EditorialDraft>(isArticle ? "articles" : "news");
  const isNew = slug === (isArticle ? "nouveau" : "nouvelle");
  const initialItem = isNew ? null : items.find((item) => item.id === slug) ?? null;
  if (!isNew && !initialItem) notFound();

  const categories = items.reduce<LocalizedText[]>((result, item) => {
    if (!result.some((category) => category.fr === item.category.fr)) result.push(item.category);
    return result;
  }, []);

  return <EditorialRecordEditor kind={kind} initialItem={initialItem} categories={categories} />;
}
