"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBullseye,
  faEnvelope,
  faFileLines,
  faFolderOpen,
  faGaugeHigh,
  faGear,
  faHandshake,
  faNewspaper,
  faPhotoFilm,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdminMessages } from "@/components/(admin)/shared/admin-messages-provider";
import { adminRouteGroups, getAdminRoute } from "./admin-routes";

const routeIcons: Record<string, IconDefinition> = {
  "/admin/dashboard": faGaugeHigh,
  "/admin/expertises": faBullseye,
  "/admin/realisations": faFolderOpen,
  "/admin/articles": faFileLines,
  "/admin/actualites": faNewspaper,
  "/admin/mediatheque": faPhotoFilm,
  "/admin/equipe": faUsers,
  "/admin/partenaires": faHandshake,
  "/admin/messages": faEnvelope,
  "/admin/parametres": faGear,
};

export function AdminSidebarNavigation() {
  const pathname = usePathname();
  const activeHref = getAdminRoute(pathname).href;
  const { messages } = useAdminMessages();
  const newMessageCount = messages.filter((message) => message.status === "new").length;

  return (
    <ul className="nav-groups">
      {adminRouteGroups.map(({ label: sectionLabel, routes }) => (
        <li className="nav-group" key={sectionLabel}>
          <div className="nav-caption">{sectionLabel}</div>
          <ul>
            {routes.map(({ href, label }) => {
              const isActive = activeHref === href;

              return (
                <li key={href}>
                  <Link className={`nav-link${isActive ? " nav-link-active" : " nav-link-muted"}`} href={href} aria-current={pathname === href ? "page" : undefined}>
                    <FontAwesomeIcon className="nav-icon" icon={routeIcons[href]} aria-hidden="true" />
                    <span>{label}</span>
                    {href === "/admin/messages" && newMessageCount > 0 && (
                      <span className="nav-count" aria-label={`${newMessageCount} nouveau${newMessageCount === 1 ? "" : "x"} message${newMessageCount === 1 ? "" : "s"}`}>
                        {newMessageCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function AdminRouteHeading() {
  const pathname = usePathname();
  const { label, href } = getAdminRoute(pathname);

  return (
    <div className="page-heading">
      <div className="breadcrumb">Administration <span aria-hidden="true">/</span> {label}</div>
      {href === "/admin/dashboard" ? <h1>{label}</h1> : <div className="page-title">{label}</div>}
    </div>
  );
}
