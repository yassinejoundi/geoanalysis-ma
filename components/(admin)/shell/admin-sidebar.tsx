import Image from "next/image";
import Link from "next/link";
import { AdminSidebarNavigation } from "./admin-navigation";
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
          <AdminSidebarNavigation adminEmail={adminEmail} />
        </nav>
      </aside>
      <AdminMobileNavigation adminEmail={adminEmail} whiteLogoUrl={whiteLogoUrl} />
    </>
  );
}
