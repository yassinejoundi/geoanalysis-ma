import type { LocalizedText, Locale } from "@/lib/i18n";

export interface Expertise {
  id: "mining" | "env" | "water";
  slug: string;
  number: string;
  name: LocalizedText;
  summary: LocalizedText;
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
  date: string;
  readingTime?: string;
  title: LocalizedText;
  teaser: LocalizedText;
  imageLabel: string;
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
    subServices: [
      { name: { fr: "Études hydrologiques", en: "Hydrological studies" }, summary: { fr: "Études hydrologiques et hydrogéologiques", en: "Hydrological and hydrogeological studies" } },
      { name: { fr: "Hydro-géophysique", en: "Hydrogeophysics" }, summary: { fr: "Études hydro-géophysiques", en: "Hydrogeophysical studies" } },
      { name: { fr: "Prélèvements et analyses", en: "Sampling and analysis" }, summary: { fr: "Prélèvements et analyses in situ", en: "In-situ sampling and analysis" } },
      { name: { fr: "Zones inondables", en: "Flood zones" }, summary: { fr: "Simulation hydraulique et délimitation", en: "Hydraulic simulation and delineation" } },
    ],
  },
];

export const projects: Project[] = [];
export const news: EditorialDetailEntry[] = [];
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
