import { news } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) => news.map(({ slug }) => ({ lang, slug })));
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const entry = news.find((item) => item.slug === slug);
  if (!entry) notFound();
  return <main><h1>{localize(entry.title, lang)}</h1><p>{localize(entry.teaser, lang)}</p></main>;
}
