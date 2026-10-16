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
    context: {
      fr: "Une reconnaissance géologique décrit les formations visibles et leur organisation dans la zone étudiée. Les affleurements, contacts, structures et indices observés sont replacés dans le contexte du site afin de mieux comprendre les données disponibles et de préparer les investigations adaptées.",
      en: "A geological reconnaissance describes the visible formations and how they are arranged across the study area. Outcrops, contacts, structures and observed indicators are considered in the context of the site to clarify the available evidence and plan suitable further investigations.",
    },
    methodology: {
      fr: "Les cartes et documents disponibles servent à préparer le parcours de terrain. Chaque affleurement est localisé et décrit selon la lithologie, l’altération et les structures observables; les photos et notes sont rattachées aux points relevés. Les observations sont ensuite vérifiées et reportées sur un support cartographique.",
      en: "Available maps and records guide the field route. Each outcrop is located and described by lithology, alteration and visible structures; photographs and notes are linked to the recorded points. The observations are then reviewed and placed on a map.",
    },
    results: {
      fr: "La restitution rassemble les points d’observation, les descriptions de terrain et une synthèse cartographique des unités et structures relevées. Elle aide à repérer les zones qui peuvent nécessiter une vérification ou des travaux complémentaires. L’interprétation reste liée à l’échelle et aux conditions d’observation de la mission.",
      en: "The deliverable brings together observation points, field descriptions and a mapped summary of the units and structures recorded. It helps identify areas that may need checking or further work. Interpretation remains tied to the scale and conditions of the field assignment.",
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
    context: {
      fr: "Le suivi des sondages inscrit les travaux de forage dans leur cadre géologique et opérationnel. L’implantation et l’avancement sont documentés de façon cohérente afin de relier chaque point foré aux objectifs de reconnaissance et aux observations faites pendant la mission.",
      en: "Drilling follow-up places borehole work within its geological and operational setting. Locations and progress are documented consistently so each borehole can be related to the reconnaissance objectives and observations made during the assignment.",
    },
    methodology: {
      fr: "À partir du programme validé, les emplacements sont vérifiés et les visites de terrain consignent le point de forage, l’avancement communiqué, les formations observées et les écarts utiles. Lorsque des carottes ou déblais sont disponibles, leur description suit le protocole convenu. Les photos, profondeurs et remarques restent associées à chaque sondage.",
      en: "Using the approved programme, locations are checked and field visits record each borehole, reported progress, observed formations and relevant deviations. Where core or cuttings are available, they are described under the agreed protocol. Photographs, depths and notes remain linked to each borehole.",
    },
    results: {
      fr: "La restitution rassemble la situation des sondages, les fiches de suivi et les observations de terrain disponibles. Elle facilite la comparaison entre les points et la préparation des investigations suivantes. Les interprétations et recommandations restent limitées aux données recueillies et aux contrôles prévus par le programme.",
      en: "The deliverable brings together borehole locations, follow-up records and available field observations. It supports comparison between locations and planning for subsequent investigations. Interpretations and recommendations are limited to the collected data and checks defined by the programme.",
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
    context: {
      fr: "L’échantillonnage minéral relie les observations géologiques à des échantillons identifiables et traçables. Le choix des points dépend des objectifs de l’étude, des formations observées et des consignes de prélèvement retenues pour la mission.",
      en: "Mineral sampling connects geological observations with identifiable, traceable samples. Point selection depends on the study objectives, the formations observed and the sampling instructions agreed for the assignment.",
    },
    methodology: {
      fr: "Les points de prélèvement sont choisis selon le plan de travail, puis localisés et décrits sur le terrain. Chaque échantillon reçoit un identifiant lié à sa position et à ses observations; il est conditionné et inscrit dans un registre de suivi. Le transfert et les éventuelles analyses de laboratoire suivent le protocole convenu.",
      en: "Sampling points are selected from the work plan, then located and described in the field. Each sample receives an identifier linked to its position and observations; it is packaged and entered in a tracking register. Transfer and any laboratory analyses follow the agreed protocol.",
    },
    results: {
      fr: "Le dossier de restitution comprend l’inventaire des échantillons, leurs repères de terrain et les observations associées. Lorsque des analyses sont prévues et disponibles, leurs résultats sont rattachés aux identifiants correspondants. Cette traçabilité facilite la lecture des données sans remplacer leur interprétation dans le contexte géologique.",
      en: "The deliverable includes the sample inventory, field references and associated observations. When analyses are planned and available, their results are linked to the corresponding identifiers. This traceability supports data review without replacing interpretation in the geological context.",
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
    context: {
      fr: "Les prélèvements d’eau documentent la qualité et les conditions observées aux points suivis dans une étude hydrologique ou hydrogéologique. Les résultats s’interprètent avec le contexte du site et les conditions de mesure; une visite ponctuelle ne suffit pas à caractériser une évolution dans le temps.",
      en: "Water sampling documents quality and conditions observed at monitored points in a hydrological or hydrogeological study. Results are interpreted alongside the site context and measurement conditions; a single visit cannot establish a trend over time.",
    },
    methodology: {
      fr: "Les points et paramètres sont définis selon l’objectif de l’étude et le protocole retenu. Sur place, l’équipe consigne les conditions de prélèvement, effectue les mesures in situ prévues et identifie chaque échantillon. Le conditionnement, la conservation et le transfert vers le laboratoire respectent les consignes applicables à l’analyse demandée.",
      en: "Sampling points and parameters are set according to the study objective and agreed protocol. In the field, the team records sampling conditions, takes the planned in-situ measurements and identifies each sample. Packaging, preservation and transfer to the laboratory follow the instructions for the requested analysis.",
    },
    results: {
      fr: "La restitution rassemble les fiches de prélèvement, les mesures in situ et les observations associées. Les résultats d’analyses sont ajoutés lorsqu’ils sont disponibles et rapprochés des conditions de prélèvement. Cette synthèse constitue un état documenté des points visités et peut guider le suivi ou les investigations complémentaires.",
      en: "The deliverable brings together sampling records, in-situ measurements and related observations. Laboratory results are added when available and considered alongside sampling conditions. This summary documents the locations visited and can guide monitoring or further investigation.",
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

  return {
    id: mission.id,
    slug,
    state: "published",
    expertiseId: mission.id,
    subServiceId: "",
    location: "",
    date: "",
    title: mission.title,
    context: mission.context,
    methodology: mission.methodology,
    results: mission.results,
    seoTitle: mission.title,
    seoDescription: mission.description,
    gallery: [{ id: `${mission.id}-cover`, caption: "", isCover: true, url: mission.image }],
    domain: mission.domain,
    teaser: mission.description,
    coverImage: mission.image,
  };
}
