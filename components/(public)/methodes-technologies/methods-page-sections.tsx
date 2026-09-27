import { methodsPageCopy } from "@/components/(public)/methodes-technologies/content";
import type { Locale } from "@/lib/i18n";

export function MethodsPageSections({ locale }: { locale: Locale }) {
  const copy = methodsPageCopy[locale];

  return (
    <>
      <section className="methods-process" id="methods-process" aria-labelledby="methods-process-title">
        <div className="methods-process-inner">
          <header className="methods-section-heading">
            <p className="methods-eyebrow">{copy.processKicker}</p>
            <h2 id="methods-process-title">{copy.processTitle}</h2>
            <p>{copy.processLead}</p>
          </header>

          <div className="methods-stage-grid">
            {copy.stages.map((stage) => (
              <article className="methods-stage" id={`methods-stage-${stage.id}`} key={stage.id}>
                <div className="methods-stage-meta">
                  <span>{stage.number}</span>
                  <span>{stage.label}</span>
                </div>
                <h3>{stage.title}</h3>
                <p className="methods-stage-description">{stage.description}</p>
                <ul>
                  {stage.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="methods-technology" aria-labelledby="methods-technology-title">
        <div className="methods-technology-inner">
          <div className="methods-technology-copy">
            <p className="methods-eyebrow">{copy.technologyKicker}</p>
            <h2 id="methods-technology-title">{copy.technologyTitle}</h2>
            <p className="methods-technology-lead">{copy.technologyLead}</p>
            <ul className="methods-output-list">
              {copy.outputs.map((output) => <li key={output}>{output}</li>)}
            </ul>
            <p className="methods-technology-note">{copy.technologyNote}</p>
          </div>

          <figure className="methods-map-figure">
            <div className="methods-map-panel" aria-hidden="true">
              <div className="methods-map-heading"><span>{copy.mapVisualTitle}</span><span>GEOANALYSIS</span></div>
              <div className="methods-map-art">
                <span className="methods-map-point methods-map-point-one" />
                <span className="methods-map-point methods-map-point-two" />
                <span className="methods-map-line" />
              </div>
              <div className="methods-map-legend"><span>{copy.mapVisualStart}</span><span aria-hidden="true">→</span><span>{copy.mapVisualEnd}</span></div>
            </div>
            <figcaption>{copy.mapCaption}</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
