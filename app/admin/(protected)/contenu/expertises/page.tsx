import { ExpertisePageManager } from "@/components/(admin)/contenu/expertise-page-manager";
import { expertisePageContent, type ExpertisePageContent, type ExpertisePageContentRecord } from "@/components/(public)/expertises/content";
import { locales, type Locale } from "@/lib/i18n";
import { requireAdminRecords } from "@/lib/server/data/admin";
import { parseExpertisePageContentFields } from "@/lib/server/validation";

export default async function AdminExpertisePageContentPage() {
  const records = await requireAdminRecords<ExpertisePageContentRecord>("expertisePage");
  const initialContent: Record<Locale, ExpertisePageContent> = { ...expertisePageContent };
  for (const record of records) {
    if (locales.includes(record.locale)) {
      initialContent[record.locale] =
        parseExpertisePageContentFields(record.content) ?? expertisePageContent[record.locale];
    }
  }
  return <ExpertisePageManager initialContent={initialContent} />;
}
