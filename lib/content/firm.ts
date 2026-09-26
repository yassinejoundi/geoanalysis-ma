import type { LocalizedText } from "@/lib/i18n";

export interface FirmContentBlock {
  title: LocalizedText;
  description: LocalizedText;
}

export interface FirmValue extends FirmContentBlock {
  number: string;
}

export const firmContentBlocks: FirmContentBlock[] = [
  {
    title: { fr: "Notre activité", en: "Our work" },
    description: {
      fr: "GEOANALYSIS est un bureau d’études et de services en géologie, géophysique et environnement.",
      en: "GEOANALYSIS is a consultancy in geology, geophysics and environment.",
    },
  },
  {
    title: { fr: "Notre direction", en: "Our director" },
    description: {
      fr: "Le bureau est dirigé par le Dr Farah Abdelouahed, spécialisé en géologie, géophysique et environnement.",
      en: "The firm is led by Dr Farah Abdelouahed, a specialist in geology, geophysics and environment.",
    },
  },
  {
    title: { fr: "Notre offre", en: "Our services" },
    description: {
      fr: "Les prestations couvrent l’exploration et les études géologiques, l’accompagnement minier, l’hydrologie et l’hydrogéologie, les études d’impact et la cartographie SIG.",
      en: "Services cover geological exploration and studies, mining support, hydrology and hydrogeology, impact studies and GIS mapping.",
    },
  },
  {
    title: { fr: "Notre implantation", en: "Our location" },
    description: {
      fr: "Le siège de GEOANALYSIS se trouve à Marrakech, au Maroc.",
      en: "GEOANALYSIS is based in Marrakech, Morocco.",
    },
  },
];

export const firmValues: FirmValue[] = [
  {
    number: "01",
    title: { fr: "Pluridisciplinarité", en: "Multidisciplinary work" },
    description: {
      fr: "Les domaines associent géologie, géophysique, hydrologie, mines et environnement.",
      en: "The firm works across geology, geophysics, hydrology, mining and environment.",
    },
  },
  {
    number: "02",
    title: { fr: "Travail de terrain", en: "Fieldwork" },
    description: {
      fr: "Les services comprennent reconnaissance, levés géologiques, échantillonnage et suivi de sondages.",
      en: "Services include reconnaissance, geological surveys, sampling and drilling supervision.",
    },
  },
  {
    number: "03",
    title: { fr: "Études et conseil", en: "Studies and advice" },
    description: {
      fr: "L’offre comprend études de faisabilité, estimations de réserves et accompagnement administratif minier.",
      en: "Services include feasibility studies, reserve estimates and administrative support for mining projects.",
    },
  },
  {
    number: "04",
    title: { fr: "Partenariats durables", en: "Long-term partnerships" },
    description: {
      fr: "GEOANALYSIS vise à construire des partenariats durables avec ses clients.",
      en: "GEOANALYSIS aims to build long-term partnerships with clients.",
    },
  },
];
