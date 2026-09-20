import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/(admin)/shell/admin-shell";
import { getAdminAccess } from "@/lib/server/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await connection();
  const access = await getAdminAccess();
  if ("response" in access && access.response.status === 401) redirect("/sign-in");
  if ("response" in access) {
    return (
      <main className="admin-sign-in-page">
        <section className="admin-sign-in-card" aria-labelledby="admin-denied-title">
          <p className="admin-eyebrow">GEOANALYSIS · ADMINISTRATION</p>
          <h1 id="admin-denied-title">Accès refusé</h1>
          <p>Ce compte n’est pas autorisé à accéder à l’administration.</p>
        </section>
      </main>
    );
  }

  return <AdminShell adminEmail={access.actor.email}>{children}</AdminShell>;
}
