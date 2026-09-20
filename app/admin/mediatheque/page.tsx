import { MediaManager } from "@/components/(admin)/mediatheque/media-manager";
import type { MediaItem } from "@/components/(admin)/mediatheque/media-manager";
import { requireAdminRecords } from "@/lib/server/data/admin";

export default async function AdminMediaPage() {
  const media = await requireAdminRecords<MediaItem>("media");
  return <MediaManager initialMedia={media} />;
}
