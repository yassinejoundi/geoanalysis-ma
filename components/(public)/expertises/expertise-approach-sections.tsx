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
  },
} satisfies Record<Locale, {
  approachKicker: string;
  approachTitle: string;
  approachLead: string;
  steps: { label: string; title: string; description: string }[];
}>;

export function ExpertiseApproachSections({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
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
  );
}
