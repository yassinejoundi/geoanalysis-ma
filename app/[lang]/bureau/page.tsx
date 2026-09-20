import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function FirmPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <main><h1>{localize({ fr: "Le bureau", en: "The firm" }, lang)}</h1></main>;
}
