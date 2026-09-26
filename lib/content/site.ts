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

export const projects: Project[] = [
  { id: "p1", slug: "leve-magnetique-ip-permis-cuprifere", expertiseId: "mining", domain: { fr: "Exploration minière", en: "Mineral exploration" }, location: "Anti-Atlas, Tata", title: { fr: "Levé magnétique et IP sur permis cuprifère", en: "Magnetic and IP survey on a copper permit" }, teaser: { fr: "420 km de profils et 6 cibles hiérarchisées avant campagne de sondages.", en: "420 km of profiles and 6 ranked targets ahead of drilling." } },
  { id: "p2", slug: "eie-parc-solaire-120-mw", expertiseId: "env", domain: { fr: "Environnement", en: "Environment" }, location: "Essaouira", title: { fr: "EIE d’un parc solaire de 120 MW", en: "EIA for a 120 MW solar plant" }, teaser: { fr: "État initial complet, PGES et accompagnement jusqu’à l’acceptabilité.", en: "Full baseline, ESMP and support through to acceptability." } },
  { id: "p3", slug: "implantation-14-forages-agricoles", expertiseId: "water", domain: { fr: "Ressources en eau", en: "Water resources" }, location: "Haouz, Marrakech", title: { fr: "Implantation de 14 forages agricoles", en: "Siting of 14 agricultural boreholes" }, teaser: { fr: "Prospection ERT et suivi de forage sur un périmètre irrigué de 900 ha.", en: "ERT prospecting and drilling supervision across a 900 ha irrigated perimeter." } },
  { id: "p4", slug: "modelisation-3d-corps-cobaltifere", expertiseId: "mining", domain: { fr: "Exploration minière", en: "Mineral exploration" }, location: "Bou Azzer", title: { fr: "Modélisation 3D d’un corps cobaltifère", en: "3D modelling of a cobalt-bearing body" }, teaser: { fr: "Reprise de 40 ans de données historiques en modèle géologique unifié.", en: "Forty years of legacy data consolidated into one geological model." } },
  { id: "p5", slug: "audit-conformite-site-industriel", expertiseId: "env", domain: { fr: "Environnement", en: "Environment" }, location: "Khouribga", title: { fr: "Audit de conformité d’un site industriel", en: "Compliance audit of an industrial site" }, teaser: { fr: "Diagnostic des écarts réglementaires et plan de mise en conformité en 18 mois.", en: "Regulatory gap diagnosis and an 18-month compliance roadmap." } },
  { id: "p6", slug: "modelisation-aquifere-cotier", expertiseId: "water", domain: { fr: "Ressources en eau", en: "Water resources" }, location: "Souss-Massa", title: { fr: "Bilan et modélisation d’un aquifère côtier", en: "Balance and modelling of a coastal aquifer" }, teaser: { fr: "Scénarios d’exploitation face au risque d’intrusion salée.", en: "Abstraction scenarios against saline intrusion risk." } },
];

export const news: EditorialDetailEntry[] = [
  {
    id: "n1", slug: "campagne-geophysique-anti-atlas", category: { fr: "Mission", en: "Assignment" }, date: "12.06.2026", title: { fr: "Nouvelle campagne géophysique dans l’Anti-Atlas occidental", en: "New geophysical campaign in the western Anti-Atlas" }, teaser: { fr: "Deux équipes mobilisées sur six semaines de levés magnétiques et IP.", en: "Two teams mobilised for six weeks of magnetic and IP surveying." }, imageLabel: "IMAGE — ACTUALITÉ 01",
    body: {
      fr: ["Deux équipes du pôle acquisition sont mobilisées pour six semaines sur un permis de l’Anti-Atlas occidental. Le programme associe un levé magnétique drone à maille serrée et douze lignes de polarisation provoquée.", "Les premiers résultats de traitement seront restitués au commanditaire sous forme de cartes géoréférencées et de cibles hiérarchisées, en amont de la campagne de sondages prévue à l’automne."],
      en: ["Two acquisition teams are mobilised for six weeks on a permit in the western Anti-Atlas. The programme combines a tight-grid drone magnetic survey with twelve induced-polarisation lines.", "First processing results will be delivered as georeferenced maps and ranked targets, ahead of the drilling campaign planned for the autumn."],
    },
  },
  {
    id: "n2", slug: "nouveau-gravimetre-cg-6", category: { fr: "Équipement", en: "Equipment" }, date: "28.05.2026", title: { fr: "Le bureau s’équipe d’un gravimètre CG-6", en: "The firm adds a CG-6 gravimeter" }, teaser: { fr: "Extension du parc instrumental pour les levés de détail.", en: "Instrument fleet extended for detailed surveys." }, imageLabel: "IMAGE — ACTUALITÉ 02",
    body: {
      fr: ["Le bureau complète son parc instrumental avec un gravimètre Scintrex CG-6, destiné aux levés de détail sur cibles minières et aux études de subsurface en contexte urbain.", "L’appareil est intégré à nos chaînes de traitement internes, avec corrections topographiques complètes et contrôle qualité systématique des boucles de mesure."],
      en: ["The firm extends its instrument fleet with a Scintrex CG-6 gravimeter for detailed surveys on mining targets and subsurface studies in urban settings.", "The instrument is integrated into our in-house processing chains, with full terrain corrections and systematic quality control of measurement loops."],
    },
  },
  {
    id: "n3", slug: "convention-recherche-universite", category: { fr: "Partenariat", en: "Partnership" }, date: "14.05.2026", title: { fr: "Convention de recherche avec une université marocaine", en: "Research agreement with a Moroccan university" }, teaser: { fr: "Encadrement conjoint de travaux sur les aquifères fracturés.", en: "Joint supervision of work on fractured aquifers." }, imageLabel: "IMAGE — ACTUALITÉ 03",
    body: {
      fr: ["Une convention de recherche a été signée avec un laboratoire universitaire marocain autour du comportement hydrodynamique des aquifères fracturés.", "Le partenariat prévoit l’encadrement conjoint de travaux de doctorat, l’accès partagé aux données de terrain anonymisées et deux campagnes de mesures annuelles."],
      en: ["A research agreement has been signed with a Moroccan university laboratory on the hydrodynamic behaviour of fractured aquifers.", "The partnership covers joint supervision of doctoral work, shared access to anonymised field data and two measurement campaigns per year."],
    },
  },
  {
    id: "n4", slug: "salon-mines-marrakech", category: { fr: "Colloque", en: "Conference" }, date: "02.04.2026", title: { fr: "GEOANALYSIS au salon des mines de Marrakech", en: "GEOANALYSIS at the Marrakech mining show" }, teaser: { fr: "Présentation de nos chaînes de traitement multi-méthodes.", en: "Presenting our multi-method processing chains." }, imageLabel: "IMAGE — ACTUALITÉ 04",
    body: {
      fr: ["GEOANALYSIS était présent au salon des mines de Marrakech, avec une présentation consacrée à nos chaînes de traitement multi-méthodes.", "L’intervention détaillait la corrélation entre données magnétiques, IP et géochimie de sols sur trois cas de permis en contexte de couverture épaisse."],
      en: ["GEOANALYSIS attended the Marrakech mining show with a talk on our multi-method processing chains.", "The presentation detailed the correlation of magnetic, IP and soil geochemistry data across three permit cases under thick cover."],
    },
  },
  {
    id: "n5", slug: "deux-geophysiciens-rejoignent-equipe", category: { fr: "Équipe", en: "Team" }, date: "19.03.2026", title: { fr: "Deux géophysiciens rejoignent le pôle acquisition", en: "Two geophysicists join the acquisition unit" }, teaser: { fr: "Renforcement des capacités de terrain pour 2026.", en: "Field capacity strengthened for 2026." }, imageLabel: "IMAGE — ACTUALITÉ 05",
    body: {
      fr: ["Deux géophysiciens ont rejoint le pôle acquisition, portant l’équipe technique à quatorze géoscientifiques et ingénieurs.", "Ce renforcement permet de conduire deux campagnes de terrain simultanées sans dégradation des délais de restitution."],
      en: ["Two geophysicists have joined the acquisition unit, bringing the technical team to fourteen geoscientists and engineers.", "This strengthening allows two simultaneous field campaigns without extending reporting timelines."],
    },
  },
  {
    id: "n6", slug: "procedures-qualite-laboratoire", category: { fr: "Certification", en: "Certification" }, date: "05.02.2026", title: { fr: "Mise à jour de nos procédures qualité laboratoire", en: "Laboratory quality procedures updated" }, teaser: { fr: "Alignement sur les référentiels internationaux d’analyse.", en: "Aligned with international analytical standards." }, imageLabel: "IMAGE — ACTUALITÉ 06",
    body: {
      fr: ["Nos procédures qualité laboratoire ont été révisées afin d’aligner les protocoles d’analyse sur les référentiels internationaux.", "La révision porte sur la traçabilité des échantillons, la fréquence des duplicatas et l’archivage des données brutes."],
      en: ["Our laboratory quality procedures have been revised to align analytical protocols with international standards.", "The revision covers sample traceability, duplicate frequency and raw data archiving."],
    },
  },
];

export const articles: EditorialDetailEntry[] = [
  {
    id: "a1", slug: "choisir-methode-geophysique", category: { fr: "Géophysique", en: "Geophysics" }, date: "20.06.2026", readingTime: "8 min", title: { fr: "Choisir sa méthode géophysique selon le contexte géologique", en: "Choosing a geophysical method for your geological setting" }, teaser: { fr: "Magnétisme, gravimétrie, IP, ERT : critères de sélection et limites d’interprétation.", en: "Magnetics, gravity, IP, ERT: selection criteria and interpretation limits." }, imageLabel: "IMAGE — ARTICLE 01",
    body: {
      fr: ["Aucune méthode géophysique ne répond seule à toutes les questions. Le choix se construit à partir du contraste physique attendu, de la profondeur de la cible et de l’épaisseur de la couverture.", "En pratique, une combinaison de deux méthodes indépendantes réduit fortement l’ambiguïté d’interprétation. La magnétométrie cadre les structures, l’IP renseigne sur la minéralisation, l’ERT sur la teneur en eau.", "Nous documentons systématiquement les limites de résolution de chaque levé afin que la décision de forage soit prise en connaissance de l’incertitude."],
      en: ["No single geophysical method answers every question. The choice follows from the expected physical contrast, target depth and cover thickness.", "In practice, combining two independent methods sharply reduces interpretation ambiguity. Magnetics frames the structures, IP informs on mineralisation, ERT on water content.", "We systematically document the resolution limits of each survey so drilling decisions are made with the uncertainty in view."],
    },
  },
  {
    id: "a2", slug: "forage-sec-etude-prealable", category: { fr: "Hydrogéologie", en: "Hydrogeology" }, date: "08.06.2026", readingTime: "6 min", title: { fr: "Pourquoi un forage sec coûte plus cher qu’une étude préalable", en: "Why a dry hole costs more than a preliminary study" }, teaser: { fr: "Analyse coût-bénéfice de la prospection ERT avant implantation.", en: "Cost-benefit analysis of ERT prospecting before siting." }, imageLabel: "IMAGE — ARTICLE 02",
    body: {
      fr: ["Un forage sec représente une perte sèche : coût de mobilisation, mètres forés, équipement, et surtout retard sur le calendrier d’exploitation.", "La prospection ERT préalable représente une fraction du coût d’un ouvrage. Sur nos programmes récents, le taux de forages productifs dépasse 90 %.", "L’économie ne vient pas seulement du forage évité, mais du positionnement optimisé qui améliore le débit exploitable à long terme."],
      en: ["A dry hole is a straight loss: mobilisation cost, drilled metres, equipment, and above all a delay to the operating schedule.", "Prior ERT prospecting costs a fraction of a single borehole. Across our recent programmes, the productive-hole rate exceeds 90%.", "The saving comes not only from the avoided hole, but from optimised siting that improves long-term sustainable yield."],
    },
  },
  {
    id: "a3", slug: "erreurs-etat-initial-eie", category: { fr: "Environnement", en: "Environment" }, date: "22.05.2026", readingTime: "10 min", title: { fr: "État initial : les cinq erreurs qui bloquent une EIE", en: "Baseline studies: five mistakes that stall an EIA" }, teaser: { fr: "Retour d’expérience sur les dossiers instruits ces trois dernières années.", en: "Lessons learned from dossiers reviewed over the past three years." }, imageLabel: "IMAGE — ARTICLE 03",
    body: {
      fr: ["La majorité des dossiers renvoyés par l’administration le sont pour des motifs prévisibles : état initial appuyé sur la bibliographie, périmètre d’étude trop restreint, mesures d’atténuation non chiffrées.", "S’y ajoutent l’absence d’indicateurs de suivi vérifiables et une concertation menée trop tard dans le processus.", "Un état initial construit sur des mesures propres, réparties sur plusieurs saisons, reste le meilleur investissement pour tenir le calendrier d’instruction."],
      en: ["Most dossiers returned by the authorities fail for predictable reasons: a baseline built on literature, an over-narrow study area, uncosted mitigation measures.", "Add to these the absence of verifiable monitoring indicators and consultation started too late in the process.", "A baseline built on your own measurements, spread across several seasons, remains the best investment for holding the review schedule."],
    },
  },
  {
    id: "a4", slug: "structures-anti-atlas-teledetection", category: { fr: "Géologie", en: "Geology" }, date: "30.04.2026", readingTime: "12 min", title: { fr: "Lire les structures de l’Anti-Atlas en télédétection", en: "Reading Anti-Atlas structures through remote sensing" }, teaser: { fr: "Traitement Sentinel-2 et ASTER appliqué au ciblage minier.", en: "Sentinel-2 and ASTER processing applied to mineral targeting." }, imageLabel: "IMAGE — ARTICLE 04",
    body: {
      fr: ["Les compositions colorées Sentinel-2 et les rapports de bandes ASTER permettent de cartographier les zones d’altération avant toute sortie de terrain.", "Le traitement doit être calibré sur des affleurements connus : un indice d’altération non vérifié produit autant de fausses cibles que d’indices utiles.", "Nous couplons systématiquement l’analyse spectrale à la lecture structurale des linéaments pour hiérarchiser les secteurs à visiter."],
      en: ["Sentinel-2 colour composites and ASTER band ratios map alteration zones before any field visit.", "Processing must be calibrated on known outcrops: an unverified alteration index produces as many false targets as useful leads.", "We systematically pair spectral analysis with structural lineament reading to rank the areas worth visiting."],
    },
  },
  {
    id: "a5", slug: "base-donnees-geoscientifique-auditable", category: { fr: "Données", en: "Data" }, date: "11.04.2026", readingTime: "7 min", title: { fr: "Construire une base de données géoscientifique auditable", en: "Building an auditable geoscientific database" }, teaser: { fr: "Structuration, contrôle qualité et traçabilité des campagnes.", en: "Structure, QA/QC and traceability across campaigns." }, imageLabel: "IMAGE — ARTICLE 05",
    body: {
      fr: ["Une base de données géoscientifique n’a de valeur que si un tiers peut refaire le chemin entre la mesure brute et la conclusion.", "Cela impose une structuration stricte : identifiants uniques d’échantillons, versions de traitement, métadonnées de calibration et journal des corrections.", "L’auditabilité devient déterminante dès qu’un projet entre en phase de financement ou de reporting normalisé."],
      en: ["A geoscientific database only has value if a third party can retrace the path from raw measurement to conclusion.", "That demands strict structure: unique sample identifiers, processing versions, calibration metadata and a correction log.", "Auditability becomes decisive as soon as a project enters financing or standardised reporting."],
    },
  },
  {
    id: "a6", slug: "reglementation-miniere-environnementale-maroc", category: { fr: "Réglementation", en: "Regulation" }, date: "26.03.2026", readingTime: "9 min", title: { fr: "Cadre réglementaire minier et environnemental au Maroc", en: "Mining and environmental regulation in Morocco" }, teaser: { fr: "Panorama des textes applicables et des procédures d’instruction.", en: "Overview of applicable texts and review procedures." }, imageLabel: "IMAGE — ARTICLE 06",
    body: {
      fr: ["Le cadre marocain articule le code minier, la loi sur l’eau et la loi 12-03 relative aux études d’impact sur l’environnement.", "Chaque procédure a ses délais, ses pièces et son instance d’instruction : anticiper cette séquence évite des reprises coûteuses de dossier.", "Nous intégrons le calendrier réglementaire dès le cadrage technique, afin que les campagnes de terrain produisent directement les pièces attendues."],
      en: ["The Moroccan framework combines the mining code, the water law and Law 12-03 on environmental impact assessment.", "Each procedure has its own timelines, documents and reviewing body: anticipating the sequence avoids costly dossier rework.", "We build the regulatory calendar into technical scoping, so field campaigns directly produce the expected documents."],
    },
  },
];

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
