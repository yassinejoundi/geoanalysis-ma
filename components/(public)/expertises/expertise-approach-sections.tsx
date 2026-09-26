import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/(public)/home/section-heading";

const copy = {
  fr: {
    approachKicker: "Une démarche adaptée",
    approachTitle: "Du terrain aux livrables",
    approachLead:
      "Selon les besoins du projet, les interventions peuvent associer observations et relevés à des études spécialisées, puis à des cartes, analyses et synthèses techniques.",
    steps: [
      {
        label: "01 / Terrain",
        title: "Observer et recueillir",
        description:
          "Reconnaissance, levés géologiques, cartographie, prélèvements et suivi de sondages.",
      },
      {
        label: "02 / Études",
        title: "Analyser le contexte",
        description:
          "Études géologiques, hydrologiques ou environnementales, avec simulations hydrauliques selon le projet.",
      },
      {
        label: "03 / Restitution",
        title: "Structurer les résultats",
        description:
          "Cartes thématiques, rapports bibliographiques et synthèses techniques.",
      },
    ],
    geospatialKicker: "Information géographique",
    geospatialTitle: "Cartographier, analyser, transmettre",
    geospatialLead:
      "La cartographie thématique et la télédétection complètent les missions d’étude. Des formations dédiées couvrent également les systèmes d’information géographique et la télédétection.",
    services: [
      {
        title: "Cartographie thématique",
        description: "Cartes minières, géophysiques et hydrologiques.",
      },
      {
        title: "Rapports et synthèses",
        description: "Rapports bibliographiques et synthèses d’étude.",
      },
      {
        title: "Formation",
        description: "Formation en SIG et en télédétection.",
      },
    ],
  },
  en: {
    approachKicker: "A tailored approach",
    approachTitle: "From fieldwork to deliverables",
    approachLead:
      "Depending on project needs, assignments can combine field observations and surveys with specialist studies, then maps, analyses and technical syntheses.",
    steps: [
      {
        label: "01 / Fieldwork",
        title: "Observe and collect",
        description:
          "Reconnaissance, geological surveys, mapping, sampling and drilling supervision.",
      },
      {
        label: "02 / Studies",
        title: "Assess the context",
        description:
          "Geological, hydrological or environmental studies, with hydraulic simulations where relevant.",
      },
      {
        label: "03 / Reporting",
        title: "Structure the findings",
        description:
          "Thematic maps, literature reports and technical syntheses.",
      },
    ],
    geospatialKicker: "Geospatial information",
    geospatialTitle: "Map, analyse and communicate",
    geospatialLead:
      "Thematic mapping and remote sensing complement study assignments. Dedicated training also covers geographic information systems and remote sensing.",
    services: [
      {
        title: "Thematic mapping",
        description: "Mining, geophysical and hydrological maps.",
      },
      {
        title: "Reports and syntheses",
        description: "Literature reports and study syntheses.",
      },
      {
        title: "Training",
        description: "GIS and remote-sensing training.",
      },
    ],
  },
} satisfies Record<Locale, {
  approachKicker: string;
  approachTitle: string;
  approachLead: string;
  steps: { label: string; title: string; description: string }[];
  geospatialKicker: string;
  geospatialTitle: string;
  geospatialLead: string;
  services: { title: string; description: string }[];
}>;

export function ExpertiseApproachSections({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <>
      <section className="expertise-approach-section">
        <div className="expertise-approach-inner">
          <SectionHeading
            kicker={text.approachKicker}
            title={text.approachTitle}
          />
          <p className="expertise-approach-lead">{text.approachLead}</p>
          <ol className="expertise-approach-steps">
            {text.steps.map((step) => (
              <li key={step.label}>
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="expertise-geospatial-section">
        <div className="expertise-geospatial-inner">
          <div>
            <SectionHeading
              kicker={text.geospatialKicker}
              title={text.geospatialTitle}
            />
            <p className="expertise-geospatial-lead">{text.geospatialLead}</p>
          </div>
          <ul className="expertise-geospatial-services">
            {text.services.map((service, index) => (
              <li key={service.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
