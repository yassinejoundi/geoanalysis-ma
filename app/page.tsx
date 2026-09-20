import Image from "next/image";

const navigation = [
  { label: "Dashboard", active: true },
  { label: "Services & pages" },
  { label: "Réalisations" },
  { label: "Articles" },
  { label: "Actualités" },
  { label: "Médiathèque" },
  { label: "Équipe" },
  { label: "Partenaires" },
  { label: "Messages & demandes", badge: "7" },
  { label: "Paramètres" },
];

const statistics = [
  { label: "Services & pages", value: "3", note: "services actifs" },
  { label: "Réalisations", value: "5", note: "projets publiés" },
  { label: "Contenus éditoriaux", value: "8", note: "articles et actualités" },
  { label: "Demandes reçues", value: "7", note: "à traiter" },
];

const lists = [
  {
    id: "projects",
    title: "Derniers projets",
    items: [
      { title: "Étude topographique", meta: "Topographie · Marrakech", state: "Publié", tone: "published" },
      { title: "Cartographie des réseaux", meta: "SIG · Agadir", state: "En cours", tone: "draft" },
      { title: "Plan d’aménagement", meta: "Urbanisme · Rabat", state: "À valider", tone: "review" },
    ],
  },
  {
    id: "articles",
    title: "Derniers articles",
    items: [
      { title: "La donnée géographique au service des territoires", meta: "Article · 6 min", state: "Publié", tone: "published" },
      { title: "Comprendre les systèmes d’information géographique", meta: "Article · 4 min", state: "Brouillon", tone: "draft" },
      { title: "Cartographier pour mieux décider", meta: "Article · 5 min", state: "À valider", tone: "review" },
    ],
  },
  {
    id: "news",
    title: "Dernières actualités",
    items: [
      { title: "Nouveau projet de cartographie territoriale", meta: "Actualité · 12 juin", state: "Publié", tone: "published" },
      { title: "Geoanalysis accompagne les collectivités", meta: "Actualité · 4 juin", state: "Publié", tone: "published" },
      { title: "Nos équipes sur le terrain", meta: "Actualité · 28 mai", state: "Brouillon", tone: "draft" },
    ],
  },
];

const pipeline = [
  { label: "Nouvelles", value: "2", tone: "pipeline-new" },
  { label: "Qualifiées", value: "1", tone: "pipeline-qualified" },
  { label: "Devis envoyés", value: "1", tone: "pipeline-sent" },
  { label: "En cours", value: "1", tone: "pipeline-progress" },
  { label: "Gagnées", value: "1", tone: "pipeline-won" },
  { label: "Perdues", value: "1", tone: "pipeline-lost" },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="search-icon">
      <circle cx="6.8" cy="6.8" r="4.4" />
      <path d="m10.1 10.1 3.1 3.1" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <Image
            src="/geoanalysis-logo.png"
            alt=""
            width={40}
            height={40}
            className="brand-logo"
            priority
          />
          <div>
            <div className="brand-name">
              GEO<span>ANALYSIS</span>
            </div>
            <div className="brand-caption">ADMINISTRATION</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navigation principale">
          <div className="nav-caption">ESPACE DE TRAVAIL</div>
          <ul>
            {navigation.map((item) => (
              <li key={item.label}>
                {item.active ? (
                  <a className="nav-link nav-link-active" href="#dashboard" aria-current="page">
                    <span className="nav-mark" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <span className="nav-link nav-link-muted">
                    <span className="nav-mark" aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="profile">
            <div className="avatar" aria-hidden="true">SB</div>
            <div>
              <div className="profile-name">S. Benali</div>
              <div className="profile-role">Administrateur</div>
            </div>
          </div>
          <div className="site-link" aria-hidden="true">VOIR LE SITE <span>↗</span></div>
        </div>
      </aside>

      <main className="workspace" id="dashboard">
        <header className="topbar">
          <div className="page-heading">
            <div className="breadcrumb">ADMINISTRATION <span>/</span> APERÇU</div>
            <h1>Dashboard</h1>
          </div>
          <div className="topbar-actions">
            <div className="search-preview" aria-hidden="true">
              <SearchIcon />
              <span>Rechercher...</span>
            </div>
            <div className="language-preview" aria-hidden="true">
              <span className="language-active">FR</span>
              <span>EN</span>
            </div>
            <span className="button-preview" aria-hidden="true">+ Nouveau</span>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="stats-grid" aria-label="Vue d’ensemble">
            {statistics.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-topline">
                  <h2>{stat.label}</h2>
                  <span className="stat-dot" aria-hidden="true" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <p>{stat.note}</p>
              </article>
            ))}
          </section>

          <section className="lists-grid" aria-label="Contenus récents">
            {lists.map((list) => (
              <article className="panel" id={list.id} key={list.id}>
                <div className="panel-heading">
                  <h2>{list.title}</h2>
                  <span className="panel-link" aria-hidden="true">Tout voir <span>→</span></span>
                </div>
                <ul className="record-list">
                  {list.items.map((item, index) => (
                    <li className="record-row" key={item.title}>
                      <span className={`record-thumb record-thumb-${index + 1}`} aria-hidden="true" />
                      <span className="record-copy">
                        <span className="record-title">{item.title}</span>
                        <span className="record-meta">{item.meta}</span>
                      </span>
                      <span className={`status-pill status-${item.tone}`}>{item.state}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="panel pipeline-panel" aria-labelledby="pipeline-title">
            <div className="panel-heading">
              <h2 id="pipeline-title">Pipeline commercial</h2>
              <span className="panel-link" aria-hidden="true">Messages & demandes <span>→</span></span>
            </div>
            <ul className="pipeline-grid">
              {pipeline.map((stage) => (
                <li className="pipeline-stage" key={stage.label}>
                  <span className="pipeline-label">{stage.label}</span>
                  <span className={`pipeline-value ${stage.tone}`}>{stage.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
