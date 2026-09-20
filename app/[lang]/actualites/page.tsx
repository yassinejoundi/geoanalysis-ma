import { news } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function NewsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Actualités", en: "News" }, lang)}</h1><p>{news.length}</p></main>;
}
