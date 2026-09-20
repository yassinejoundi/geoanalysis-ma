import { expertises } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ExpertiseIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Nos expertises", en: "Our expertise" }, lang)}</h1><p>{expertises.length}</p></main>;
}
