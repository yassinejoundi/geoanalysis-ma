import { AdminRouteHeading } from "./admin-navigation";
import { AdminRouteSearch } from "./admin-search";

export function AdminTopbar() {
  return (
    <header className="topbar">
      <AdminRouteHeading />
      <div className="topbar-actions">
        <AdminRouteSearch />
        <div className="language-preview" lang="fr">
          <span className="language-active">FR</span>
        </div>
      </div>
    </header>
  );
}
