import { TeamManager } from "@/components/(admin)/equipe/team-manager";
import type { TeamDraft } from "@/components/(admin)/equipe/team-editor-fields";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminTeamPage() {
  const members = await requireAdminRecords<TeamDraft>("team");
  return <TeamManager initialMembers={members} />;
}
