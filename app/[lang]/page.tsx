import type { Metadata } from "next";
import Link from "next/link";
import { EditorialCard, ProjectCard, SectionHeading } from "@/components/site/home-cards";
import { articles, expertises, methodGroups, news, projects } from "@/lib/content/site";
import { isLocale, localize } from "@/lib/i18n";
import { notFound } from "next/navigation";

const copy = {
  fr: {
    title: "GEOANALYSIS — Géologie, géophysique & environnement",
    description: "Bureau d’études à Marrakech. De la donnée terrain à la décision en géologie, géophysique et environnement.",
    kicker: "Bureau d’études · Marrakech, Maroc", hero: "Géologie, géophysique & environnement", sub: "De la donnée terrain à la décision.",
    intro: "GEOANALYSIS accompagne opérateurs miniers, institutions publiques et collectivités dans l’acquisition, le traitement et l’interprétation de données géoscientifiques sur l’ensemble du territoire marocain.", expertise: "Nos expertises", talk: "Parler de votre projet", stats: [["12+", "années d’expérience"], ["340+", "missions réalisées"], ["18", "provinces couvertes"], ["96%", "de clients récurrents"]],
    aboutKicker: "Le Bureau", aboutTitle: "Un bureau d’études scientifique, indépendant et rigoureux", about: "Fondé à Marrakech, GEOANALYSIS réunit géologues, géophysiciens et ingénieurs environnement autour d’une même exigence : produire une donnée traçable, vérifiable et directement exploitable dans la décision technique et réglementaire.", about2: "Nos équipes interviennent sur des contextes variés — massifs de l’Anti-Atlas, bassins sédimentaires, périmètres d’irrigation, zones urbaines — avec des protocoles normalisés et des chaînes de traitement documentées.", discover: "Découvrir le bureau", pillars: [["Terrain", "Équipes et instruments propres"], ["Traitement", "Chaînes documentées et reproductibles"], ["Décision", "Livrables directement exploitables"]],
    expTitle: "Trois domaines, un même socle méthodologique", expDesc: "Chaque domaine se décline en sous-services mobilisables séparément ou en mission intégrée, du cadrage initial jusqu’au rapport final.", methodKicker: "Méthodologie", methodTitle: "Un processus en quatre temps, du cadrage au livrable", steps: [["01", "Cadrage", "Objectifs, contraintes et données disponibles définissent le protocole."], ["02", "Acquisition", "Campagnes de terrain instrumentées, protocoles normalisés et contrôle qualité."], ["03", "Traitement", "Inversion, modélisation et intégration multi-sources en environnement SIG."], ["04", "Restitution", "Rapport interprétatif, cartes livrables et recommandations opérationnelles."]],
    methods: "Méthodes & Technologies", methodsTitle: "Instrumentation, acquisition, traitement", methodsLink: "Voir le parc technique", projects: "Réalisations", projectsTitle: "Missions récentes", projectsLink: "Toutes les réalisations", news: "Actualités", articles: "Articles", all: "Tout voir", read: "de lecture", projectImage: "MISSION GÉOSCIENTIFIQUE", expertiseImage: "DOMAINE D’EXPERTISE",
  },
  en: {
    title: "GEOANALYSIS — Geology, geophysics & environment",
    description: "Marrakech-based consultancy. From field data to decisions in geology, geophysics and environment.",
    kicker: "Consultancy · Marrakech, Morocco", hero: "Geology, geophysics & environment", sub: "From field data to decisions.",
    intro: "GEOANALYSIS supports mining operators, public institutions and local authorities with the acquisition, processing and interpretation of geoscientific data across Morocco.", expertise: "Our expertise", talk: "Discuss your project", stats: [["12+", "years of experience"], ["340+", "projects completed"], ["18", "provinces covered"], ["96%", "returning clients"]],
    aboutKicker: "The firm", aboutTitle: "An independent, rigorous scientific consultancy", about: "Founded in Marrakech, GEOANALYSIS brings geologists, geophysicists and environmental engineers together around one standard: producing traceable, verifiable data that informs technical and regulatory decisions.", about2: "Our teams work across varied settings — the Anti-Atlas ranges, sedimentary basins, irrigation areas and urban zones — using standardised protocols and documented processing workflows.", discover: "Discover the firm", pillars: [["Fieldwork", "In-house teams and instruments"], ["Processing", "Documented, reproducible workflows"], ["Decisions", "Directly actionable deliverables"]],
    expTitle: "Three fields, one methodological foundation", expDesc: "Each field includes services that can be commissioned separately or as an integrated assignment, from initial scoping to final report.", methodKicker: "Methodology", methodTitle: "Four steps, from scoping to deliverables", steps: [["01", "Scoping", "Objectives, constraints and available data define the protocol."], ["02", "Acquisition", "Instrumented field campaigns, standardised protocols and quality control."], ["03", "Processing", "Inversion, modelling and multi-source integration in a GIS environment."], ["04", "Reporting", "Interpretive report, deliverable maps and operational recommendations."]],
    methods: "Methods & Technology", methodsTitle: "Instrumentation, acquisition, processing", methodsLink: "Explore our equipment", projects: "Projects", projectsTitle: "Recent assignments", projectsLink: "All projects", news: "News", articles: "Articles", all: "View all", read: "read", projectImage: "GEOSCIENTIFIC ASSIGNMENT", expertiseImage: "AREA OF EXPERTISE",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: copy[lang].title, description: copy[lang].description };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const text = copy[lang];
  const shownProjects = projects.slice(0, 3);
  const shownNews = news.slice(0, 3);
  const shownArticles = articles.slice(0, 2);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker">{text.kicker}</p>
            <h1>{text.hero}</h1>
            <p className="home-hero-subtitle">{text.sub}</p>
            <p className="home-lead">{text.intro}</p>
            <div className="home-actions"><Link className="home-primary-action" href={`/${lang}/expertises`}>{text.expertise}</Link><Link className="home-secondary-action" href={`/${lang}/contact`}>{text.talk}</Link></div>
          </div>
          <div className="home-terrain" aria-hidden="true"><div className="terrain-rings"/><div className="terrain-mountain terrain-back"/><div className="terrain-mountain terrain-front"/><div className="terrain-mountain terrain-peak"/></div>
          <dl className="home-stats">{text.stats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
        </div>
      </section>

      <section className="home-about home-section">
        <div><SectionHeading kicker={text.aboutKicker} title={text.aboutTitle}/><Link className="home-text-link" href={`/${lang}/bureau`}>{text.discover} <span aria-hidden="true">→</span></Link></div>
        <div><p className="home-about-lead">{text.about}</p><p className="home-body-copy">{text.about2}</p><ul className="home-pillars">{text.pillars.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ul></div>
      </section>

      <section className="home-band">
        <div className="home-section-inner"><SectionHeading kicker={text.expertise} title={text.expTitle}/><p className="home-section-lead">{text.expDesc}</p>
          <div className="home-expertise-grid">{expertises.map((item) => <Link className="home-expertise-card" href={`/${lang}/expertises/${item.slug}`} key={item.id}><span className="home-card-number">{item.number}</span><span className="home-placeholder home-expertise-placeholder" aria-hidden="true">{text.expertiseImage}</span><h3>{localize(item.name, lang)}</h3><p>{localize(item.summary, lang)}</p><span className="home-tags">{item.subServices.slice(0, 3).map((service) => <span key={service.name.fr}>{localize(service.name, lang)}</span>)}</span></Link>)}</div>
        </div>
      </section>

      <section className="home-section home-process"><SectionHeading kicker={text.methodKicker} title={text.methodTitle}/><ol className="home-steps">{text.steps.map(([number, title, body]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>

      <section className="home-band home-methods"><div className="home-section-inner"><div className="home-section-heading-row"><SectionHeading kicker={text.methods} title={text.methodsTitle}/><Link className="home-text-link" href={`/${lang}/methodes-technologies`}>{text.methodsLink} <span aria-hidden="true">→</span></Link></div><div className="home-method-grid">{methodGroups.flatMap((group) => group.items.slice(0, 2).map((method) => <div key={`${group.id}-${method}`}><span aria-hidden="true"/><h3>{method}</h3><p>{localize(group.title, lang)}</p></div>))}</div></div></section>

      <section className="home-section"><div className="home-section-heading-row"><SectionHeading kicker={text.projects} title={text.projectsTitle}/><Link className="home-text-link" href={`/${lang}/realisations`}>{text.projectsLink} <span aria-hidden="true">→</span></Link></div><div className="home-project-grid">{shownProjects.map((project) => <ProjectCard key={project.id} project={project} locale={lang} imageLabel={text.projectImage}/>)}</div></section>

      <section className="home-band home-editorial"><div className="home-section-inner home-editorial-grid"><div><div className="home-section-heading-row"><SectionHeading kicker={lang === "fr" ? "La vie du bureau" : "From the firm"} title={text.news}/><Link className="home-text-link" href={`/${lang}/actualites`}>{text.all} <span aria-hidden="true">→</span></Link></div><div className="home-news-list">{shownNews.map((entry) => <EditorialCard key={entry.id} entry={entry} locale={lang} kind="actualites"/>)}</div></div><div><div className="home-section-heading-row"><SectionHeading kicker={lang === "fr" ? "Nos analyses" : "Expert insight"} title={text.articles}/><Link className="home-text-link" href={`/${lang}/articles`}>{text.all} <span aria-hidden="true">→</span></Link></div><div className="home-article-list">{shownArticles.map((entry) => <EditorialCard key={entry.id} entry={entry} locale={lang} kind="articles" readLabel={text.read}/>)}</div></div></div></section>
    </main>
  );
}
