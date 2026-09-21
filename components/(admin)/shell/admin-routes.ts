type AdminRoute = { href: string; label: string };
type AdminRouteGroup = { label: string; routes: readonly AdminRoute[] };

export const adminRouteGroups: readonly AdminRouteGroup[] = [
  {
    label: "Vue d’ensemble",
    routes: [{ href: "/admin/dashboard", label: "Tableau de bord" }],
  },
  {
    label: "Contenus",
    routes: [
      { href: "/admin/expertises", label: "Expertises" },
      { href: "/admin/realisations", label: "Réalisations" },
      { href: "/admin/articles", label: "Articles" },
      { href: "/admin/actualites", label: "Actualités" },
      { href: "/admin/mediatheque", label: "Médiathèque" },
    ],
  },
  {
    label: "Organisation",
    routes: [
      { href: "/admin/equipe", label: "Équipe" },
      { href: "/admin/partenaires", label: "Partenaires" },
      { href: "/admin/messages", label: "Messages" },
    ],
  },
  {
    label: "Configuration",
    routes: [{ href: "/admin/parametres", label: "Paramètres" }],
  },
];

export const adminRoutes: readonly AdminRoute[] = adminRouteGroups.flatMap(({ routes }) => routes);

export function getAdminRoute(pathname: string) {
  return adminRoutes.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`)) ?? adminRoutes[0];
}
