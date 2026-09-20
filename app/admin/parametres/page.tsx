import { SettingsForm } from "@/components/(admin)/parametres/settings-form";
import type { SettingsValues } from "@/components/(admin)/parametres/settings-form";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminSettingsPage() {
  const [settings] = await requireAdminRecords<SettingsValues>("settings");
  return <SettingsForm initialSettings={settings} />;
}
