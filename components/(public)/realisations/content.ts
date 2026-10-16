import type { Locale } from "@/lib/i18n";

export { realisationMissions } from "@/lib/content/projects";

export const projectPageCopy = {
  fr: {
    indexTitle: "Réalisations",
    indexLead: "Des missions de terrain et des études en géologie, mines et ressources en eau.",
    detailBack: "Toutes les réalisations",
    galleryKicker: "Galerie",
    galleryTitle: "Visuels de la mission",
    galleryImage: "Galerie",
    descriptionKicker: "La mission",
    descriptionTitle: "Description du projet",
    methodologyKicker: "Méthodologie",
    methodologyTitle: "Étapes de la mission",
    resultsKicker: "Résultats",
    resultsTitle: "Résultats clés",
    contactTitle: "Un projet similaire ?",
    contactLead: "Décrivez votre contexte. Notre équipe vous répond avec une proposition méthodologique.",
    contactAction: "Parler de votre projet",
  },
  en: {
    indexTitle: "Projects",
    indexLead: "Field assignments and studies in geology, mining and water resources.",
    detailBack: "All projects",
    galleryKicker: "Gallery",
    galleryTitle: "Project visuals",
    galleryImage: "Gallery",
    descriptionKicker: "The assignment",
    descriptionTitle: "Project description",
    methodologyKicker: "Methodology",
    methodologyTitle: "Assignment steps",
    resultsKicker: "Results",
    resultsTitle: "Key results",
    contactTitle: "Planning a similar project?",
    contactLead: "Describe your context. Our team will respond with a methodological proposal.",
    contactAction: "Discuss your project",
  },
} satisfies Record<Locale, Record<string, string>>;

export const realisationsPageCopy = {
  fr: {
    heroKicker: "Missions de terrain · GEOANALYSIS",
    heroTitle: "Lire le terrain. Éclairer les décisions.",
    heroLead:
      "Des levés géologiques aux prélèvements d’eau, GEOANALYSIS accompagne les projets de l’observation à l’analyse.",
    heroImageAlt: "Affleurement rocheux sur un versant aride.",
    heroImageCaption: "Observations de terrain",
    exploreAction: "Parcourir les missions",
    contactAction: "Présenter un projet",
    workKicker: "Réalisations",
    workTitle: "Des études ancrées dans le terrain.",
    workLead:
      "Quelques travaux illustrés par les archives photographiques du bureau.",
    approachKicker: "Du terrain aux livrables",
    approachTitle: "Chaque observation prend sa place.",
    approachLead:
      "Les missions associent reconnaissance, mesures et restitution cartographique ou documentaire.",
    steps: [
      ["01", "Reconnaître", "Levés géologiques et travaux de terrain."],
      ["02", "Documenter", "Sondages, échantillonnage et prélèvements."],
      ["03", "Restituer", "Cartes thématiques, rapports et synthèses."],
    ],
  },
  en: {
    heroKicker: "Field assignments · GEOANALYSIS",
    heroTitle: "Read the ground. Inform decisions.",
    heroLead:
      "From geological surveys to water sampling, GEOANALYSIS supports projects from field observation through analysis.",
    heroImageAlt: "Rock outcrop across an arid hillside.",
    heroImageCaption: "Field observations",
    exploreAction: "Explore the assignments",
    contactAction: "Discuss a project",
    workKicker: "Selected work",
    workTitle: "Studies grounded in fieldwork.",
    workLead:
      "A selection illustrated with photographs from the firm’s field archive.",
    approachKicker: "From fieldwork to deliverables",
    approachTitle: "Every observation has a purpose.",
    approachLead:
      "Assignments combine reconnaissance, measurements and mapped or written outputs.",
    steps: [
      ["01", "Survey", "Geological mapping and field reconnaissance."],
      ["02", "Document", "Drilling, sampling and water collection."],
      ["03", "Deliver", "Thematic maps, reports and summaries."],
    ],
  },
} satisfies Record<
  Locale,
  {
    heroKicker: string;
    heroTitle: string;
    heroLead: string;
    heroImageAlt: string;
    heroImageCaption: string;
    exploreAction: string;
    contactAction: string;
    workKicker: string;
    workTitle: string;
    workLead: string;
    approachKicker: string;
    approachTitle: string;
    approachLead: string;
    steps: [string, string, string][];
  }
>;
