import type { Expertise } from "@/lib/content/site";
import type { LocalizedText } from "@/lib/i18n";

export interface ExpertiseDetail {
  imageLabel: LocalizedText;
  intro: LocalizedText;
  context: LocalizedText;
  approach: LocalizedText;
  methods: { number: string; name: LocalizedText; description: LocalizedText }[];
  technologies: LocalizedText[];
  deliverables: LocalizedText[];
  audience: LocalizedText[];
}

export const expertiseDetails: Record<Expertise["id"], ExpertiseDetail> = {
  mining: {
    imageLabel: { fr: "IMAGE — LEVÉ GÉOPHYSIQUE / ANTI-ATLAS", en: "IMAGE — GEOPHYSICAL SURVEY / ANTI-ATLAS" },
    intro: { fr: "Une chaîne complète d’exploration, du ciblage régional au modèle 3D du gisement.", en: "A complete exploration chain, from regional targeting to a 3D deposit model." },
    context: { fr: "Les permis miniers marocains se caractérisent par une forte hétérogénéité structurale et des couvertures superficielles épaisses. Décider d’un programme de sondages sans imagerie géophysique préalable expose à un coût de forage non maîtrisé et à une faible probabilité de découverte.", en: "Moroccan mining permits show strong structural heterogeneity and thick surface cover. Committing to a drilling programme without prior geophysical imaging exposes operators to uncontrolled drilling costs and low discovery odds." },
    approach: { fr: "Nous articulons trois échelles : ciblage régional par télédétection et données aéroportées, levés au sol sur cibles prioritaires, puis vérification terrain et géochimie. Chaque étape produit un livrable décisionnel autonome, permettant d’arrêter ou de poursuivre le programme.", en: "We work at three scales: regional targeting from remote sensing and airborne data, ground surveys on priority targets, then field verification and geochemistry. Each step yields a stand-alone decision deliverable, so the programme can be stopped or continued." },
    methods: [
      { number: "01", name: { fr: "Cadrage & compilation", en: "Scoping & compilation" }, description: { fr: "Revue documentaire, cartes existantes, données publiques.", en: "Literature review, existing maps, public datasets." } },
      { number: "02", name: { fr: "Ciblage régional", en: "Regional targeting" }, description: { fr: "Traitement satellite, aéromagnétisme, analyse structurale.", en: "Satellite processing, aeromagnetics, structural analysis." } },
      { number: "03", name: { fr: "Levés au sol", en: "Ground surveys" }, description: { fr: "Profils géophysiques et échantillonnage géochimique.", en: "Geophysical profiles and geochemical sampling." } },
      { number: "04", name: { fr: "Interprétation", en: "Interpretation" }, description: { fr: "Inversion, corrélation multi-méthodes, modèle 3D.", en: "Inversion, multi-method correlation, 3D model." } },
      { number: "05", name: { fr: "Rapport & recommandations", en: "Report & recommendations" }, description: { fr: "Cibles hiérarchisées et plan de sondages.", en: "Ranked targets and drilling plan." } },
    ],
    technologies: [
      { fr: "Magnétomètre GSM-19 / drone", en: "GSM-19 magnetometer / drone" },
      { fr: "Gravimètre Scintrex CG-6", en: "Scintrex CG-6 gravimeter" },
      { fr: "IP / résistivité multi-électrodes", en: "Multi-electrode IP / resistivity" },
      { fr: "Imagerie Sentinel-2 & ASTER", en: "Sentinel-2 & ASTER imagery" },
      { fr: "Oasis montaj · QGIS · Leapfrog", en: "Oasis montaj · QGIS · Leapfrog" },
    ],
    deliverables: [
      { fr: "Cartes géophysiques géoréférencées", en: "Georeferenced geophysical maps" },
      { fr: "Modèle structural 3D", en: "3D structural model" },
      { fr: "Base de données géochimique", en: "Geochemical database" },
      { fr: "Rapport d’interprétation", en: "Interpretation report" },
      { fr: "Plan de sondages hiérarchisé", en: "Ranked drilling plan" },
    ],
    audience: [
      { fr: "Opérateurs miniers", en: "Mining operators" },
      { fr: "Juniors d’exploration", en: "Exploration juniors" },
      { fr: "Investisseurs", en: "Investors" },
      { fr: "ONHYM / institutions", en: "ONHYM / institutions" },
    ],
  },
  env: {
    imageLabel: { fr: "IMAGE — RELEVÉ ENVIRONNEMENTAL", en: "IMAGE — ENVIRONMENTAL SURVEY" },
    intro: { fr: "Des dossiers instruits pour passer la validation administrative et tenir dans la durée.", en: "Dossiers built to clear administrative review and hold up over time." },
    context: { fr: "L’acceptabilité d’un projet dépend autant de la qualité de l’état initial que de la crédibilité des mesures proposées. Un dossier incomplet se traduit par des allers-retours administratifs coûteux et un calendrier projet dégradé.", en: "Project acceptability depends as much on baseline quality as on the credibility of proposed measures. An incomplete dossier means costly administrative back-and-forth and a degraded project schedule." },
    approach: { fr: "Nous construisons l’état initial sur des mesures propres — qualité des eaux, air, bruit, biodiversité — et non sur des données bibliographiques. Les mesures d’atténuation sont chiffrées, localisées et assorties d’indicateurs de suivi vérifiables.", en: "We build the baseline on our own measurements — water quality, air, noise, biodiversity — not on literature data. Mitigation measures are costed, located and paired with verifiable monitoring indicators." },
    methods: [
      { number: "01", name: { fr: "Cadrage réglementaire", en: "Regulatory scoping" }, description: { fr: "Périmètre, procédure, parties prenantes.", en: "Scope, procedure, stakeholders." } },
      { number: "02", name: { fr: "État initial", en: "Baseline" }, description: { fr: "Campagnes de mesures et inventaires.", en: "Measurement campaigns and inventories." } },
      { number: "03", name: { fr: "Analyse des impacts", en: "Impact analysis" }, description: { fr: "Matrices, scénarios, sensibilité.", en: "Matrices, scenarios, sensitivity." } },
      { number: "04", name: { fr: "Mesures & PGES", en: "Measures & ESMP" }, description: { fr: "Atténuation chiffrée et calendrier.", en: "Costed mitigation and schedule." } },
      { number: "05", name: { fr: "Instruction & suivi", en: "Review & monitoring" }, description: { fr: "Accompagnement jusqu’à l’acceptabilité.", en: "Support through to acceptability." } },
    ],
    technologies: [
      { fr: "Sondes multiparamètres eau", en: "Multi-parameter water probes" },
      { fr: "Sonomètres classe 1", en: "Class 1 sound level meters" },
      { fr: "Stations qualité de l’air", en: "Air quality stations" },
      { fr: "Inventaires faune / flore", en: "Fauna / flora surveys" },
      { fr: "QGIS · modélisation dispersion", en: "QGIS · dispersion modelling" },
    ],
    deliverables: [
      { fr: "Rapport d’état initial", en: "Baseline report" },
      { fr: "Étude d’impact complète", en: "Full impact assessment" },
      { fr: "PGES et plan de suivi", en: "ESMP and monitoring plan" },
      { fr: "Cartographie des sensibilités", en: "Sensitivity mapping" },
      { fr: "Notes de réponse à l’administration", en: "Response notes to authorities" },
    ],
    audience: [
      { fr: "Industriels", en: "Industrial operators" },
      { fr: "Collectivités", en: "Local authorities" },
      { fr: "Promoteurs d’énergies renouvelables", en: "Renewable developers" },
      { fr: "Bailleurs & financeurs", en: "Lenders & financiers" },
    ],
  },
  water: {
    imageLabel: { fr: "IMAGE — FORAGE / NAPPE", en: "IMAGE — BOREHOLE / AQUIFER" },
    intro: { fr: "Sécuriser l’accès à l’eau dans un contexte de stress hydrique croissant.", en: "Securing water access under increasing water stress." },
    context: { fr: "La baisse des niveaux piézométriques dans plusieurs bassins marocains rend l’implantation empirique des forages économiquement risquée. Un forage sec représente une perte sèche et un retard sur le calendrier d’exploitation.", en: "Falling piezometric levels in several Moroccan basins make empirical borehole siting economically risky. A dry hole is a straight loss and a delay on the operating schedule." },
    approach: { fr: "Nous combinons analyse structurale, tomographie de résistivité électrique et données piézométriques historiques pour implanter les ouvrages sur des cibles justifiées, puis nous quantifions la ressource par essais de pompage avant tout engagement d’exploitation.", en: "We combine structural analysis, electrical resistivity tomography and historical piezometric data to site works on justified targets, then quantify the resource through pumping tests before any abstraction commitment." },
    methods: [
      { number: "01", name: { fr: "Étude documentaire", en: "Desk study" }, description: { fr: "Contexte hydrogéologique et forages voisins.", en: "Hydrogeological setting and nearby wells." } },
      { number: "02", name: { fr: "Reconnaissance géophysique", en: "Geophysical survey" }, description: { fr: "Profils ERT et sondages électriques.", en: "ERT profiles and electrical soundings." } },
      { number: "03", name: { fr: "Implantation", en: "Siting" }, description: { fr: "Positionnement et coupe prévisionnelle.", en: "Positioning and predicted log." } },
      { number: "04", name: { fr: "Suivi de forage", en: "Drilling supervision" }, description: { fr: "Log lithologique et développement.", en: "Lithological log and development." } },
      { number: "05", name: { fr: "Essais & bilan", en: "Tests & balance" }, description: { fr: "Débit exploitable et qualité de l’eau.", en: "Sustainable yield and water quality." } },
    ],
    technologies: [
      { fr: "ERT multi-électrodes 48/72", en: "48/72-electrode ERT" },
      { fr: "Sondages électriques verticaux", en: "Vertical electrical soundings" },
      { fr: "Sondes piézométriques enregistreuses", en: "Recording piezometers" },
      { fr: "Analyses physico-chimiques", en: "Physicochemical analyses" },
      { fr: "MODFLOW · QGIS", en: "MODFLOW · QGIS" },
    ],
    deliverables: [
      { fr: "Rapport de prospection", en: "Prospecting report" },
      { fr: "Coupe et implantation validées", en: "Validated log and siting" },
      { fr: "Résultats d’essais de pompage", en: "Pumping test results" },
      { fr: "Bilan de ressource et débit conseillé", en: "Resource balance and advised yield" },
      { fr: "Recommandations d’exploitation", en: "Abstraction recommendations" },
    ],
    audience: [
      { fr: "Agriculteurs & agrégateurs", en: "Farmers & agri-aggregators" },
      { fr: "Communes rurales", en: "Rural municipalities" },
      { fr: "Industriels", en: "Industrial operators" },
      { fr: "ABH & institutions", en: "Basin agencies & institutions" },
    ],
  },
};
