import type { Locale } from "@/lib/i18n";

export const homeContent = {
  fr: {
    title: "GEOANALYSIS — Géologie, géophysique & environnement",
    description:
      "Bureau d’études et de services basé à Marrakech. Géologie, géophysique, mines et environnement.",
    kicker: "Bureau d’études · Marrakech, Maroc",
    hero: "Géologie, géophysique & environnement",
    sub: "Lire le terrain. Éclairer la décision.",
    intro:
      "Des études scientifiques et un accompagnement technique, du terrain au rapport.",
    expertise: "Nos expertises",
    expertiseCta: "Voir nos expertises",
    talk: "Parler de votre projet",
    aboutKicker: "Notre approche",
    aboutTitle: "Des études ancrées dans le terrain",
    about:
      "Depuis Marrakech, GEOANALYSIS accompagne les projets en géologie, géophysique, mines et environnement.",
    about2:
      "Reconnaissances, analyses et cartographie transforment les données terrain en livrables utiles à la décision.",
    discover: "Découvrir le bureau",
    pillars: [
      ["Géologie & mines", "Exploration, études, cartographie et accompagnement minier."],
      ["Eau", "Études hydrologiques, hydrogéologiques et hydro-géophysiques."],
      ["Environnement & SIG", "Études d’impact, cartographie, SIG et télédétection."],
    ],
    expTitle: "Lire un territoire sous tous ses angles",
    expDesc:
      "Une même exigence de terrain pour les ressources minérales, l’eau et l’environnement.",
    methodKicker: "Notre méthode",
    methodTitle: "Du repérage aux livrables, chaque étape compte",
    steps: [
      ["01", "Études documentaires", "Synthèses à partir de recherches documentaires."],
      ["02", "Reconnaissance terrain", "Planification, levés géologiques et échantillonnage."],
      ["03", "Études spécialisées", "Hydrologie, hydrogéologie et études d’impact."],
      ["04", "Cartes et rapports", "Cartes thématiques, rapports et synthèses."],
    ],
    methods: "Prestations",
    methodsTitle: "Des outils adaptés à chaque mission",
    methodsLink: "Voir les prestations",
    projects: "Réalisations",
    projectsTitle: "Missions récentes",
    projectsLink: "Toutes les réalisations",
    news: "Actualités",
    articles: "Articles",
    all: "Tout voir",
    read: "de lecture",
    projectImage: "MISSION GÉOSCIENTIFIQUE",
    expertiseImage: "DOMAINE D’EXPERTISE",
  },
  en: {
    title: "GEOANALYSIS — Geology, geophysics & environment",
    description:
      "Marrakech-based consultancy in geology, geophysics, mining and environment.",
    kicker: "Consultancy · Marrakech, Morocco",
    hero: "Geology, geophysics & environment",
    sub: "Read the terrain. Inform the decision.",
    intro:
      "Scientific studies and technical support, from fieldwork to final report.",
    expertise: "Our expertise",
    expertiseCta: "Explore our expertise",
    talk: "Discuss your project",
    aboutKicker: "Our approach",
    aboutTitle: "Grounded in fieldwork",
    about:
      "From Marrakech, GEOANALYSIS supports projects in geology, geophysics, mining and environment.",
    about2:
      "Field surveys, analysis and mapping turn field data into useful decision-making reports.",
    discover: "Discover the firm",
    pillars: [
      ["Geology & mining", "Exploration, studies, mapping and mining support."],
      ["Water", "Hydrological, hydrogeological and hydrogeophysical studies."],
      ["Environment & GIS", "Impact studies, mapping, GIS and remote sensing."],
    ],
    expTitle: "A complete view of each territory",
    expDesc:
      "One field-based approach across mineral resources, water and the environment.",
    methodKicker: "Our method",
    methodTitle: "From first survey to final deliverable",
    steps: [
      ["01", "Desk studies", "Research and documentary summaries."],
      ["02", "Field reconnaissance", "Planning, geological surveys and sampling."],
      ["03", "Specialist studies", "Hydrology, hydrogeology and impact studies."],
      ["04", "Maps and reports", "Thematic maps, reports and summaries."],
    ],
    methods: "Services",
    methodsTitle: "Tools selected for each assignment",
    methodsLink: "View services",
    projects: "Projects",
    projectsTitle: "Recent assignments",
    projectsLink: "All projects",
    news: "News",
    articles: "Articles",
    all: "View all",
    read: "read",
    projectImage: "GEOSCIENTIFIC ASSIGNMENT",
    expertiseImage: "AREA OF EXPERTISE",
  },
} as const;

export type HomeContent = (typeof homeContent)[Locale];
