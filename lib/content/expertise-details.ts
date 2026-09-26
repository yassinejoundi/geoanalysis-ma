import type { Expertise } from "@/lib/content/site";
import type { LocalizedText } from "@/lib/i18n";

export interface ExpertiseDetail {
  intro: LocalizedText;
  overview: LocalizedText;
  services: { number: string; name: LocalizedText; description: LocalizedText }[];
}

export const expertiseDetails: Record<Expertise["id"], ExpertiseDetail> = {
  mining: {
    intro: {
      fr: "Des études géologiques et d’exploration à l’accompagnement des projets miniers.",
      en: "From geological and exploration studies to support for mining projects.",
    },
    overview: {
      fr: "Les prestations couvrent les études géologiques, la cartographie et les travaux de terrain, ainsi que l’appui aux démarches et opérations minières.",
      en: "Services cover geological studies, mapping and fieldwork, along with support for mining administration and operations.",
    },
    services: [
      {
        number: "01",
        name: { fr: "Études et exploration", en: "Studies and exploration" },
        description: {
          fr: "Études d’exploration et études géologiques.",
          en: "Exploration and geological studies.",
        },
      },
      {
        number: "02",
        name: { fr: "Cartographie et terrain", en: "Mapping and fieldwork" },
        description: {
          fr: "Cartographie, échantillonnage et levés géologiques.",
          en: "Mapping, sampling and geological surveys.",
        },
      },
      {
        number: "03",
        name: { fr: "Sondages", en: "Drilling" },
        description: {
          fr: "Planification des sondages et supervision des travaux.",
          en: "Drilling planning and supervision.",
        },
      },
      {
        number: "04",
        name: { fr: "Études et appui miniers", en: "Mining studies and support" },
        description: {
          fr: "Études de faisabilité, estimation des réserves, conseil, appui opérationnel et aide administrative pour les permis et licences.",
          en: "Feasibility studies, reserve estimates, consulting, operational support, and administrative support for permits and licences.",
        },
      },
      {
        number: "05",
        name: { fr: "Gestion minière", en: "Mining administration" },
        description: {
          fr: "Administration des actifs miniers et identification de sites pour appel d’offres.",
          en: "Mining-asset administration and identification of sites for tender.",
        },
      },
    ],
  },
  env: {
    intro: {
      fr: "Des études d’impact environnemental aux solutions de protection et d’aménagement.",
      en: "From environmental impact studies to protection and site-planning solutions.",
    },
    overview: {
      fr: "Le périmètre environnemental présenté par GEOANALYSIS comprend les projets miniers et de carrières, les études d’aménagement et l’appui administratif lié à l’occupation temporaire.",
      en: "GEOANALYSIS’s stated environmental scope includes mining and quarry projects, site-planning studies, and administrative support related to temporary occupation.",
    },
    services: [
      {
        number: "01",
        name: { fr: "Études d’impact", en: "Impact studies" },
        description: {
          fr: "Études d’impact environnemental pour les projets miniers et de carrières.",
          en: "Environmental impact studies for mining and quarry projects.",
        },
      },
      {
        number: "02",
        name: { fr: "Protection environnementale", en: "Environmental protection" },
        description: {
          fr: "Solutions de protection de l’environnement.",
          en: "Environmental protection solutions.",
        },
      },
      {
        number: "03",
        name: { fr: "Aménagement de sites", en: "Site planning" },
        description: {
          fr: "Études d’aménagement de sites.",
          en: "Site-planning studies.",
        },
      },
      {
        number: "04",
        name: { fr: "Appui administratif", en: "Administrative support" },
        description: {
          fr: "Accompagnement des démarches d’occupation temporaire.",
          en: "Support for temporary-occupation procedures.",
        },
      },
    ],
  },
  water: {
    intro: {
      fr: "Des études hydrologiques et hydrogéologiques à l’analyse de l’eau et aux simulations hydrauliques.",
      en: "From hydrological and hydrogeological studies to water analysis and hydraulic simulations.",
    },
    overview: {
      fr: "Les prestations comprennent des études hydrologiques, hydrogéologiques et hydro-géophysiques, des prélèvements et analyses in situ, ainsi que la simulation hydraulique des zones inondables.",
      en: "Services include hydrological, hydrogeological and hydrogeophysical studies, in-situ sampling and analysis, and hydraulic simulation of flood zones.",
    },
    services: [
      {
        number: "01",
        name: { fr: "Études hydrologiques", en: "Hydrological studies" },
        description: {
          fr: "Études hydrologiques et hydrogéologiques.",
          en: "Hydrological and hydrogeological studies.",
        },
      },
      {
        number: "02",
        name: { fr: "Études hydro-géophysiques", en: "Hydrogeophysical studies" },
        description: {
          fr: "Études hydro-géophysiques.",
          en: "Hydrogeophysical studies.",
        },
      },
      {
        number: "03",
        name: { fr: "Prélèvements et analyses", en: "Sampling and analysis" },
        description: {
          fr: "Prélèvements et analyses de l’eau in situ.",
          en: "In-situ water sampling and analysis.",
        },
      },
      {
        number: "04",
        name: { fr: "Simulation hydraulique", en: "Hydraulic simulation" },
        description: {
          fr: "Simulation hydraulique pour délimiter les zones inondables.",
          en: "Hydraulic simulation to delineate flood zones.",
        },
      },
    ],
  },
};
