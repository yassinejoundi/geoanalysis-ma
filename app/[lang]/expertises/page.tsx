import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExpertiseIndexSection } from "@/components/(public)/expertises/expertise-index-section";
import { ExpertiseApproachSections } from "@/components/(public)/expertises/expertise-approach-sections";
import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { isLocale, localizedHref } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = expertisePageCopy[lang];
  return {
    title: `${copy.indexTitle} | GEOANALYSIS`,
    description: copy.indexLead,
  };
}

export default async function ExpertiseIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = expertisePageCopy[lang];

  return (
    <main className="expertise-page services-page">
      <section className="services-hero" aria-labelledby="expertise-page-title">
        <div className="services-hero-inner">
          <div className="services-hero-copy">
            <p className="services-hero-kicker">{copy.heroKicker}</p>
            <h1 id="expertise-page-title">{copy.heroTitle}</h1>
            <p className="services-hero-lead">{copy.indexLead}</p>
            <div className="services-hero-actions">
              <Link
                className="services-primary-action"
                href={localizedHref(lang, "/contact")}
              >
                {copy.contactAction}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="services-secondary-action" href="#services-list">
                {copy.exploreDomains}
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>

          <figure className="services-hero-visual">
            <div className="services-hero-image">
              <Image
                alt={copy.photoAlt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
                src="/approach-field-survey.jpg"
              />
            </div>
            <figcaption>
              <span>{copy.photoCaption}</span>
              <span>GEOANALYSIS</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <ExpertiseIndexSection locale={lang} copy={copy} />
      <ExpertiseApproachSections locale={lang} />
    </main>
  );
}
