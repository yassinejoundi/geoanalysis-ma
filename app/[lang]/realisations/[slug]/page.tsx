import { projects } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map(({ slug }) => ({ lang, slug })));
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return <main><h1>{localize(project.title, lang)}</h1><p>{localize(project.teaser, lang)}</p></main>;
}
