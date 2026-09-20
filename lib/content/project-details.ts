import type { Project } from "@/lib/content/site";
import type { LocalizedText } from "@/lib/i18n";

export interface ProjectDetail {
  imageLabel: LocalizedText;
  description: LocalizedText;
  methods: LocalizedText[];
  results: { value: string; label: LocalizedText }[];
}

export const projectDetails: Record<Project["id"], ProjectDetail> = {
  p1: {
    imageLabel: { fr: "IMAGE — PROJET / LEVÉ MAGNÉTIQUE", en: "IMAGE — PROJECT / MAGNETIC SURVEY" },
    description: { fr: "Campagne de reconnaissance sur un permis de 42 km² présentant des indices de cuivre en surface. Objectif : cartographier les structures porteuses sous couverture et prioriser les cibles de sondage.", en: "Reconnaissance campaign on a 42 km² permit with surface copper showings. Goal: map bearing structures beneath cover and prioritise drill targets." },
    methods: [
      { fr: "Levé magnétique drone à 40 m de maille", en: "Drone magnetic survey on a 40 m grid" },
      { fr: "Profils IP/résistivité sur 12 lignes", en: "IP/resistivity profiles on 12 lines" },
      { fr: "Échantillonnage géochimique de sols (612 points)", en: "Soil geochemistry sampling (612 points)" },
      { fr: "Inversion 3D et corrélation multi-méthodes", en: "3D inversion and multi-method correlation" },
    ],
    results: [
      { value: "420 km", label: { fr: "de profils acquis", en: "of profiles acquired" } },
      { value: "6", label: { fr: "cibles hiérarchisées", en: "ranked targets" } },
      { value: "-35 %", label: { fr: "de mètres forés évités", en: "of drilled metres avoided" } },
    ],
  },
  p2: {
    imageLabel: { fr: "IMAGE — PROJET / ÉTUDE D’IMPACT", en: "IMAGE — PROJECT / IMPACT STUDY" },
    description: { fr: "Étude d’impact réglementaire pour un projet photovoltaïque en zone semi-aride, incluant inventaires biodiversité sur quatre saisons et concertation avec les ayants droit.", en: "Regulatory impact study for a photovoltaic project in a semi-arid area, including four-season biodiversity inventories and consultation with rights holders." },
    methods: [
      { fr: "Inventaires faune/flore sur 4 campagnes", en: "Fauna/flora inventories over 4 campaigns" },
      { fr: "Mesures bruit et qualité de l’air", en: "Noise and air quality measurements" },
      { fr: "Analyse paysagère et cartographie des sensibilités", en: "Landscape analysis and sensitivity mapping" },
      { fr: "Élaboration du PGES chiffré", en: "Costed ESMP development" },
    ],
    results: [
      { value: "4", label: { fr: "campagnes saisonnières", en: "seasonal campaigns" } },
      { value: "118", label: { fr: "espèces inventoriées", en: "species recorded" } },
      { value: "1 tour", label: { fr: "d’instruction administrative", en: "of administrative review" } },
    ],
  },
  p3: {
    imageLabel: { fr: "IMAGE — PROJET / PROSPECTION ERT", en: "IMAGE — PROJECT / ERT SURVEY" },
    description: { fr: "Programme de sécurisation de la ressource pour un périmètre irrigué en tension, combinant reconnaissance géophysique, implantation et essais de pompage.", en: "Resource security programme for a stressed irrigated perimeter, combining geophysical reconnaissance, siting and pumping tests." },
    methods: [
      { fr: "28 profils ERT sur 900 ha", en: "28 ERT profiles across 900 ha" },
      { fr: "Analyse structurale des fractures aquifères", en: "Structural analysis of aquifer fractures" },
      { fr: "Supervision de 14 forages", en: "Supervision of 14 boreholes" },
      { fr: "Essais de pompage longue durée", en: "Long-duration pumping tests" },
    ],
    results: [
      { value: "13/14", label: { fr: "forages productifs", en: "productive boreholes" } },
      { value: "28", label: { fr: "profils ERT", en: "ERT profiles" } },
      { value: "900 ha", label: { fr: "périmètre couvert", en: "perimeter covered" } },
    ],
  },
  p4: {
    imageLabel: { fr: "IMAGE — PROJET / MODÈLE 3D", en: "IMAGE — PROJECT / 3D MODEL" },
    description: { fr: "Consolidation et réinterprétation de données de sondages historiques pour produire un modèle géologique et une estimation de ressource auditable.", en: "Consolidation and reinterpretation of legacy drillhole data to produce an auditable geological model and resource estimate." },
    methods: [
      { fr: "Numérisation de 1 240 sondages", en: "Digitisation of 1,240 drillholes" },
      { fr: "Contrôle qualité et validation de base", en: "QA/QC and database validation" },
      { fr: "Modélisation implicite des corps", en: "Implicit modelling of ore bodies" },
      { fr: "Estimation par krigeage ordinaire", en: "Ordinary kriging estimation" },
    ],
    results: [
      { value: "1 240", label: { fr: "sondages intégrés", en: "drillholes integrated" } },
      { value: "3", label: { fr: "domaines minéralisés", en: "mineralised domains" } },
      { value: "JORC", label: { fr: "référentiel de reporting", en: "reporting framework" } },
    ],
  },
  p5: {
    imageLabel: { fr: "IMAGE — PROJET / AUDIT SITE", en: "IMAGE — PROJECT / SITE AUDIT" },
    description: { fr: "Audit environnemental d’un site en exploitation, revue des rejets et définition d’une trajectoire de conformité priorisée par le risque.", en: "Environmental audit of an operating site, review of discharges and a risk-prioritised compliance trajectory." },
    methods: [
      { fr: "Revue documentaire et autorisations", en: "Document and permit review" },
      { fr: "Campagne de mesures rejets et sols", en: "Discharge and soil measurement campaign" },
      { fr: "Analyse des écarts réglementaires", en: "Regulatory gap analysis" },
      { fr: "Feuille de route priorisée", en: "Prioritised roadmap" },
    ],
    results: [
      { value: "32", label: { fr: "écarts identifiés", en: "gaps identified" } },
      { value: "18 mois", label: { fr: "trajectoire de conformité", en: "compliance trajectory" } },
      { value: "0", label: { fr: "sanction administrative", en: "administrative penalty" } },
    ],
  },
  p6: {
    imageLabel: { fr: "IMAGE — PROJET / MODÈLE HYDRO", en: "IMAGE — PROJECT / HYDRO MODEL" },
    description: { fr: "Construction d’un modèle hydrodynamique régional pour évaluer trois scénarios de prélèvement et le risque d’intrusion salée à horizon 2040.", en: "Regional hydrodynamic model built to assess three abstraction scenarios and saline intrusion risk to 2040." },
    methods: [
      { fr: "Compilation piézométrique multi-décennale", en: "Multi-decade piezometric compilation" },
      { fr: "Analyses physico-chimiques et isotopiques", en: "Physico-chemical and isotopic analyses" },
      { fr: "Calage du modèle MODFLOW", en: "MODFLOW model calibration" },
      { fr: "Simulation de 3 scénarios à 2040", en: "Simulation of 3 scenarios to 2040" },
    ],
    results: [
      { value: "3", label: { fr: "scénarios simulés", en: "scenarios simulated" } },
      { value: "2040", label: { fr: "horizon de projection", en: "projection horizon" } },
      { value: "62", label: { fr: "points de suivi", en: "monitoring points" } },
    ],
  },
};
