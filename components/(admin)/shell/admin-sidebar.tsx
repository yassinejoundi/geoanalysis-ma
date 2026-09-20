import Image from "next/image";
import Link from "next/link";
import { AdminSidebarNavigation } from "./admin-navigation";

export function AdminSidebar() {
  return (
    <aside className="sidebar" aria-label="Espace d’administration">
      <Link className="brand" href="/admin" aria-label="GEOANALYSIS — Tableau de bord">
        <Image className="brand-logo" src="/geoanalysis-logo.png" width={40} height={40} alt="" priority />
        <div>
          <div className="brand-name">GEO<span>ANALYSIS</span></div>
          <div className="brand-caption">ADMINISTRATION</div>
        </div>
      </Link>

      <nav className="sidebar-nav" aria-label="Navigation d’administration">
        <div className="nav-caption">CONTENU</div>
        <AdminSidebarNavigation />
      </nav>

      <div className="sidebar-footer">
        <div className="profile">
          <span className="avatar" aria-hidden="true">SB</span>
          <div>
            <div className="profile-name">S. Benali</div>
            <div className="profile-role">Administrateur</div>
          </div>
        </div>
        <Link className="site-link" href="/fr">Voir le site <span aria-hidden="true">↗</span></Link>
      </div>
    </aside>
  );
}
