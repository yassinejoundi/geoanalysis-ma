import { ProjectRecordPage } from "@/components/(admin)/realisations/project-record-page";

export default async function AdminProjectRecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectRecordPage slug={slug} />;
}
