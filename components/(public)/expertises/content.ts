import type { Locale } from "@/lib/i18n";

export const expertisePageCopy = {
  fr: {
    indexTitle: "Nos expertises",
    indexLead: "Géologie, mines, ressources en eau, environnement et information géographique : GEOANALYSIS accompagne les études et missions de terrain, de l’analyse à la cartographie.",
    heroKicker: "BUREAU D’ÉTUDES · MARRAKECH, MAROC",
    heroTitle: "Comprendre le terrain. Éclairer les projets.",
    exploreDomains: "Explorer les domaines",
    contactAction: "Présenter votre projet",
    indexNavLabel: "Accès direct aux domaines",
    indexSectionKicker: "Nos domaines d’intervention",
    indexSectionTitle: "Cinq expertises, du terrain à l’analyse.",
    indexSectionLead: "Des missions adaptées aux besoins de chaque projet, des premières observations aux études et livrables cartographiques.",
    photoAlt: "L’équipe GEOANALYSIS observe un versant lors d’une reconnaissance sur le terrain.",
    photoCaption: "Reconnaissance de terrain",
    detailKicker: "Nos expertises",
    backToIndex: "Toutes nos expertises",
    overview: "Domaines d’intervention",
    overviewTitle: "Le périmètre des missions",
    servicesKicker: "Prestations",
    services: "Nos prestations",
    talk: "Parler de votre projet",
    exploreServices: "Voir les prestations",
  },
  en: {
    indexTitle: "Our expertise",
    indexLead: "Geology, mining, water resources, environment and geospatial information: GEOANALYSIS supports field assignments and studies, from analysis to mapping.",
    heroKicker: "CONSULTANCY · MARRAKECH, MOROCCO",
    heroTitle: "Understand the ground. Inform the project.",
    exploreDomains: "Explore our expertise",
    contactAction: "Tell us about your project",
    indexNavLabel: "Jump to an area",
    indexSectionKicker: "Areas of work",
    indexSectionTitle: "Five areas, from fieldwork to analysis.",
    indexSectionLead: "Assignments shaped around each project, from first observations to specialist studies and mapped deliverables.",
    photoAlt: "GEOANALYSIS field team observing a hillside during a site reconnaissance.",
    photoCaption: "Field reconnaissance",
    detailKicker: "Our expertise",
    backToIndex: "All expertise",
    overview: "Areas of work",
    overviewTitle: "Scope of work",
    servicesKicker: "Services",
    services: "Our services",
    talk: "Discuss your project",
    exploreServices: "Explore services",
  },
} satisfies Record<Locale, Record<string, string>>;

export const serviceAreas = {
  fr: [
    {
      id: "geologie",
      number: "01",
      title: "Géologie",
      summary: "Études et travaux de terrain pour documenter le contexte géologique d’un projet.",
      services: [
        "Exploration et études géologiques",
        "Cartographie et levés géologiques",
        "Reconnaissance et échantillonnage",
        "Planification et suivi de sondages",
      ],
    },
    {
      id: "mines",
      number: "02",
      title: "Mines",
      summary: "Appui aux projets miniers, de l’évaluation initiale aux démarches opérationnelles et administratives.",
      services: [
        "Gestion d’actifs miniers et identification de sites",
        "Estimation de réserves et études de faisabilité",
        "Conseil et accompagnement opérationnel",
        "Appui aux permis et titres miniers",
      ],
    },
    {
      id: "eau",
      number: "03",
      title: "Hydrologie et hydrogéologie",
      summary: "Études des ressources en eau et analyse des conditions hydrologiques et hydrauliques.",
      services: [
        "Études hydrologiques et hydrogéologiques",
        "Études hydro-géophysiques",
        "Prélèvements et analyses de l’eau in situ",
        "Simulation hydraulique et délimitation de zones inondables",
      ],
    },
    {
      id: "environnement",
      number: "04",
      title: "Environnement",
      summary: "Évaluation et protection environnementales pour les projets miniers et de carrières.",
      services: [
        "Études d’impact environnemental",
        "Solutions de protection environnementale",
        "Études d’aménagement de sites",
        "Appui administratif pour l’occupation temporaire",
      ],
    },
    {
      id: "sig",
      number: "05",
      title: "SIG et télédétection",
      summary: "Information géographique pour l’analyse, la cartographie et la transmission des résultats.",
      services: [
        "Cartes thématiques, minières, géophysiques et hydrologiques",
        "Rapports bibliographiques et synthèses",
        "Formation en systèmes d’information géographique",
        "Formation en télédétection",
      ],
    },
  ],
  en: [
    {
      id: "geologie",
      number: "01",
      title: "Geology",
      summary: "Studies and fieldwork that document a project’s geological setting.",
      services: [
        "Exploration and geological studies",
        "Geological mapping and surveys",
        "Reconnaissance and sampling",
        "Drilling planning and supervision",
      ],
    },
    {
      id: "mines",
      number: "02",
      title: "Mining",
      summary: "Support for mining projects, from early assessment to operational and administrative work.",
      services: [
        "Mining asset administration and site identification",
        "Reserve estimates and feasibility studies",
        "Consulting and operational support",
        "Support with mining permits and licences",
      ],
    },
    {
      id: "eau",
      number: "03",
      title: "Hydrology and hydrogeology",
      summary: "Studies of water resources and analysis of hydrological and hydraulic conditions.",
      services: [
        "Hydrological and hydrogeological studies",
        "Hydrogeophysical studies",
        "In-situ water sampling and analysis",
        "Hydraulic simulation and flood-zone delineation",
      ],
    },
    {
      id: "environnement",
      number: "04",
      title: "Environment",
      summary: "Environmental assessment and protection for mining and quarry projects.",
      services: [
        "Environmental impact studies",
        "Environmental protection solutions",
        "Site-planning studies",
        "Administrative support for temporary occupation",
      ],
    },
    {
      id: "sig",
      number: "05",
      title: "GIS and remote sensing",
      summary: "Geospatial information for analysis, mapping and clear communication of results.",
      services: [
        "Thematic, mining, geophysical and hydrological maps",
        "Literature reports and syntheses",
        "Geographic information systems training",
        "Remote-sensing training",
      ],
    },
  ],
} satisfies Record<Locale, {
  id: string;
  number: string;
  title: string;
  summary: string;
  services: string[];
}[]>;

export type ExpertiseServiceArea = {
  id: string;
  number: string;
  title: string;
  summary: string;
  services: string[];
};

export type ExpertiseApproachStep = {
  label: string;
  title: string;
  description: string;
};

export type ExpertisePageContent = {
  seoTitle: string;
  seoDescription: string;
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  exploreDomains: string;
  contactAction: string;
  heroImage: string;
  photoAlt: string;
  photoCaption: string;
  indexNavLabel: string;
  indexSectionKicker: string;
  indexSectionTitle: string;
  indexSectionLead: string;
  areas: ExpertiseServiceArea[];
  approachKicker: string;
  approachTitle: string;
  approachLead: string;
  approachSteps: ExpertiseApproachStep[];
};

export type ExpertisePageContentRecord = {
  locale: Locale;
  content: ExpertisePageContent;
};

const approachPageCopy = {
  fr: {
    approachKicker: "Une démarche adaptée",
    approachTitle: "Du terrain aux livrables",
    approachLead:
      "Selon les besoins du projet, les interventions peuvent associer observations et relevés à des études spécialisées, puis à des cartes, analyses et synthèses techniques.",
    approachSteps: [
      { label: "01 / Terrain", title: "Observer et recueillir", description: "Reconnaissance, levés géologiques, cartographie, prélèvements et suivi de sondages." },
      { label: "02 / Études", title: "Analyser le contexte", description: "Études géologiques, hydrologiques ou environnementales, avec simulations hydrauliques selon le projet." },
      { label: "03 / Restitution", title: "Structurer les résultats", description: "Cartes thématiques, rapports bibliographiques et synthèses techniques." },
    ],
  },
  en: {
    approachKicker: "A tailored approach",
    approachTitle: "From fieldwork to deliverables",
    approachLead:
      "Depending on project needs, assignments can combine field observations and surveys with specialist studies, then maps, analyses and technical syntheses.",
    approachSteps: [
      { label: "01 / Fieldwork", title: "Observe and collect", description: "Reconnaissance, geological surveys, mapping, sampling and drilling supervision." },
      { label: "02 / Studies", title: "Assess the context", description: "Geological, hydrological or environmental studies, with hydraulic simulations where relevant." },
      { label: "03 / Reporting", title: "Structure the findings", description: "Thematic maps, literature reports and technical syntheses." },
    ],
  },
} satisfies Record<Locale, Pick<ExpertisePageContent,
  "approachKicker" | "approachTitle" | "approachLead" | "approachSteps"
>>;

export const expertisePageContent: Record<Locale, ExpertisePageContent> = {
  fr: {
    seoTitle: "Nos expertises | GEOANALYSIS",
    seoDescription: expertisePageCopy.fr.indexLead,
    heroKicker: expertisePageCopy.fr.heroKicker,
    heroTitle: expertisePageCopy.fr.heroTitle,
    heroLead: expertisePageCopy.fr.indexLead,
    exploreDomains: expertisePageCopy.fr.exploreDomains,
    contactAction: expertisePageCopy.fr.contactAction,
    heroImage: "/approach-field-survey.jpg",
    photoAlt: expertisePageCopy.fr.photoAlt,
    photoCaption: expertisePageCopy.fr.photoCaption,
    indexNavLabel: expertisePageCopy.fr.indexNavLabel,
    indexSectionKicker: expertisePageCopy.fr.indexSectionKicker,
    indexSectionTitle: expertisePageCopy.fr.indexSectionTitle,
    indexSectionLead: expertisePageCopy.fr.indexSectionLead,
    areas: serviceAreas.fr,
    ...approachPageCopy.fr,
  },
  en: {
    seoTitle: "Our expertise | GEOANALYSIS",
    seoDescription: expertisePageCopy.en.indexLead,
    heroKicker: expertisePageCopy.en.heroKicker,
    heroTitle: expertisePageCopy.en.heroTitle,
    heroLead: expertisePageCopy.en.indexLead,
    exploreDomains: expertisePageCopy.en.exploreDomains,
    contactAction: expertisePageCopy.en.contactAction,
    heroImage: "/approach-field-survey.jpg",
    photoAlt: expertisePageCopy.en.photoAlt,
    photoCaption: expertisePageCopy.en.photoCaption,
    indexNavLabel: expertisePageCopy.en.indexNavLabel,
    indexSectionKicker: expertisePageCopy.en.indexSectionKicker,
    indexSectionTitle: expertisePageCopy.en.indexSectionTitle,
    indexSectionLead: expertisePageCopy.en.indexSectionLead,
    areas: serviceAreas.en,
    ...approachPageCopy.en,
  },
};
