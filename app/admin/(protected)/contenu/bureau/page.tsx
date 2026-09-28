import { BureauManager } from "@/components/(admin)/contenu/bureau-manager";
import type { TeamDraft } from "@/components/(admin)/equipe/team-editor-fields";
import type { PartnerDraft } from "@/components/(admin)/partenaires/partner-editor-fields";
import { bureauContent, type BureauContentRecord } from "@/components/(public)/bureau/content";
import { locales, type Locale } from "@/lib/i18n";
import { requireAdminRecords } from "@/lib/server/data/admin";
import { parseBureauContentFields } from "@/lib/server/validation";

export default async function AdminBureauContentPage() {
  const [records, members, partners] = await Promise.all([
    requireAdminRecords<BureauContentRecord>("bureau"),
    requireAdminRecords<TeamDraft>("team"),
    requireAdminRecords<PartnerDraft>("partners"),
  ]);
  const initialContent: Record<Locale, typeof bureauContent.fr> = { ...bureauContent };

  for (const record of records) {
    if (locales.includes(record.locale)) {
      initialContent[record.locale] = parseBureauContentFields(record.content) ?? bureauContent[record.locale];
    }
  }

  return <BureauManager initialContent={initialContent} initialMembers={members} initialPartners={partners} />;
}
