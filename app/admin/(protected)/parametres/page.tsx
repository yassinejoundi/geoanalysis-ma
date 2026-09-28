import { SettingsForm } from "@/components/(admin)/parametres/settings-form";
import type { SettingsValues } from "@/components/(admin)/parametres/settings-form";
import { adminSettings } from "@/lib/content/admin";
import { requireAdminRecords } from "@/lib/server/data/admin";
import { parseSettingsFields } from "@/lib/server/validation";

export default async function AdminSettingsPage() {
  const [storedSettings] = await requireAdminRecords<Record<string, unknown>>("settings");
  const settingsRecord = { ...(storedSettings ?? {}) };
  delete settingsRecord.id;
  const settings: SettingsValues = { ...adminSettings, ...parseSettingsFields(settingsRecord) };
  return <SettingsForm initialSettings={settings} />;
}
