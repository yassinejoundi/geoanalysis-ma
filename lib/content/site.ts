import type { LocalizedText } from "@/lib/i18n";

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
}

export const expertises: Expertise[] = [
  {
    id: "mining", slug: "exploration-miniere", number: "01",
    name: { fr: "Exploration minière", en: "Mineral exploration" },
    summary: { fr: "Levés géophysiques, cartographie structurale et géochimie pour cibler, hiérarchiser et sécuriser les projets miniers.", en: "Geophysical surveys, structural mapping and geochemistry to target, rank and de-risk mining projects." },
    subServices: [
      { name: { fr: "Levés géophysiques", en: "Geophysical surveys" }, summary: { fr: "Magnétisme, gravimétrie, IP/résistivité", en: "Magnetics, gravity, IP/resistivity" } },
      { name: { fr: "Cartographie structurale", en: "Structural mapping" }, summary: { fr: "Terrain, télédétection, SIG", en: "Field, remote sensing, GIS" } },
      { name: { fr: "Géochimie", en: "Geochemistry" }, summary: { fr: "Sols, roches, sédiments", en: "Soils, rock, sediments" } },
      { name: { fr: "Modélisation 3D", en: "3D modelling" }, summary: { fr: "Corps minéralisés & ressources", en: "Ore bodies & resources" } },
    ],
  },
  {
    id: "env", slug: "etudes-impact", number: "02",
    name: { fr: "Études d’impact environnemental", en: "Environmental impact studies" },
    summary: { fr: "EIE réglementaires, états initiaux, suivi et plans de gestion conformes au cadre marocain.", en: "Regulatory EIA, baseline studies, monitoring and management plans compliant with Moroccan law." },
    subServices: [
      { name: { fr: "État initial", en: "Baseline study" }, summary: { fr: "Milieux physique, biologique, humain", en: "Physical, biological, human settings" } },
      { name: { fr: "EIE réglementaire", en: "Regulatory EIA" }, summary: { fr: "Loi 12-03 & décrets", en: "Law 12-03 & decrees" } },
      { name: { fr: "Plans de gestion", en: "Management plans" }, summary: { fr: "PGES, suivi, indicateurs", en: "ESMP, monitoring, indicators" } },
      { name: { fr: "Audit & conformité", en: "Audit & compliance" }, summary: { fr: "Sites en exploitation", en: "Operating sites" } },
    ],
  },
  {
    id: "water", slug: "ressources-en-eau", number: "03",
    name: { fr: "Ressources en eau", en: "Water resources" },
    summary: { fr: "Prospection hydrogéologique, implantation de forages et gestion durable des aquifères.", en: "Hydrogeological prospecting, borehole siting and sustainable aquifer management." },
    subServices: [
      { name: { fr: "Prospection hydrogéologique", en: "Hydrogeological prospecting" }, summary: { fr: "Géophysique électrique, ERT", en: "Electrical geophysics, ERT" } },
      { name: { fr: "Implantation de forages", en: "Borehole siting" }, summary: { fr: "Ciblage et supervision", en: "Targeting and supervision" } },
      { name: { fr: "Essais de pompage", en: "Pumping tests" }, summary: { fr: "Paramètres hydrodynamiques", en: "Hydrodynamic parameters" } },
      { name: { fr: "Modélisation d’aquifère", en: "Aquifer modelling" }, summary: { fr: "Bilans et scénarios d’exploitation", en: "Balances and abstraction scenarios" } },
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

export const news: EditorialEntry[] = [
  { id: "n1", slug: "campagne-geophysique-anti-atlas", category: { fr: "Mission", en: "Assignment" }, date: "12.06.2026", title: { fr: "Nouvelle campagne géophysique dans l’Anti-Atlas occidental", en: "New geophysical campaign in the western Anti-Atlas" }, teaser: { fr: "Deux équipes mobilisées sur six semaines de levés magnétiques et IP.", en: "Two teams mobilised for six weeks of magnetic and IP surveying." } },
  { id: "n2", slug: "nouveau-gravimetre-cg-6", category: { fr: "Équipement", en: "Equipment" }, date: "28.05.2026", title: { fr: "Le bureau s’équipe d’un gravimètre CG-6", en: "The firm adds a CG-6 gravimeter" }, teaser: { fr: "Extension du parc instrumental pour les levés de détail.", en: "Instrument fleet extended for detailed surveys." } },
  { id: "n3", slug: "convention-recherche-universite", category: { fr: "Partenariat", en: "Partnership" }, date: "14.05.2026", title: { fr: "Convention de recherche avec une université marocaine", en: "Research agreement with a Moroccan university" }, teaser: { fr: "Encadrement conjoint de travaux sur les aquifères fracturés.", en: "Joint supervision of work on fractured aquifers." } },
  { id: "n4", slug: "salon-mines-marrakech", category: { fr: "Colloque", en: "Conference" }, date: "02.04.2026", title: { fr: "GEOANALYSIS au salon des mines de Marrakech", en: "GEOANALYSIS at the Marrakech mining show" }, teaser: { fr: "Présentation de nos chaînes de traitement multi-méthodes.", en: "Presenting our multi-method processing chains." } },
  { id: "n5", slug: "deux-geophysiciens-rejoignent-equipe", category: { fr: "Équipe", en: "Team" }, date: "19.03.2026", title: { fr: "Deux géophysiciens rejoignent le pôle acquisition", en: "Two geophysicists join the acquisition unit" }, teaser: { fr: "Renforcement des capacités de terrain pour 2026.", en: "Field capacity strengthened for 2026." } },
  { id: "n6", slug: "procedures-qualite-laboratoire", category: { fr: "Certification", en: "Certification" }, date: "05.02.2026", title: { fr: "Mise à jour de nos procédures qualité laboratoire", en: "Laboratory quality procedures updated" }, teaser: { fr: "Alignement sur les référentiels internationaux d’analyse.", en: "Aligned with international analytical standards." } },
];

export const articles: EditorialEntry[] = [
  { id: "a1", slug: "choisir-methode-geophysique", category: { fr: "Géophysique", en: "Geophysics" }, date: "20.06.2026", readingTime: "8 min", title: { fr: "Choisir sa méthode géophysique selon le contexte géologique", en: "Choosing a geophysical method for your geological setting" }, teaser: { fr: "Magnétisme, gravimétrie, IP, ERT : critères de sélection et limites d’interprétation.", en: "Magnetics, gravity, IP, ERT: selection criteria and interpretation limits." } },
  { id: "a2", slug: "forage-sec-etude-prealable", category: { fr: "Hydrogéologie", en: "Hydrogeology" }, date: "08.06.2026", readingTime: "6 min", title: { fr: "Pourquoi un forage sec coûte plus cher qu’une étude préalable", en: "Why a dry hole costs more than a preliminary study" }, teaser: { fr: "Analyse coût-bénéfice de la prospection ERT avant implantation.", en: "Cost-benefit analysis of ERT prospecting before siting." } },
  { id: "a3", slug: "erreurs-etat-initial-eie", category: { fr: "Environnement", en: "Environment" }, date: "22.05.2026", readingTime: "10 min", title: { fr: "État initial : les cinq erreurs qui bloquent une EIE", en: "Baseline studies: five mistakes that stall an EIA" }, teaser: { fr: "Retour d’expérience sur les dossiers instruits ces trois dernières années.", en: "Lessons learned from dossiers reviewed over the past three years." } },
  { id: "a4", slug: "structures-anti-atlas-teledetection", category: { fr: "Géologie", en: "Geology" }, date: "30.04.2026", readingTime: "12 min", title: { fr: "Lire les structures de l’Anti-Atlas en télédétection", en: "Reading Anti-Atlas structures through remote sensing" }, teaser: { fr: "Traitement Sentinel-2 et ASTER appliqué au ciblage minier.", en: "Sentinel-2 and ASTER processing applied to mineral targeting." } },
  { id: "a5", slug: "base-donnees-geoscientifique-auditable", category: { fr: "Données", en: "Data" }, date: "11.04.2026", readingTime: "7 min", title: { fr: "Construire une base de données géoscientifique auditable", en: "Building an auditable geoscientific database" }, teaser: { fr: "Structuration, contrôle qualité et traçabilité des campagnes.", en: "Structure, QA/QC and traceability across campaigns." } },
  { id: "a6", slug: "reglementation-miniere-environnementale-maroc", category: { fr: "Réglementation", en: "Regulation" }, date: "26.03.2026", readingTime: "9 min", title: { fr: "Cadre réglementaire minier et environnemental au Maroc", en: "Mining and environmental regulation in Morocco" }, teaser: { fr: "Panorama des textes applicables et des procédures d’instruction.", en: "Overview of applicable texts and review procedures." } },
];

export const methodGroups = [
  { id: "01", title: { fr: "Acquisition géophysique", en: "Geophysical acquisition" }, items: ["Magnétométrie", "Gravimétrie", "IP / résistivité", "Sismique légère"] },
  { id: "02", title: { fr: "Géospatial & télédétection", en: "Geospatial & remote sensing" }, items: ["Sentinel-2 / ASTER", "Photogrammétrie drone", "SIG", "GNSS différentiel"] },
  { id: "03", title: { fr: "Traitement, modélisation & laboratoire", en: "Processing, modelling & laboratory" }, items: ["Inversion 2D/3D", "Modélisation géologique", "Hydrodynamique", "Analyses"] },
];
