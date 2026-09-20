import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { AdminSearchProvider } from "./admin-search";

export function AdminShell({ children, adminEmail }: { children: ReactNode; adminEmail: string }) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-content">Passer au contenu principal</a>
      <AdminSidebar adminEmail={adminEmail} />
      <div className="workspace">
        <AdminSearchProvider>
          <AdminTopbar />
          <div id="admin-content" tabIndex={-1}>{children}</div>
        </AdminSearchProvider>
      </div>
    </div>
  );
}
