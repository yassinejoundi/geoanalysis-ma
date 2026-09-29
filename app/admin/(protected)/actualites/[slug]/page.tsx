import { EditorialRecordPage } from "@/components/(admin)/editorial/editorial-record-page";

export default async function AdminNewsRecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EditorialRecordPage kind="news" slug={slug} />;
}
