import type { Metadata } from "next";
import { ExpertiseDetailHero } from "@/components/(public)/expertises/expertise-detail-hero";
import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { ExpertiseOverviewSection } from "@/components/(public)/expertises/expertise-overview-section";
import { ExpertiseServicesSection } from "@/components/(public)/expertises/expertise-services-section";
import { expertiseDetails } from "@/lib/content/expertise-details";
import { expertises } from "@/lib/content/site";
import { isLocale, locales, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    expertises.map(({ slug }) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const expertise = expertises.find((entry) => entry.slug === slug);
  if (!expertise) notFound();
  return {
    title: `${localize(expertise.name, lang)} | GEOANALYSIS`,
    description: localize(expertiseDetails[expertise.id].intro, lang),
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const expertise = expertises.find((entry) => entry.slug === slug);
  if (!expertise) notFound();

  const copy = expertisePageCopy[lang];
  const detail = expertiseDetails[expertise.id];

  return (
    <main className="expertise-page">
      <ExpertiseDetailHero
        expertise={expertise}
        detail={detail}
        locale={lang}
        copy={copy}
      />
      <ExpertiseOverviewSection detail={detail} locale={lang} />
      <ExpertiseServicesSection
        detail={detail}
        locale={lang}
        kicker={copy.servicesKicker}
        title={copy.services}
      />
    </main>
  );
}
