import { AdminRouteHeading } from "./admin-navigation";

export function AdminTopbar() {
  return (
    <header className="topbar">
      <AdminRouteHeading />
      <div className="topbar-actions">
        <div className="search-preview" aria-disabled="true">
          <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="6.8" cy="6.8" r="4.6" />
            <path d="m10.2 10.2 3.1 3.1" />
          </svg>
          <span>Recherche indisponible</span>
        </div>
        <div className="language-preview" lang="fr">
          <span className="language-active">FR</span>
        </div>
      </div>
    </header>
  );
}
