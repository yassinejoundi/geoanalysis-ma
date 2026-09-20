import type { LocalizedText } from "@/lib/i18n";

// CMS changes remain in-memory prototype behavior until backend work is approved.
export const cmsDataNotice = "Demo data resets when the page refreshes.";

export type PublicationState = "published" | "draft";
export type MessageStatus = "new" | "contacted" | "talking" | "quoted" | "won" | "lost";
export type AdminMessage = {
  id: string;
  status: MessageStatus;
  name: string;
  company: string;
  date: string;
  type: LocalizedText;
  file: string;
  message: string;
};

export type AdminSubService = {
  id: string;
  state: PublicationState;
  name: LocalizedText;
  short: LocalizedText;
};

export type AdminExpertise = {
  id: string;
  state: PublicationState;
  slug: string;
  name: LocalizedText;
  short: LocalizedText;
  subServices: AdminSubService[];
};

export const adminExpertises: AdminExpertise[] = [
  { id: "s1", state: "published", slug: "exploration-miniere", name: { fr: "Exploration minière", en: "Mineral exploration" }, short: { fr: "Levés géophysiques, cartographie structurale et géochimie pour cibler et sécuriser les projets miniers.", en: "Geophysical surveys, structural mapping and geochemistry to target and de-risk mining projects." }, subServices: [
    { id: "s1a", state: "published", name: { fr: "Exploration géologique", en: "Geological exploration" }, short: { fr: "Cartographie de terrain et analyse structurale.", en: "Field mapping and structural analysis." } },
    { id: "s1b", state: "published", name: { fr: "Exploration géophysique", en: "Geophysical exploration" }, short: { fr: "Magnétisme, gravimétrie, IP et résistivité.", en: "Magnetics, gravity, IP and resistivity." } },
    { id: "s1c", state: "draft", name: { fr: "Télédétection & SIG", en: "Remote sensing & GIS" }, short: { fr: "Traitement satellite et bases géospatiales.", en: "Satellite processing and geospatial databases." } },
  ] },
  { id: "s2", state: "published", slug: "etudes-impact", name: { fr: "Études d’impact environnemental", en: "Environmental impact studies" }, short: { fr: "EIE réglementaires, états initiaux et plans de gestion conformes au cadre marocain.", en: "Regulatory EIA, baseline studies and management plans compliant with Moroccan law." }, subServices: [
    { id: "s2a", state: "published", name: { fr: "État initial", en: "Baseline study" }, short: { fr: "Milieux physique, biologique et humain.", en: "Physical, biological and human settings." } },
    { id: "s2b", state: "published", name: { fr: "EIE réglementaire", en: "Regulatory EIA" }, short: { fr: "Dossier complet loi 12-03.", en: "Full Law 12-03 dossier." } },
    { id: "s2c", state: "published", name: { fr: "PGES & suivi", en: "ESMP & monitoring" }, short: { fr: "Mesures chiffrées et indicateurs.", en: "Costed measures and indicators." } },
  ] },
  { id: "s3", state: "published", slug: "ressources-en-eau", name: { fr: "Ressources en eau", en: "Water resources" }, short: { fr: "Prospection hydrogéologique, implantation de forages et gestion durable des aquifères.", en: "Hydrogeological prospecting, borehole siting and sustainable aquifer management." }, subServices: [
    { id: "s3a", state: "published", name: { fr: "Prospection hydrogéologique", en: "Hydrogeological prospecting" }, short: { fr: "ERT et sondages électriques.", en: "ERT and electrical soundings." } },
    { id: "s3b", state: "published", name: { fr: "Implantation de forages", en: "Borehole siting" }, short: { fr: "Ciblage et supervision de forage.", en: "Targeting and drilling supervision." } },
    { id: "s3c", state: "draft", name: { fr: "Modélisation d’aquifère", en: "Aquifer modelling" }, short: { fr: "Bilans et scénarios d’exploitation.", en: "Balances and abstraction scenarios." } },
  ] },
];

type AdminProjectRow = [string, string, string, string, string, number, LocalizedText, PublicationState];

export const adminProjects = ([
  ["p1", "s1", "s1b", "Anti-Atlas, Tata", "12.06.2026", 5, { fr: "Levé magnétique et IP sur permis cuprifère", en: "Magnetic and IP survey on a copper permit" }, "published"],
  ["p2", "s2", "s2b", "Essaouira", "28.05.2026", 8, { fr: "EIE d’un parc solaire de 120 MW", en: "EIA for a 120 MW solar plant" }, "published"],
  ["p3", "s3", "s3b", "Haouz, Marrakech", "14.05.2026", 6, { fr: "Implantation de 14 forages agricoles", en: "Siting of 14 agricultural boreholes" }, "published"],
  ["p4", "s1", "s1a", "Bou Azzer", "02.04.2026", 3, { fr: "Modélisation 3D d’un corps cobaltifère", en: "3D modelling of a cobalt-bearing body" }, "draft"],
  ["p5", "s2", "s2c", "Khouribga", "19.03.2026", 4, { fr: "Audit de conformité d’un site industriel", en: "Compliance audit of an industrial site" }, "published"],
] satisfies AdminProjectRow[]).map(([id, expertiseId, subServiceId, location, date, imageCount, title, state]) => ({ id, expertiseId, subServiceId, location, date, imageCount, title, state }));

export const adminArticles = [
  { id: "a1", state: "published" as PublicationState, category: { fr: "Géophysique", en: "Geophysics" }, tags: ["méthodes", "ciblage"], date: "20.06.2026", readingTime: "8 min", title: { fr: "Choisir sa méthode géophysique selon le contexte", en: "Choosing a geophysical method for your setting" } },
  { id: "a2", state: "published" as PublicationState, category: { fr: "Hydrogéologie", en: "Hydrogeology" }, tags: ["forage", "ERT"], date: "08.06.2026", readingTime: "6 min", title: { fr: "Pourquoi un forage sec coûte plus cher qu’une étude", en: "Why a dry hole costs more than a study" } },
  { id: "a3", state: "draft" as PublicationState, category: { fr: "Environnement", en: "Environment" }, tags: ["EIE", "réglementation"], date: "22.05.2026", readingTime: "10 min", title: { fr: "État initial : cinq erreurs qui bloquent une EIE", en: "Baselines: five mistakes that stall an EIA" } },
  { id: "a4", state: "published" as PublicationState, category: { fr: "Données", en: "Data" }, tags: ["SIG", "qualité"], date: "11.04.2026", readingTime: "7 min", title: { fr: "Construire une base de données géoscientifique auditable", en: "Building an auditable geoscientific database" } },
];

export const adminNews = [
  { id: "n1", state: "published" as PublicationState, category: { fr: "Mission", en: "Assignment" }, tags: ["terrain"], date: "12.06.2026", title: { fr: "Nouvelle campagne géophysique dans l’Anti-Atlas", en: "New geophysical campaign in the Anti-Atlas" } },
  { id: "n2", state: "published" as PublicationState, category: { fr: "Équipement", en: "Equipment" }, tags: ["gravimétrie"], date: "28.05.2026", title: { fr: "Le bureau s’équipe d’un gravimètre CG-6", en: "The firm adds a CG-6 gravimeter" } },
  { id: "n3", state: "published" as PublicationState, category: { fr: "Conférence", en: "Conference" }, tags: ["salon"], date: "02.04.2026", title: { fr: "GEOANALYSIS au salon des mines de Marrakech", en: "GEOANALYSIS at the Marrakech mining show" } },
  { id: "n4", state: "draft" as PublicationState, category: { fr: "Annonce", en: "Announcement" }, tags: ["équipe"], date: "19.03.2026", title: { fr: "Deux géophysiciens rejoignent le pôle acquisition", en: "Two geophysicists join the acquisition unit" } },
];

export const messageStatuses: { id: MessageStatus; label: LocalizedText }[] = [
  { id: "new", label: { fr: "Nouveau", en: "New" } }, { id: "contacted", label: { fr: "Qualifié", en: "Qualified" } },
  { id: "quoted", label: { fr: "Devis envoyé", en: "Quote sent" } }, { id: "talking", label: { fr: "En cours", en: "In progress" } },
  { id: "won", label: { fr: "Gagné", en: "Won" } }, { id: "lost", label: { fr: "Perdu", en: "Lost" } },
];

const demoMessageText = "Bonjour, nous souhaitons un cadrage méthodologique et budgétaire pour une campagne de reconnaissance sur notre permis.";
type AdminMessageRow = [string, MessageStatus, string, string, string, LocalizedText, string];

export const adminMessages: AdminMessage[] = ([
  ["m1", "new", "Karim Alaoui", "Managem Exploration", "27.07.2026", { fr: "Exploration minière", en: "Mineral exploration" }, "permis-tata.pdf"],
  ["m2", "new", "Sophie Rey", "Voltalia Maroc", "26.07.2026", { fr: "Étude d’impact", en: "Impact study" }, ""],
  ["m3", "contacted", "Commune de Tahannaout", "Collectivité", "24.07.2026", { fr: "Ressources en eau", en: "Water resources" }, "cahier-charges.pdf"],
  ["m4", "talking", "Youssef Bennani", "Domaine agricole Haouz", "21.07.2026", { fr: "Ressources en eau", en: "Water resources" }, ""],
  ["m5", "quoted", "Aya Cherkaoui", "OCP Innovation", "18.07.2026", { fr: "Étude d’impact", en: "Impact study" }, "plan-site.dwg"],
  ["m6", "won", "Hicham Idrissi", "Sahara Metals", "10.07.2026", { fr: "Exploration minière", en: "Mineral exploration" }, ""],
  ["m7", "lost", "Nadia Fassi", "Groupe Atlas BTP", "02.07.2026", { fr: "Autre", en: "Other" }, ""],
 ] satisfies AdminMessageRow[]).map(([id, status, name, company, date, type, file]) => ({
  id,
  status: status as MessageStatus,
  name,
  company,
  date,
  type: type as LocalizedText,
  file,
  message: demoMessageText,
}));

export const adminTeam = [
  { id: "t1", order: 1, name: "Dr. S. Benali", role: { fr: "Directeur · Géologue", en: "Director · Geologist" }, bio: { fr: "Vingt ans d’expérience en exploration minière et cartographie structurale au Maroc.", en: "Twenty years in mineral exploration and structural mapping in Morocco." } },
  { id: "t2", order: 2, name: "I. Ouazzani", role: { fr: "Responsable géophysique", en: "Head of geophysics" }, bio: { fr: "Spécialiste des levés magnétiques et de l’inversion multi-méthodes.", en: "Specialist in magnetic surveys and multi-method inversion." } },
  { id: "t3", order: 3, name: "M. El Amrani", role: { fr: "Hydrogéologue senior", en: "Senior hydrogeologist" }, bio: { fr: "Prospection ERT, essais de pompage et modélisation d’aquifères.", en: "ERT prospecting, pumping tests and aquifer modelling." } },
  { id: "t4", order: 4, name: "L. Tazi", role: { fr: "Ingénieure environnement", en: "Environmental engineer" }, bio: { fr: "Études d’impact, états initiaux et plans de gestion environnementale.", en: "Impact studies, baselines and environmental management plans." } },
];

export const adminPartners = [
  { id: "pa1", name: "ONHYM", url: "onhym.com" }, { id: "pa2", name: "Agence du Bassin Hydraulique", url: "abh-tensift.ma" },
  { id: "pa3", name: "Université Cadi Ayyad", url: "uca.ma" }, { id: "pa4", name: "Fédération de l’industrie minérale", url: "fdim.ma" },
  { id: "pa5", name: "Cluster Solaire", url: "clustersolaire.ma" }, { id: "pa6", name: "CNRST", url: "cnrst.ma" },
];

export const adminMedia = [
  ["anti-atlas-leve-01.jpg", "JPG", "4,2 MB"], ["anti-atlas-leve-02.jpg", "JPG", "3,8 MB"], ["carte-magnetique-tata.png", "PNG", "2,1 MB"],
  ["rapport-eie-essaouira.pdf", "PDF", "8,6 MB"], ["profil-ert-haouz.png", "PNG", "1,4 MB"], ["equipe-terrain-2026.jpg", "JPG", "5,1 MB"],
  ["modele-3d-bouazzer.jpg", "JPG", "6,3 MB"], ["plaquette-geoanalysis.pdf", "PDF", "3,2 MB"], ["forage-supervision-04.jpg", "JPG", "4,7 MB"],
  ["schema-methodologie.svg", "SVG", "240 KB"], ["logo-geoanalysis.png", "PNG", "180 KB"], ["donnees-piezo-2026.csv", "CSV", "96 KB"],
].map(([name, kind, size]) => ({ name, kind, size }));

export const adminSettings = { siteName: "GEOANALYSIS", languages: "FR, EN", phone: "+212 5 24 00 00 00", email: "contact@geoanalysis.ma", address: "Quartier Industriel Sidi Ghanem, Marrakech", hours: "Lun – Ven · 8h30 – 18h00", linkedin: "linkedin.com/company/geoanalysis", seoTitle: "GEOANALYSIS — Géologie, géophysique & environnement", seoDescription: "Bureau d’études basé à Marrakech." };

const publishedProjects = adminProjects.filter(({ state }) => state === "published").length;
const draftProjects = adminProjects.length - publishedProjects;
const editorialContent = [...adminArticles, ...adminNews];
const publishedEditorialContent = editorialContent.filter(({ state }) => state === "published").length;
const draftEditorialContent = editorialContent.length - publishedEditorialContent;
const newMessageCount = adminMessages.filter(({ status }) => status === "new").length;

export const adminDashboardStats = [
  { label: "Projets", value: adminProjects.length, detail: `${publishedProjects} publiés · ${draftProjects} brouillon${draftProjects === 1 ? "" : "s"}` },
  { label: "Expertises", value: adminExpertises.length, detail: `${adminExpertises.reduce((total, expertise) => total + expertise.subServices.length, 0)} sous-services` },
  { label: "Publications", value: editorialContent.length, detail: `${publishedEditorialContent} publiées · ${draftEditorialContent} brouillon${draftEditorialContent === 1 ? "" : "s"}` },
  { label: "Messages", value: adminMessages.length, detail: `${newMessageCount} nouveau${newMessageCount === 1 ? "" : "x"}` },
];

export type AdminDashboardSection = {
  id: string;
  title: string;
  href: string;
  allLabel: string;
  items: { id: string; title: string; meta: string; state: PublicationState }[];
};

export const adminDashboardSections: AdminDashboardSection[] = [
  {
    id: "projects",
    title: "Réalisations récentes",
    href: "/admin/realisations",
    allLabel: "Voir toutes les réalisations",
    items: adminProjects.slice(0, 4).map((project) => ({
      id: String(project.id),
      title: project.title.fr,
      meta: `${project.location} · ${project.date}`,
      state: project.state,
    })),
  },
  {
    id: "articles",
    title: "Articles récents",
    href: "/admin/articles",
    allLabel: "Voir tous les articles",
    items: adminArticles.slice(0, 4).map((article) => ({
      id: article.id,
      title: article.title.fr,
      meta: `${article.category.fr} · ${article.date}`,
      state: article.state,
    })),
  },
  {
    id: "news",
    title: "Actualités récentes",
    href: "/admin/actualites",
    allLabel: "Voir toutes les actualités",
    items: adminNews.slice(0, 4).map((newsItem) => ({
      id: newsItem.id,
      title: newsItem.title.fr,
      meta: `${newsItem.category.fr} · ${newsItem.date}`,
      state: newsItem.state,
    })),
  },
];

const pipelineTones: Record<MessageStatus, "new" | "qualified" | "progress" | "sent" | "won" | "lost"> = {
  new: "new",
  contacted: "qualified",
  talking: "progress",
  quoted: "sent",
  won: "won",
  lost: "lost",
};

export type AdminDashboardPipelineStage = {
  id: MessageStatus;
  label: string;
  count: number;
  tone: (typeof pipelineTones)[MessageStatus];
};

export const adminDashboardPipeline: AdminDashboardPipelineStage[] = messageStatuses.map(({ id, label }) => ({
  id,
  label: label.fr,
  count: adminMessages.filter((message) => message.status === id).length,
  tone: pipelineTones[id],
}));
