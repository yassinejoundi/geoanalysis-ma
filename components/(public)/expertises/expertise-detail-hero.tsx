import Link from "next/link";
import Image from "next/image";
import type { Expertise } from "@/lib/content/site";
import type { ExpertiseDetail } from "@/lib/content/expertise-details";
import { localize, type Locale } from "@/lib/i18n";

export function ExpertiseDetailHero({
  expertise,
  detail,
  locale,
  copy,
}: {
  expertise: Expertise;
  detail: ExpertiseDetail;
  locale: Locale;
  copy: {
    detailKicker: string;
    backToIndex: string;
    talk: string;
    exploreServices: string;
  };
}) {
  return (
    <section className="expertise-detail-hero">
      <div className="expertise-detail-copy">
        <Link className="expertise-back-link" href={`/${locale}/expertises`}>
          <span aria-hidden="true">←</span> {copy.backToIndex}
        </Link>
        <div className="expertise-detail-intro">
          <p className="expertise-detail-kicker">
            <span>{copy.detailKicker}</span>
            <span aria-hidden="true"> / </span>
            <span>{expertise.number}</span>
          </p>
          <h1>{localize(expertise.name, locale)}</h1>
          <p className="expertise-detail-lead">{localize(detail.intro, locale)}</p>
          <div className="expertise-detail-actions">
            <Link className="home-primary-action" href={`/${locale}/contact`}>
              {copy.talk}
            </Link>
            <Link
              className="home-secondary-action expertise-detail-services-link"
              href="#prestations">
              {copy.exploreServices}
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </div>
      <figure className="expertise-detail-visual">
        <Image
          alt={localize(expertise.image.alt, locale)}
          fill
          fetchPriority="high"
          sizes="(max-width: 879px) 100vw, 52vw"
          src={expertise.image.src}
        />
        <span className="expertise-detail-visual-number" aria-hidden="true">
          {expertise.number}
        </span>
      </figure>
    </section>
  );
}
