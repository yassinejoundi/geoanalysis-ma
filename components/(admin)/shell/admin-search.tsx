"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type AdminSearchValue = {
  query: string;
  setQuery: (query: string) => void;
};

const AdminSearchContext = createContext<AdminSearchValue | null>(null);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <RouteSearchProvider key={pathname}>
      {children}
    </RouteSearchProvider>
  );
}

function RouteSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <AdminSearchContext.Provider
      value={{ query, setQuery }}
    >
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);
  if (!context) throw new Error("Admin search requires AdminSearchProvider.");
  return context;
}

export function AdminRouteSearch() {
  const pathname = usePathname();
  const { query, setQuery } = useAdminSearch();
  const inputId = useId();
  const routeLabel =
    pathname === "/admin/realisations"
      ? "les réalisations"
      : pathname === "/admin/articles"
        ? "les articles"
        : pathname === "/admin/actualites"
          ? "les actualités"
          : null;

  if (!routeLabel) {
    return (
      <div className="search-preview" aria-disabled="true">
        <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="6.8" cy="6.8" r="4.6" />
          <path d="m10.2 10.2 3.1 3.1" />
        </svg>
        <span>Recherche indisponible</span>
      </div>
    );
  }

  return (
    <div className="search-preview admin-search">
      <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="6.8" cy="6.8" r="4.6" />
        <path d="m10.2 10.2 3.1 3.1" />
      </svg>
      <label className="visually-hidden" htmlFor={inputId}>
        Rechercher parmi {routeLabel}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Rechercher…"
      />
    </div>
  );
}
