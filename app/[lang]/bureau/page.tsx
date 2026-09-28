import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BureauDirectorySections } from "@/components/(public)/bureau/directory-sections";
import { FirmStorySections } from "@/components/(public)/bureau/firm-story-sections";
import { ValuesSection } from "@/components/(public)/bureau/values-section";
import { bureauContent } from "@/components/(public)/bureau/content";
import { isLocale, localizedHref } from "@/lib/i18n";
import { getPublicBureauContent, getPublicFirmDirectory } from "@/lib/server/data/admin";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = await getPublicBureauContent(lang) ?? bureauContent[lang];
  return { title: `${content.seoTitle} | GEOANALYSIS`, description: content.seoDescription };
}

export default async function FirmPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [content, directory] = await Promise.all([
    getPublicBureauContent(lang),
    getPublicFirmDirectory(),
  ]);
  const pageContent = content ?? bureauContent[lang];

  return (
    <main className="firm-page">
      <section className="firm-hero" aria-labelledby="firm-page-title">
        <div className="firm-hero-inner">
          <div className="firm-hero-copy">
            <p className="firm-hero-kicker">{pageContent.heroKicker}</p>
            <h1 id="firm-page-title">{pageContent.heroTitle}</h1>
            <p className="firm-hero-lead">{pageContent.heroLead}</p>
            <div className="firm-hero-actions">
              <Link
                className="firm-primary-action"
                href={localizedHref(lang, "/contact")}>
                {pageContent.primaryAction}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="firm-secondary-action" href="#firm-method">
                {pageContent.secondaryAction}
              </Link>
            </div>
            <ul className="firm-hero-fields" aria-label={pageContent.fieldsLabel}>
              {pageContent.domains.map((domain, index) => (
                <li key={`${domain}-${index}`}>{domain}</li>
              ))}
            </ul>
          </div>
          <figure className="firm-hero-media">
            <Image
              alt={pageContent.heroImageAlt}
              fill
              preload
              sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1360px) 48vw, 640px"
              src={pageContent.heroImage}
            />
            <figcaption>
              <span>{pageContent.heroImageLabel}</span>
              <span>{pageContent.heroImageCaption}</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <BureauDirectorySections
        locale={lang}
        content={pageContent}
        team={directory.team}
        partners={directory.partners}
      />
      <FirmStorySections content={pageContent} />
      <ValuesSection content={pageContent} title={pageContent.valuesTitle} />
    </main>
  );
}
