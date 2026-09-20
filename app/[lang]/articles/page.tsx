import { articles } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ArticleIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Articles", en: "Articles" }, lang)}</h1><p>{articles.length}</p></main>;
}
