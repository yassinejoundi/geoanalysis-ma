"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { faBars, faGlobe, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSignOutButton } from "@/components/(admin)/sign-in/admin-sign-out-button";
import { AdminSidebarNavigation } from "./admin-navigation";

export function AdminMobileNavigation({ adminEmail }: { adminEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 680px)");
    const closeOnDesktop = () => {
      if (mobileViewport.matches) return;
      dialogRef.current?.close();
      setIsOpen(false);
    };

    mobileViewport.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => mobileViewport.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <header className="mobile-admin-navbar">
        <Link className="mobile-admin-brand" href="/admin/dashboard" aria-label="GEOANALYSIS — Tableau de bord">
          <Image className="brand-logo" src="/geoanalysis-logo.png" width={40} height={40} alt="" priority />
          <span className="brand-name">GEO<span>ANALYSIS</span></span>
        </Link>
        <button
          className="mobile-admin-menu-button"
          type="button"
          aria-label="Ouvrir la navigation"
          aria-controls="admin-mobile-sidebar"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} aria-hidden="true" />
        </button>
      </header>

      <dialog
        className="mobile-sidebar-dialog"
        id="admin-mobile-sidebar"
        ref={dialogRef}
        aria-label="Navigation d’administration"
        onClose={() => setIsOpen(false)}
      >
        <aside className="sidebar mobile-sidebar-panel" aria-label="Espace d’administration">
          <div className="mobile-sidebar-header">
            <Link className="brand" href="/admin/dashboard" aria-label="GEOANALYSIS — Tableau de bord" onClick={() => setIsOpen(false)}>
              <Image className="brand-logo" src="/geoanalysis-logo.png" width={40} height={40} alt="" priority />
              <div>
                <div className="brand-name">GEO<span>ANALYSIS</span></div>
                <div className="brand-caption">ADMINISTRATION</div>
              </div>
            </Link>
            <button
              className="mobile-sidebar-close"
              type="button"
              aria-label="Fermer la navigation"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Navigation d’administration">
            <AdminSidebarNavigation onNavigate={() => setIsOpen(false)} />
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
            <Link className="site-link" href="/fr" onClick={() => setIsOpen(false)}>
              <span>Voir le site</span>
              <FontAwesomeIcon className="site-link-icon" icon={faGlobe} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </dialog>
    </>
  );
}
