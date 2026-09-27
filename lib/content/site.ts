import type { LocalizedText, Locale } from "@/lib/i18n";

export interface Expertise {
  id: "mining" | "env" | "water";
  slug: string;
  number: string;
  name: LocalizedText;
  summary: LocalizedText;
  image: { src: string; alt: LocalizedText };
  subServices: { name: LocalizedText; summary: LocalizedText }[];
}

export interface Project {
  id: string;
  slug: string;
  expertiseId: Expertise["id"];
  domain: LocalizedText;
  location: string;
  title: LocalizedText;
  teaser: LocalizedText;
}

export interface EditorialEntry {
  id: string;
  slug: string;
  category: LocalizedText;
  date: LocalizedText;
  dateISO?: string;
  readingTime?: string;
  title: LocalizedText;
  teaser: LocalizedText;
  imageLabel: string;
  image?: { src: string; alt: LocalizedText };
}

export interface EditorialDetailEntry extends EditorialEntry {
  body: Record<Locale, string[]>;
}

export interface MethodGroup {
  id: string;
  title: LocalizedText;
  items: { name: LocalizedText; description: LocalizedText }[];
}

export const expertises: Expertise[] = [
  {
    id: "mining", slug: "exploration-miniere", number: "01",
    name: { fr: "Géologie et mines", en: "Geology and mining" },
    summary: { fr: "Études géologiques, cartographie, travaux de terrain et accompagnement des projets miniers.", en: "Geological studies, mapping, fieldwork and support for mining projects." },
    image: {
      src: "/expertises/geology-outcrop.jpg",
      alt: { fr: "Affleurement rocheux aux couches contrastées", en: "Rock outcrop with contrasting layers" },
    },
    subServices: [
      { name: { fr: "Études géologiques", en: "Geological studies" }, summary: { fr: "Exploration et études géologiques", en: "Exploration and geological studies" } },
      { name: { fr: "Cartographie", en: "Mapping" }, summary: { fr: "Cartographie et levés de terrain", en: "Mapping and field surveys" } },
      { name: { fr: "Sondages", en: "Drilling" }, summary: { fr: "Planification et suivi", en: "Planning and supervision" } },
      { name: { fr: "Appui minier", en: "Mining support" }, summary: { fr: "Études, gestion et démarches administratives", en: "Studies, administration and operational support" } },
    ],
  },
  {
    id: "env", slug: "etudes-impact", number: "02",
    name: { fr: "Études environnementales", en: "Environmental studies" },
    summary: { fr: "Études d’impact, protection de l’environnement et appui aux démarches administratives.", en: "Impact studies, environmental protection and administrative support." },
    image: {
      src: "/expertises/environment-landscape.jpg",
      alt: { fr: "Versant montagneux couvert d’une végétation basse", en: "Mountain slope covered with low-growing vegetation" },
    },
    subServices: [
      { name: { fr: "Études d’impact", en: "Impact studies" }, summary: { fr: "Projets miniers et carrières", en: "Mining and quarry projects" } },
      { name: { fr: "Protection environnementale", en: "Environmental protection" }, summary: { fr: "Solutions de protection", en: "Protection solutions" } },
      { name: { fr: "Aménagement de sites", en: "Site planning" }, summary: { fr: "Études d’aménagement", en: "Site planning studies" } },
      { name: { fr: "Appui administratif", en: "Administrative support" }, summary: { fr: "Occupation temporaire", en: "Temporary occupation" } },
    ],
  },
  {
    id: "water", slug: "ressources-en-eau", number: "03",
    name: { fr: "Hydrologie et hydrogéologie", en: "Hydrology and hydrogeology" },
    summary: { fr: "Études hydrologiques et hydrogéologiques, hydro-géophysique et analyse de l’eau.", en: "Hydrological and hydrogeological studies, hydrogeophysics and water analysis." },
    image: {
      src: "/expertises/hydrogeology-well.jpg",
      alt: { fr: "Puits en pierre avec poulie dans un paysage aride", en: "Stone well with a pulley in an arid landscape" },
    },
    subServices: [
      { name: { fr: "Études hydrologiques", en: "Hydrological studies" }, summary: { fr: "Études hydrologiques et hydrogéologiques", en: "Hydrological and hydrogeological studies" } },
      { name: { fr: "Hydro-géophysique", en: "Hydrogeophysics" }, summary: { fr: "Études hydro-géophysiques", en: "Hydrogeophysical studies" } },
      { name: { fr: "Prélèvements et analyses", en: "Sampling and analysis" }, summary: { fr: "Prélèvements et analyses in situ", en: "In-situ sampling and analysis" } },
      { name: { fr: "Zones inondables", en: "Flood zones" }, summary: { fr: "Simulation hydraulique et délimitation", en: "Hydraulic simulation and delineation" } },
    ],
  },
];

export const projects: Project[] = [];
export const news: EditorialDetailEntry[] = [
  {
    id: "reconnaissance-terrain",
    slug: "reconnaissance-geologique-aout-2024",
    category: { fr: "Terrain", en: "Fieldwork" },
    date: { fr: "22 août 2024", en: "August 22, 2024" },
    dateISO: "2024-08-22",
    title: {
      fr: "Reconnaissance géologique sur le terrain",
      en: "Geological reconnaissance in the field",
    },
    teaser: {
      fr: "Une archive du 22 août 2024 montre un versant rocheux entaillé par une coupe de terrain.",
      en: "An archive photo dated August 22, 2024 shows a rocky slope with a field cut.",
    },
    imageLabel: "Versant rocheux dans une archive de terrain",
    image: {
      src: "/actualites/reconnaissance-terrain.webp",
      alt: {
        fr: "Versant rocheux aride marqué par une coupe de terrain",
        en: "Arid rocky slope marked by a field cut",
      },
    },
    body: {
      fr: [
        "L’archive photographique de GEOANALYSIS contient un cliché daté du 22 août 2024. Il montre un versant rocheux entaillé par une coupe de terrain.",
        "La fiche de services du bureau cite les études et levés géologiques, l’échantillonnage et la préparation de travaux de reconnaissance.",
      ],
      en: [
        "The GEOANALYSIS photo archive contains an image dated August 22, 2024. It shows a rocky slope cut by a field trench.",
        "The firm’s service sheet lists geological studies and surveys, sampling, and reconnaissance planning.",
      ],
    },
  },
  {
    id: "echantillons-roches",
    slug: "echantillons-roches-fevrier-2024",
    category: { fr: "Échantillonnage", en: "Sampling" },
    date: { fr: "14 février 2024", en: "February 14, 2024" },
    dateISO: "2024-02-14",
    title: {
      fr: "Des échantillons de roche documentés",
      en: "Rock samples documented",
    },
    teaser: {
      fr: "Des clichés datés de février 2024 montrent des échantillons photographiés avec un repère de mesure.",
      en: "Photos dated February 2024 show rock samples photographed beside a measuring scale.",
    },
    imageLabel: "Échantillon de roche avec repère de mesure",
    image: {
      src: "/actualites/echantillons-roche.webp",
      alt: {
        fr: "Échantillon de roche posé sur une planche graduée",
        en: "Rock sample placed on a measuring board",
      },
    },
    body: {
      fr: [
        "Plusieurs images conservées dans les supports du bureau sont datées du 14 février 2024. Elles montrent des roches photographiées avec un repère de mesure.",
        "La fiche de services mentionne l’échantillonnage géologique et les synthèses issues de recherches documentaires.",
        "Les sources ne précisent ni l’origine de ces échantillons ni les analyses éventuellement associées.",
      ],
      en: [
        "Several images in the firm’s archive are dated February 14, 2024. They show rocks photographed beside a measuring scale.",
        "The service sheet mentions geological sampling and syntheses based on documentary research.",
        "The sources do not identify the origin of these samples or any related analyses.",
      ],
    },
  },
  {
    id: "affleurements-geologiques",
    slug: "affleurements-geologiques-aout-2023",
    category: { fr: "Géologie", en: "Geology" },
    date: { fr: "29 août 2023", en: "August 29, 2023" },
    dateISO: "2023-08-29",
    title: {
      fr: "Lire les couches, décrire l’affleurement",
      en: "Reading the layers, describing the outcrop",
    },
    teaser: {
      fr: "Une vue d’archive montre un affleurement aux couches contrastées, dans un ensemble de photos datées d’août 2023.",
      en: "An archive image shows a rocky outcrop with contrasting layers in a photo set dated August 2023.",
    },
    imageLabel: "Affleurement rocheux aux couches contrastées",
    image: {
      src: "/actualites/affleurement-geologique.webp",
      alt: {
        fr: "Affleurement rocheux présentant des couches contrastées",
        en: "Rocky outcrop with contrasting visible layers",
      },
    },
    body: {
      fr: [
        "Un cliché du fonds photographique, daté du 29 août 2023, montre un affleurement rocheux aux couches visibles.",
        "La fiche de services de GEOANALYSIS cite les études, les levés et la cartographie géologiques.",
      ],
      en: [
        "A photo in the archive, dated August 29, 2023, shows a rocky outcrop with visible layers.",
        "The GEOANALYSIS service sheet lists geological studies, surveys, and mapping.",
      ],
    },
  },
];
export const articles: EditorialDetailEntry[] = [];

export const methodGroups: MethodGroup[] = [
  {
    id: "01",
    title: { fr: "Géologie et mines", en: "Geology and mining" },
    items: [
      { name: { fr: "Cartographie géologique", en: "Geological mapping" }, description: { fr: "Cartographie et levés géologiques.", en: "Geological mapping and surveys." } },
      { name: { fr: "Échantillonnage", en: "Sampling" }, description: { fr: "Prélèvements et échantillonnages géologiques.", en: "Geological sampling." } },
      { name: { fr: "Sondages", en: "Drilling" }, description: { fr: "Planification et supervision des sondages.", en: "Drilling planning and supervision." } },
      { name: { fr: "Études minières", en: "Mining studies" }, description: { fr: "Études de faisabilité et estimation des réserves.", en: "Feasibility studies and reserve estimates." } },
      { name: { fr: "Appui aux projets miniers", en: "Mining project support" }, description: { fr: "Gestion, conseil et accompagnement opérationnel ou administratif.", en: "Administration, consulting and operational or administrative support." } },
    ],
  },
  {
    id: "02",
    title: { fr: "Hydrologie et environnement", en: "Water and environment" },
    items: [
      { name: { fr: "Études hydrologiques et hydrogéologiques", en: "Hydrological and hydrogeological studies" }, description: { fr: "Études hydrologiques, hydrogéologiques et hydro-géophysiques.", en: "Hydrological, hydrogeological and hydrogeophysical studies." } },
      { name: { fr: "Analyse de l’eau", en: "Water analysis" }, description: { fr: "Prélèvements et analyses in situ.", en: "In-situ sampling and analysis." } },
      { name: { fr: "Simulation hydraulique", en: "Hydraulic simulation" }, description: { fr: "Simulation pour délimiter les zones inondables.", en: "Simulation to delineate flood zones." } },
      { name: { fr: "Études d’impact environnemental", en: "Environmental impact studies" }, description: { fr: "Études pour les projets miniers et de carrières.", en: "Studies for mining and quarry projects." } },
      { name: { fr: "Protection et aménagement", en: "Protection and planning" }, description: { fr: "Solutions de protection environnementale, études d’aménagement et appui administratif.", en: "Environmental protection solutions, site planning studies and administrative support." } },
    ],
  },
  {
    id: "03",
    title: { fr: "SIG et télédétection", en: "GIS and remote sensing" },
    items: [
      { name: { fr: "Cartographie thématique", en: "Thematic mapping" }, description: { fr: "Cartes thématiques, minières, géophysiques et hydrologiques.", en: "Thematic, mining, geophysical and hydrological maps." } },
      { name: { fr: "Rapports et synthèses", en: "Reports and syntheses" }, description: { fr: "Rapports bibliographiques et synthèses.", en: "Bibliographic reports and syntheses." } },
      { name: { fr: "Formation en SIG", en: "GIS training" }, description: { fr: "Formation en systèmes d’information géographique.", en: "Geographic information systems training." } },
      { name: { fr: "Formation en télédétection", en: "Remote-sensing training" }, description: { fr: "Formation en télédétection.", en: "Remote-sensing training." } },
    ],
  },
];
