import { expertises } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) => expertises.map(({ slug }) => ({ lang, slug })));
}

export default async function ExpertisePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const expertise = expertises.find((entry) => entry.slug === slug);
  if (!expertise) notFound();
  return <main><h1>{localize(expertise.name, lang)}</h1><p>{localize(expertise.summary, lang)}</p></main>;
}
