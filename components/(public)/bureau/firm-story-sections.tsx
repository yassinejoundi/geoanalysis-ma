import { firmDomains, firmWorkStages } from "@/lib/content/firm";
import { localize, type Locale } from "@/lib/i18n";

export function FirmStorySections({ locale }: { locale: Locale }) {
  const copy =
    locale === "fr"
      ? {
          domainsEyebrow: "Nos compétences",
          domainsTitle: "Des domaines qui se complètent",
          domainsLead:
            "Le bureau intervient en géologie, géophysique, hydrologie, environnement et cartographie. Les compétences mobilisées dépendent du sujet de chaque mission.",
          stagesEyebrow: "Notre méthode",
          stagesTitle: "Du terrain à la restitution",
          stagesLead:
            "De la reconnaissance de terrain à la synthèse technique, les prestations mobilisent les étapes utiles au sujet étudié.",
        }
      : {
          domainsEyebrow: "Our expertise",
          domainsTitle: "Complementary fields of work",
          domainsLead:
            "The firm works in geology, geophysics, hydrology, environmental studies and mapping. The expertise brought to each assignment depends on its subject.",
          stagesEyebrow: "How we work",
          stagesTitle: "From fieldwork to findings",
          stagesLead:
            "From site reconnaissance to technical synthesis, each assignment draws on the steps suited to the work at hand.",
        };

  return (
    <>
      <section
        className="firm-domains-section"
        aria-labelledby="firm-domains-title">
        <div className="firm-story-inner">
          <header className="firm-story-heading">
            <p className="firm-story-eyebrow">{copy.domainsEyebrow}</p>
            <h2 id="firm-domains-title">{copy.domainsTitle}</h2>
            <p>{copy.domainsLead}</p>
          </header>
          <ul className="firm-domain-list">
            {firmDomains.map((domain) => (
              <li key={domain.number}>
                <span className="firm-story-number">{domain.number}</span>
                <h3>{localize(domain.title, locale)}</h3>
                <p>{localize(domain.description, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="firm-stages-section"
        aria-labelledby="firm-stages-title">
        <div className="firm-story-inner">
          <header className="firm-story-heading">
            <p className="firm-story-eyebrow">{copy.stagesEyebrow}</p>
            <h2 id="firm-stages-title">{copy.stagesTitle}</h2>
            <p>{copy.stagesLead}</p>
          </header>
          <ol className="firm-stage-list">
            {firmWorkStages.map((stage) => (
              <li key={stage.number}>
                <span className="firm-story-number">{stage.number}</span>
                <h3>{localize(stage.title, locale)}</h3>
                <p>{localize(stage.description, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
