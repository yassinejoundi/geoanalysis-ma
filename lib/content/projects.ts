import type { PublicationState } from "@/lib/content/admin";
import type { LocalizedText } from "@/lib/i18n";
import type { ArticleFileAttachment, ArticleResource } from "@/lib/content/article-document";

export type ProjectImage = {
  id: string;
  caption: string;
  isCover: boolean;
  url?: string;
};

export type ProjectDraft = {
  id: string;
  slug?: string;
  state: PublicationState;
  expertiseId: string;
  subServiceId: string;
  location: string;
  date: string;
  title: LocalizedText;
  context: LocalizedText;
  methodology: LocalizedText;
  results: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  gallery: ProjectImage[];
  author?: string;
  files?: ArticleFileAttachment[];
  resources?: ArticleResource[];
  readingTime?: string;
  publishedAt?: string | null;
  legacyImage?: string;
};

export type PublicProject = ProjectDraft & {
  slug: string;
  domain: LocalizedText;
  teaser: LocalizedText;
  coverImage?: string;
};

export function projectSlug(title: string, id: string) {
  const readable = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "projet";
  return `${readable}-${id.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
}

export const realisationMissions = [
  {
    id: "reconnaissance",
    number: "01",
    domain: { fr: "Géologie & mines", en: "Geology & mining" },
    title: { fr: "Reconnaissance géologique", en: "Geological reconnaissance" },
    description: {
      fr: "Levés géologiques et observations d’affleurements pour documenter les formations rencontrées.",
      en: "Geological surveys and outcrop observations document the formations encountered.",
    },
    image: "/realisations/geological-survey.webp",
    alt: {
      fr: "Intervenant en gilet haute visibilité sur un affleurement rocheux.",
      en: "Field worker in a high-visibility vest on a rocky outcrop.",
    },
  },
  {
    id: "sondages",
    number: "02",
    domain: { fr: "Exploration minière", en: "Mineral exploration" },
    title: { fr: "Suivi de sondages", en: "Drilling follow-up" },
    description: {
      fr: "Implantation et suivi des sondages dans le cadre des travaux de reconnaissance.",
      en: "Drill planning and follow-up as part of field reconnaissance work.",
    },
    image: "/realisations/drilling-follow-up.webp",
    alt: {
      fr: "Travaux de sondage sur un terrain rocheux.",
      en: "Drilling work on rocky ground.",
    },
  },
  {
    id: "echantillonnage",
    number: "03",
    domain: { fr: "Géologie", en: "Geology" },
    title: { fr: "Échantillonnage minéral", en: "Mineral sampling" },
    description: {
      fr: "Échantillons de roche documentés avec des repères de terrain pour accompagner les observations géologiques.",
      en: "Rock samples documented with field references to support geological observations.",
    },
    image: "/realisations/mineral-sample.webp",
    alt: {
      fr: "Échantillon de roche accompagné d’une boussole et d’une échelle de terrain.",
      en: "Rock sample beside a compass and field scale.",
    },
  },
  {
    id: "eau",
    number: "04",
    domain: { fr: "Hydrologie & hydrogéologie", en: "Hydrology & hydrogeology" },
    title: { fr: "Prélèvements d’eau", en: "Water sampling" },
    description: {
      fr: "Prélèvements et analyses in situ dans le cadre des études hydrologiques et hydrogéologiques.",
      en: "Water collection and in-situ analysis for hydrological and hydrogeological studies.",
    },
    image: "/realisations/water-sampling.webp",
    alt: {
      fr: "Intervenant recueillant de l’eau au niveau d’un puits.",
      en: "Field worker collecting water from a well.",
    },
  },
] as const;

export function getFallbackPublicProjectBySlug(slug: string): PublicProject | null {
  const mission = realisationMissions.find(
    (item) => projectSlug(item.title.fr, item.id) === slug,
  );
  if (!mission) return null;

  const emptyText: LocalizedText = { fr: "", en: "" };
  return {
    id: mission.id,
    slug,
    state: "published",
    expertiseId: mission.id,
    subServiceId: "",
    location: "",
    date: "",
    title: mission.title,
    context: mission.description,
    methodology: emptyText,
    results: emptyText,
    seoTitle: mission.title,
    seoDescription: mission.description,
    gallery: [{ id: `${mission.id}-cover`, caption: "", isCover: true, url: mission.image }],
    domain: mission.domain,
    teaser: emptyText,
    coverImage: mission.image,
  };
}
