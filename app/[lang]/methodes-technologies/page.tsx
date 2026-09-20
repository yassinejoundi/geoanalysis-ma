import { methodGroups } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function MethodsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Méthodes & technologies", en: "Methods & technology" }, lang)}</h1><p>{methodGroups.length}</p></main>;
}
