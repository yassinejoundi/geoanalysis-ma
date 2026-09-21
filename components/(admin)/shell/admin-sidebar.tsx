import Image from "next/image";
import Link from "next/link";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSidebarNavigation } from "./admin-navigation";
import { AdminSignOutButton } from "@/components/(admin)/sign-in/admin-sign-out-button";

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  return (
    <aside className="sidebar" aria-label="Espace d’administration">
      <Link className="brand" href="/admin/dashboard" aria-label="GEOANALYSIS — Tableau de bord">
        <Image className="brand-logo" src="/geoanalysis-logo.png" width={40} height={40} alt="" priority />
        <div>
          <div className="brand-name">GEO<span>ANALYSIS</span></div>
          <div className="brand-caption">ADMINISTRATION</div>
        </div>
      </Link>

      <nav className="sidebar-nav" aria-label="Navigation d’administration">
        <AdminSidebarNavigation />
      </nav>

      <div className="sidebar-footer">
        <div className="profile">
          <span className="avatar" aria-hidden="true">{adminEmail.slice(0, 1).toLocaleUpperCase("fr")}</span>
          <div>
            <div className="profile-name">{adminEmail}</div>
            <div className="profile-role">Administrateur</div>
          </div>
        </div>
        <AdminSignOutButton />
        <Link className="site-link" href="/fr">
          <span>Voir le site</span>
          <FontAwesomeIcon className="site-link-icon" icon={faGlobe} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
