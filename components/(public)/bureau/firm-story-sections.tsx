import { firmWorkStages } from "@/lib/content/firm";
import { localize, type Locale } from "@/lib/i18n";

export function FirmStorySections({ locale }: { locale: Locale }) {
  const copy =
    locale === "fr"
      ? {
          stagesEyebrow: "Notre méthode",
          stagesTitle: "Du terrain à la décision",
          stagesLead:
            "De la reconnaissance de terrain à la synthèse technique, les prestations mobilisent les étapes utiles au sujet étudié.",
        }
      : {
          stagesEyebrow: "How we work",
          stagesTitle: "From fieldwork to findings",
          stagesLead:
            "From site reconnaissance to technical synthesis, each assignment draws on the steps suited to the work at hand.",
        };

  return (
    <>
      <section
        className="firm-stages-section"
        id="firm-method"
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
