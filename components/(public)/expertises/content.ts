import type { Locale } from "@/lib/i18n";

export const expertisePageCopy = {
  fr: {
    indexTitle: "Nos expertises",
    indexLead: "Des études géologiques et minières aux missions d’hydrologie et d’environnement, découvrez les prestations GEOANALYSIS.",
    indexSectionKicker: "Domaines d’intervention",
    indexSectionTitle: "Trois champs d’intervention",
    openDetails: "Voir les prestations",
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
    indexLead: "Explore GEOANALYSIS services, from geological and mining studies to hydrology and environmental work.",
    indexSectionKicker: "Areas of work",
    indexSectionTitle: "Three areas of work",
    openDetails: "View services",
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
