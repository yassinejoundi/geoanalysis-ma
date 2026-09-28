import Link from "next/link";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminRouteHeading } from "./admin-navigation";
import { AdminSignOutButton } from "@/components/(admin)/sign-in/admin-sign-out-button";

export function AdminTopbar() {
  return (
    <header className="topbar">
      <AdminRouteHeading />
      <div className="topbar-actions">
        <AdminSignOutButton />
        <Link className="site-link" href="/fr">
          <span>Voir le site</span>
          <FontAwesomeIcon className="site-link-icon" icon={faGlobe} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
