import type { Locale } from "@/lib/i18n";

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

export const realisationMissions = [
  {
    id: "reconnaissance",
    number: "01",
    domain: { fr: "Géologie & mines", en: "Geology & mining" },
    title: { fr: "Reconnaissance géologique", en: "Geological reconnaissance" },
    description: {
      fr: "Levés géologiques et observations d’affleurements pour documenter les formations rencontrées.",
      en: "Geological surveys and outcrop observations document the formations encountered.",
    },
    image: "/realisations/geological-survey.webp",
    alt: {
      fr: "Intervenant en gilet haute visibilité sur un affleurement rocheux.",
      en: "Field worker in a high-visibility vest on a rocky outcrop.",
    },
  },
  {
    id: "sondages",
    number: "02",
    domain: { fr: "Exploration minière", en: "Mineral exploration" },
    title: { fr: "Suivi de sondages", en: "Drilling follow-up" },
    description: {
      fr: "Implantation et suivi des sondages dans le cadre des travaux de reconnaissance.",
      en: "Drill planning and follow-up as part of field reconnaissance work.",
    },
    image: "/realisations/drilling-follow-up.webp",
    alt: {
      fr: "Travaux de sondage sur un terrain rocheux.",
      en: "Drilling work on rocky ground.",
    },
  },
  {
    id: "echantillonnage",
    number: "03",
    domain: { fr: "Géologie", en: "Geology" },
    title: { fr: "Échantillonnage minéral", en: "Mineral sampling" },
    description: {
      fr: "Échantillons de roche documentés avec des repères de terrain pour accompagner les observations géologiques.",
      en: "Rock samples documented with field references to support geological observations.",
    },
    image: "/realisations/mineral-sample.webp",
    alt: {
      fr: "Échantillon de roche accompagné d’une boussole et d’une échelle de terrain.",
      en: "Rock sample beside a compass and field scale.",
    },
  },
  {
    id: "eau",
    number: "04",
    domain: { fr: "Hydrologie & hydrogéologie", en: "Hydrology & hydrogeology" },
    title: { fr: "Prélèvements d’eau", en: "Water sampling" },
    description: {
      fr: "Prélèvements et analyses in situ dans le cadre des études hydrologiques et hydrogéologiques.",
      en: "Water collection and in-situ analysis for hydrological and hydrogeological studies.",
    },
    image: "/realisations/water-sampling.webp",
    alt: {
      fr: "Intervenant recueillant de l’eau au niveau d’un puits.",
      en: "Field worker collecting water from a well.",
    },
  },
] as const;
