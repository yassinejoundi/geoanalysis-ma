import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function DesignSystemPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>GEOANALYSIS Design System</h1></main>;
}
