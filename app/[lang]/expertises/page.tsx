import type { Metadata } from "next";
import Link from "next/link";
import { ExpertiseIndexSection } from "@/components/(public)/expertises/expertise-index-section";
import { ExpertiseApproachSections } from "@/components/(public)/expertises/expertise-approach-sections";
import { expertisePageCopy } from "@/components/(public)/expertises/content";
import { expertises } from "@/lib/content/site";
import { isLocale, localize, localizedHref } from "@/lib/i18n";
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
    <main className="expertise-page">
      <section className="expertise-hero" aria-labelledby="expertise-page-title">
        <div className="expertise-hero-inner">
          <div className="expertise-hero-copy">
            <p className="expertise-hero-kicker">{copy.heroKicker}</p>
            <h1 id="expertise-page-title">{copy.heroTitle}</h1>
            <p className="expertise-hero-lead">{copy.indexLead}</p>
            <div className="expertise-hero-actions">
              <Link className="expertise-primary-action" href="#expertise-catalog">
                {copy.exploreDomains}<span aria-hidden="true"> ↓</span>
              </Link>
              <Link className="expertise-secondary-action" href={localizedHref(lang, "/contact")}>
                {copy.contactAction}<span aria-hidden="true"> ↗</span>
              </Link>
            </div>
          </div>
          <nav className="expertise-hero-index" aria-label={copy.indexNavLabel}>
            <p>{copy.indexNavLabel}</p>
            <ul>
              {expertises.map((expertise) => (
                <li key={expertise.id}>
                  <Link href={`#expertise-${expertise.id}`}>
                    <span>{expertise.number}</span>
                    <span>{localize(expertise.name, lang)}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <ExpertiseIndexSection
        expertises={expertises}
        locale={lang}
        copy={copy}
      />
      <ExpertiseApproachSections locale={lang} />
    </main>
  );
}
