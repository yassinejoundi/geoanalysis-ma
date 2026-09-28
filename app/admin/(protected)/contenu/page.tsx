import { HomeContentManager } from "@/components/(admin)/contenu/home-content-manager";
import { homeContent, type HomeContent, type HomeContentRecord } from "@/components/(public)/home/content";
import { requireAdminRecords } from "@/lib/server/data/admin";
import { parseHomeContentFields } from "@/lib/server/validation";
import type { Locale } from "@/lib/i18n";

export default async function AdminHomeContentPage() {
  const records = await requireAdminRecords<HomeContentRecord>("home");
  const initialContent: Record<Locale, HomeContent> = { ...homeContent };

  for (const record of records) {
    if (record.locale === "fr" || record.locale === "en") {
      initialContent[record.locale] = parseHomeContentFields(record.content) ?? homeContent[record.locale];
    }
  }

  return <HomeContentManager initialContent={initialContent} />;
}
