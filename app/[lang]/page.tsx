import type { Metadata } from "next";
import { AboutSection } from "@/components/(public)/home/about-section";
import { EditorialSection } from "@/components/(public)/home/editorial-section";
import { ExpertiseSection } from "@/components/(public)/home/expertise-section";
import { homeContent } from "@/components/(public)/home/content";
import { HeroSection } from "@/components/(public)/home/hero-section";
import { MethodsSection } from "@/components/(public)/home/methods-section";
import { ProcessSection } from "@/components/(public)/home/process-section";
import { ProjectsSection } from "@/components/(public)/home/projects-section";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = homeContent[lang];
  return { title, description };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = homeContent[lang];

  return (
    <main className="home-page">
      <HeroSection locale={lang} content={content} />
      <AboutSection locale={lang} content={content} />
      <ExpertiseSection locale={lang} content={content} />
      <ProcessSection content={content} />
      <MethodsSection locale={lang} content={content} />
      <ProjectsSection locale={lang} content={content} />
      <EditorialSection locale={lang} content={content} />
    </main>
  );
}
