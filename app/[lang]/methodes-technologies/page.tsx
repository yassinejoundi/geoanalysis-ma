import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MethodsPageSections } from "@/components/(public)/methodes-technologies/methods-page-sections";
import { methodsPageCopy } from "@/components/(public)/methodes-technologies/content";
import { isLocale, localizedHref } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = methodsPageCopy[lang];
  return {
    title: `${copy.kicker} | GEOANALYSIS`,
    description: copy.description,
  };
}

export default async function MethodsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = methodsPageCopy[lang];

  return (
    <main className="methods-page">
      <section className="methods-hero" aria-labelledby="methods-page-title">
        <div className="methods-hero-inner">
          <div className="methods-hero-copy">
            <p className="methods-eyebrow">{copy.kicker}</p>
            <h1 id="methods-page-title">{copy.title}</h1>
            <p className="methods-hero-lead">{copy.lead}</p>
            <div className="methods-hero-actions">
              <Link className="methods-primary-action" href={localizedHref(lang, "/contact")}>
                {copy.contactAction}<span aria-hidden="true">↗</span>
              </Link>
              <Link className="methods-secondary-action" href="#methods-process">
                {copy.exploreAction}<span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>

          <figure className="methods-hero-visual">
            <div className="methods-hero-image">
              <Image
                alt={copy.photoAlt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
                src="/expertises/hydrogeology-well.jpg"
              />
            </div>
            <figcaption><span>{copy.photoCaption}</span><span>{copy.photoStamp}</span></figcaption>
          </figure>
        </div>
      </section>

      <nav className="methods-quick-nav" aria-label={lang === "fr" ? "Étapes de la démarche" : "Approach stages"}>
        <ul>
          {copy.stages.map((stage) => (
            <li key={stage.id}>
              <a href={`#methods-stage-${stage.id}`}>
                <span>{stage.number}</span><span>{stage.label}</span><span aria-hidden="true">↘</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <MethodsPageSections locale={lang} />
    </main>
  );
}
