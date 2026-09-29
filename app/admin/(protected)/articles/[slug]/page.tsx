import { EditorialRecordPage } from "@/components/(admin)/editorial/editorial-record-page";

export default async function AdminArticleRecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EditorialRecordPage kind="article" slug={slug} />;
}
