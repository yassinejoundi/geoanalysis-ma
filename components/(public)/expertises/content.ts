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
