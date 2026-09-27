import Image from "next/image";
import { realisationMissions, realisationsPageCopy } from "./content";
import { localize, type Locale } from "@/lib/i18n";

export function RealisationsArchiveSection({ locale }: { locale: Locale }) {
  const copy = realisationsPageCopy[locale];

  return (
    <>
      <section
        className="realisations-work"
        id="missions"
        aria-labelledby="realisations-work-title">
        <div className="realisations-section-heading">
          <div>
            <p className="realisations-section-kicker">{copy.workKicker}</p>
            <h2 id="realisations-work-title">{copy.workTitle}</h2>
          </div>
          <p className="realisations-section-lead">{copy.workLead}</p>
        </div>
        <ul className="realisations-grid">
          {realisationMissions.map((mission) => (
            <li key={mission.id}>
              <article className="realisation-card">
                <figure className="realisation-card-image">
                  <Image
                    src={mission.image}
                    alt={localize(mission.alt, locale)}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 45vw"
                  />
                  <figcaption>
                    <span>{localize(mission.domain, locale)}</span>
                    <span aria-hidden="true">{mission.number}</span>
                  </figcaption>
                </figure>
                <div className="realisation-card-copy">
                  <h3>{localize(mission.title, locale)}</h3>
                  <p>{localize(mission.description, locale)}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="realisations-approach"
        id="approche"
        aria-labelledby="realisations-approach-title">
        <div className="realisations-approach-inner">
          <div className="realisations-approach-intro">
            <p className="realisations-section-kicker">{copy.approachKicker}</p>
            <h2 id="realisations-approach-title">{copy.approachTitle}</h2>
            <p>{copy.approachLead}</p>
          </div>
          <ol className="realisations-steps">
            {copy.steps.map(([number, title, description]) => (
              <li key={number}>
                <span aria-hidden="true">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
