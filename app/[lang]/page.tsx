import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Géologie, géophysique & environnement", en: "Geology, geophysics & environment" }, lang)}</h1></main>;
}
