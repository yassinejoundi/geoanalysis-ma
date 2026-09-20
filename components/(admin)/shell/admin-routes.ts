export const adminRoutes = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/expertises", label: "Expertises" },
  { href: "/admin/realisations", label: "Réalisations" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/mediatheque", label: "Médiathèque" },
  { href: "/admin/equipe", label: "Équipe" },
  { href: "/admin/partenaires", label: "Partenaires" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/parametres", label: "Paramètres" },
] as const;

export function getAdminRoute(pathname: string) {
  return adminRoutes.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`)) ?? adminRoutes[0];
}
