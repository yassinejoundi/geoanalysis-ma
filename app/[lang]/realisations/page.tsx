import { projects } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ProjectIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Réalisations", en: "Projects" }, lang)}</h1><p>{projects.length}</p></main>;
}
