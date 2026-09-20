import type { LocalizedText } from "@/lib/i18n";

export interface FirmContentBlock {
  title: LocalizedText;
  description: LocalizedText;
}

export interface FirmValue extends FirmContentBlock {
  number: string;
}

export const firmContentBlocks: FirmContentBlock[] = [
  { title: { fr: "Notre mission", en: "Our mission" }, description: { fr: "Produire une donnée géoscientifique fiable et traçable, et la traduire en éléments de décision pour nos clients publics et privés.", en: "Produce reliable, traceable geoscientific data and translate it into decision material for our public and private clients." } },
  { title: { fr: "Nos équipes", en: "Our teams" }, description: { fr: "Géologues, géophysiciens, hydrogéologues et ingénieurs environnement, appuyés par un pôle traitement et SIG interne.", en: "Geologists, geophysicists, hydrogeologists and environmental engineers, backed by an in-house processing and GIS unit." } },
  { title: { fr: "Nos moyens", en: "Our resources" }, description: { fr: "Parc instrumental propre pour la géophysique, l’hydrogéologie et le suivi environnemental, avec maintenance et calibration régulières.", en: "An in-house instrument fleet for geophysics, hydrogeology and environmental monitoring, with regular maintenance and calibration." } },
  { title: { fr: "Notre ancrage", en: "Our footprint" }, description: { fr: "Basés à Marrakech, nous intervenons sur l’ensemble du territoire national, du Rif aux provinces du Sud.", en: "Based in Marrakech, we work across the whole country, from the Rif to the southern provinces." } },
];

export const firmValues: FirmValue[] = [
  { number: "01", title: { fr: "Rigueur scientifique", en: "Scientific rigour" }, description: { fr: "Chaque interprétation est adossée à une donnée mesurée et documentée.", en: "Every interpretation rests on measured, documented data." } },
  { number: "02", title: { fr: "Indépendance", en: "Independence" }, description: { fr: "Aucun intérêt dans les projets que nous évaluons.", en: "No interest in the projects we assess." } },
  { number: "03", title: { fr: "Traçabilité", en: "Traceability" }, description: { fr: "Chaînes de traitement reproductibles et données archivées.", en: "Reproducible processing chains and archived data." } },
  { number: "04", title: { fr: "Confidentialité", en: "Confidentiality" }, description: { fr: "Protocoles stricts sur les données clients et les résultats.", en: "Strict protocols on client data and results." } },
];
