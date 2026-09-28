import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { ExpertiseIndexSection } from "@/components/(public)/expertises/expertise-index-section";
import { ExpertiseApproachSections } from "@/components/(public)/expertises/expertise-approach-sections";
import { expertisePageContent } from "@/components/(public)/expertises/content";
import { isLocale, localizedHref, type Locale } from "@/lib/i18n";
import { getPublicExpertisePageContent } from "@/lib/server/data/admin";
import { notFound } from "next/navigation";

const getPageContent = cache(async (locale: Locale) =>
  await getPublicExpertisePageContent(locale) ?? expertisePageContent[locale],
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = await getPageContent(lang);
  return { title: content.seoTitle, description: content.seoDescription };
}

export default async function ExpertiseIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPageContent(lang);

  return (
    <main className="expertise-page services-page">
      <section className="services-hero" aria-labelledby="expertise-page-title">
        <div className="services-hero-inner">
          <div className="services-hero-copy">
            <p className="services-hero-kicker">{content.heroKicker}</p>
            <h1 id="expertise-page-title">{content.heroTitle}</h1>
            <p className="services-hero-lead">{content.heroLead}</p>
            <div className="services-hero-actions">
              <Link className="services-primary-action" href={localizedHref(lang, "/contact")}>
                {content.contactAction}<span aria-hidden="true">↗</span>
              </Link>
              <Link className="services-secondary-action" href="#services-list">
                {content.exploreDomains}<span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
          <figure className="services-hero-visual">
            <div className="services-hero-image">
              <Image
                alt={content.photoAlt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
                src={content.heroImage}
              />
            </div>
            <figcaption>
              <span>{content.photoCaption}</span>
              <span>GEOANALYSIS</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <ExpertiseIndexSection locale={lang} content={content} />
      <ExpertiseApproachSections content={content} />
    </main>
  );
}
