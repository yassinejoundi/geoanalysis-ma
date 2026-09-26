import type { Locale } from "@/lib/i18n";

export const homeContent = {
  fr: {
    title: "GEOANALYSIS — Géologie, géophysique & environnement",
    description:
      "Bureau d’études et de services basé à Marrakech. Géologie, géophysique, mines et environnement.",
    kicker: "Bureau d’études · Marrakech, Maroc",
    hero: "Géologie, géophysique & environnement",
    sub: "De la donnée terrain à la décision.",
    intro:
      "GEOANALYSIS est un bureau d’études et de services basé à Marrakech. Ses domaines couvrent la géologie, la géophysique, les mines, l’hydrologie, l’environnement et la cartographie.",
    expertise: "Nos expertises",
    talk: "Parler de votre projet",
    stats: [] as [string, string][],
    aboutKicker: "Le bureau",
    aboutTitle: "Un bureau d’études et de services à Marrakech",
    about:
      "GEOANALYSIS propose des études et un accompagnement en géologie, géophysique, mines et environnement.",
    about2:
      "L’offre inclut aussi l’hydrologie, l’hydrogéologie, la cartographie SIG et la télédétection.",
    discover: "Découvrir le bureau",
    pillars: [
      ["Géologie & mines", "Exploration, études, cartographie et accompagnement minier."],
      ["Eau", "Études hydrologiques, hydrogéologiques et hydro-géophysiques."],
      ["Environnement & SIG", "Études d’impact, cartographie, SIG et télédétection."],
    ],
    expTitle: "Trois domaines d’intervention",
    expDesc:
      "Choisissez le domaine adapté : géologie et mines, environnement, ou hydrologie et hydrogéologie.",
    methodKicker: "Prestations",
    methodTitle: "Des études de terrain aux livrables",
    steps: [
      ["01", "Études documentaires", "Synthèses à partir de recherches documentaires."],
      ["02", "Reconnaissance terrain", "Planification, levés géologiques et échantillonnage."],
      ["03", "Études spécialisées", "Hydrologie, hydrogéologie et études d’impact."],
      ["04", "Cartes et rapports", "Cartes thématiques, rapports et synthèses."],
    ],
    methods: "Prestations",
    methodsTitle: "Études, cartographie et accompagnement",
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
    sub: "From field data to decisions.",
    intro:
      "GEOANALYSIS is a consultancy based in Marrakech. Its fields include geology, geophysics, mining, hydrology, environment and mapping.",
    expertise: "Our expertise",
    talk: "Discuss your project",
    stats: [] as [string, string][],
    aboutKicker: "The firm",
    aboutTitle: "A consultancy based in Marrakech",
    about:
      "GEOANALYSIS provides studies and support in geology, geophysics, mining and environment.",
    about2:
      "Its services also include hydrology, hydrogeology, GIS mapping and remote sensing.",
    discover: "Discover the firm",
    pillars: [
      ["Geology & mining", "Exploration, studies, mapping and mining support."],
      ["Water", "Hydrological, hydrogeological and hydrogeophysical studies."],
      ["Environment & GIS", "Impact studies, mapping, GIS and remote sensing."],
    ],
    expTitle: "Three areas of work",
    expDesc:
      "Choose a field: geology and mining, environment, or hydrology and hydrogeology.",
    methodKicker: "Services",
    methodTitle: "From field studies to deliverables",
    steps: [
      ["01", "Desk studies", "Research and documentary summaries."],
      ["02", "Field reconnaissance", "Planning, geological surveys and sampling."],
      ["03", "Specialist studies", "Hydrology, hydrogeology and impact studies."],
      ["04", "Maps and reports", "Thematic maps, reports and summaries."],
    ],
    methods: "Services",
    methodsTitle: "Studies, mapping and project support",
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
