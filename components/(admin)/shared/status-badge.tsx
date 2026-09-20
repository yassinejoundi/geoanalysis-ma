import type { PublicationState } from "@/lib/content/admin";

const statusLabels: Record<PublicationState | "review", string> = {
  published: "Publié",
  draft: "Brouillon",
  review: "À valider",
};

export function StatusBadge({ status }: { status: PublicationState | "review" }) {
  return <span className={`status-pill status-${status}`}>{statusLabels[status]}</span>;
}
