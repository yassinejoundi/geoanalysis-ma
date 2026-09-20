"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRoutes, getAdminRoute } from "./admin-routes";

export function AdminSidebarNavigation() {
  const pathname = usePathname();
  const activeHref = getAdminRoute(pathname).href;

  return (
    <ul>
      {adminRoutes.map(({ href, label }) => {
        const isActive = activeHref === href;

        return (
          <li key={href}>
            <Link className={`nav-link${isActive ? " nav-link-active" : " nav-link-muted"}`} href={href} aria-current={pathname === href ? "page" : undefined}>
              <span className="nav-mark" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminRouteHeading() {
  const pathname = usePathname();
  const { label, href } = getAdminRoute(pathname);

  return (
    <div className="page-heading">
      <div className="breadcrumb">Administration <span aria-hidden="true">/</span> {label}</div>
      {href === "/admin" ? <h1>{label}</h1> : <div className="page-title">{label}</div>}
    </div>
  );
}
