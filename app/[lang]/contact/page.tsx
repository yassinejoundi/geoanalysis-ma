import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Parlons de votre projet", en: "Let’s discuss your project" }, lang)}</h1></main>;
}
