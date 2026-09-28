import type { Locale } from "@/lib/i18n";
import { firmDomains, firmValues, firmWorkStages } from "@/lib/content/firm";

export type BureauTextRow = { title: string; description: string };
export type BureauPhoto = { src: string; alt: string };

export type BureauContent = {
  seoTitle: string;
  seoDescription: string;
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageLabel: string;
  heroImageCaption: string;
  fieldsLabel: string;
  primaryAction: string;
  secondaryAction: string;
  domains: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutLead: string;
  aboutDetail: string;
  aboutLocation: string;
  aboutGalleryLabel: string;
  gallery: BureauPhoto[];
  teamEyebrow: string;
  teamTitle: string;
  partnersEyebrow: string;
  partnersTitle: string;
  methodEyebrow: string;
  methodTitle: string;
  methodLead: string;
  stages: BureauTextRow[];
  valuesTitle: string;
  values: BureauTextRow[];
};

export type BureauContentRecord = { locale: Locale; content: BureauContent };

const copy = {
  fr: {
    seoTitle: "Le Bureau",
    seoDescription: "Découvrez GEOANALYSIS, bureau d’études en géologie, géophysique et environnement à Marrakech.",
    heroKicker: "GEOANALYSIS · MARRAKECH, MAROC",
    heroTitle: "Lire le terrain. Éclairer vos projets.",
    heroLead: "Bureau d’études et de services en géologie, géophysique et environnement, GEOANALYSIS accompagne vos projets depuis Marrakech.",
    heroImageAlt: "Équipe GEOANALYSIS sur un chantier de forage en terrain montagneux.",
    heroImageLabel: "TRAVAUX DE TERRAIN",
    heroImageCaption: "Reconnaissance et suivi de forage",
    fieldsLabel: "Domaines d’intervention",
    primaryAction: "Parlons de votre projet",
    secondaryAction: "Notre méthode",
    aboutEyebrow: "À propos",
    aboutTitle: "Un bureau d’études entre terrain et décision",
    aboutLead: "Basé à Marrakech, GEOANALYSIS accompagne les projets en géologie, géophysique, hydrogéologie et environnement.",
    aboutDetail: "Les missions associent travail de terrain, études techniques et cartographie pour produire des livrables adaptés à chaque besoin.",
    aboutLocation: "Marrakech · Maroc",
    aboutGalleryLabel: "L’équipe sur le terrain",
    teamEyebrow: "Les personnes derrière les études",
    teamTitle: "Notre équipe",
    partnersEyebrow: "Un réseau de confiance",
    partnersTitle: "Nos partenaires",
    methodEyebrow: "Notre méthode",
    methodTitle: "Du terrain à la décision",
    methodLead: "De la reconnaissance de terrain à la synthèse technique, les prestations mobilisent les étapes utiles au sujet étudié.",
    valuesTitle: "Une exigence partagée, à chaque mission",
  },
  en: {
    seoTitle: "The Firm",
    seoDescription: "Meet GEOANALYSIS, a geology, geophysics and environmental consultancy based in Marrakech.",
    heroKicker: "GEOANALYSIS · MARRAKECH, MOROCCO",
    heroTitle: "Read the ground. Guide what comes next.",
    heroLead: "GEOANALYSIS is a geology, geophysics and environmental consultancy based in Marrakech.",
    heroImageAlt: "GEOANALYSIS team at a drilling site in mountainous terrain.",
    heroImageLabel: "FIELD STUDIES",
    heroImageCaption: "Site reconnaissance and drilling support",
    fieldsLabel: "Areas of expertise",
    primaryAction: "Discuss your project",
    secondaryAction: "How we work",
    aboutEyebrow: "About us",
    aboutTitle: "Grounded in the field. Focused on clear decisions.",
    aboutLead: "Based in Marrakech, GEOANALYSIS supports projects in geology, geophysics, hydrogeology and environmental studies.",
    aboutDetail: "Assignments bring together fieldwork, technical studies and mapping to deliver work suited to each project’s needs.",
    aboutLocation: "Marrakech · Morocco",
    aboutGalleryLabel: "The team in the field",
    teamEyebrow: "The people behind the studies",
    teamTitle: "Our team",
    partnersEyebrow: "A trusted network",
    partnersTitle: "Our partners",
    methodEyebrow: "How we work",
    methodTitle: "From fieldwork to findings",
    methodLead: "From site reconnaissance to technical synthesis, each assignment draws on the steps suited to the work at hand.",
    valuesTitle: "One standard across every assignment",
  },
} as const;

const gallery = [
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613173/geoanalysis-ma/bureau/about-team-geology-20260928.webp",
    alt: { fr: "Deux membres de l’équipe GEOANALYSIS en reconnaissance sur un site géologique.", en: "Two GEOANALYSIS team members surveying a geological site." },
  },
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613179/geoanalysis-ma/bureau/about-team-geophysics-20260928.webp",
    alt: { fr: "Un membre de l’équipe consulte les mesures d’un appareil de terrain.", en: "A team member reviewing readings from field equipment." },
  },
  {
    src: "https://res.cloudinary.com/d7qa2cop/image/upload/v1790613588/geoanalysis-ma/bureau/about-team-sampling-20260928.webp",
    alt: { fr: "Deux membres de l’équipe prélèvent un échantillon d’eau sur le terrain.", en: "Two team members collecting a water sample in the field." },
  },
];

function contentFor(locale: Locale): BureauContent {
  const text = copy[locale];
  return {
    ...text,
    heroImage: "/firm-fieldwork.jpg",
    domains: firmDomains.map((item) => item.title[locale]),
    gallery: gallery.map(({ src, alt }) => ({ src, alt: alt[locale] })),
    stages: firmWorkStages.map((item) => ({ title: item.title[locale], description: item.description[locale] })),
    values: firmValues.map((item) => ({ title: item.title[locale], description: item.description[locale] })),
  };
}

export const bureauContent: Record<Locale, BureauContent> = {
  fr: contentFor("fr"),
  en: contentFor("en"),
};
