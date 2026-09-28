import Image from "next/image";
import Link from "next/link";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSidebarNavigation } from "./admin-navigation";
import { AdminSignOutButton } from "@/components/(admin)/sign-in/admin-sign-out-button";
import { AdminMobileNavigation } from "./admin-mobile-navigation";

const whiteLogoUrl =
  "https://res.cloudinary.com/d7qa2cop/image/upload/v1790632336/geoanalysis/logo/geoanalysis-logo-white.png";

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  return (
    <>
      <aside className="sidebar" aria-label="Espace d’administration">
        <Link className="brand" href="/admin/dashboard" aria-label="GEOANALYSIS — Tableau de bord">
          <Image className="brand-logo brand-sidebar-logo" src={whiteLogoUrl} width={1873} height={840} alt="" priority />
          <span className="brand-caption">administration</span>
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
      <AdminMobileNavigation adminEmail={adminEmail} whiteLogoUrl={whiteLogoUrl} />
    </>
  );
}
